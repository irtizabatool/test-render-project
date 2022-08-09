import { BadRequestException, HttpException, HttpStatus, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthHelpers } from '../../shared/helpers/auth.helpers';
import { GLOBAL_CONFIG } from '../../configs/global.config';

import * as jwt from 'jsonwebtoken';
import { UserRegisterDto } from './dto/UserRegister.dto';
import { UserLoginDto } from './dto/UserLogin.dto';
import { AuthResponseDTO } from './dto/AuthResponse.dto';
import { User } from '@prisma/client';
import { ForgotPasswordDto } from './dto/ForgotPassword.dto';
import { ResetPasswordDto } from './dto/ResetPassword.dto';
import { ForgotPasswordDecodedPayload } from 'src/interfaces/ForgotPasswordPayload';
import { genSalt, hash } from 'bcrypt';
import { EmailService } from '../email/email.service';
import { JWT_SECRET } from 'src/shared/constants/global.constants';
import { CheckLinkDto } from './dto/CheckLink.dto';
import { PasswordResponseDto } from './dto/PasswordResponse.dto';
import { TokenPayloadDto } from './dto/TokenPayload.dto';
import { UserDto } from './dto/User.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  public async login(userLoginDto: UserLoginDto): Promise<User> {
    const userData = await this.userService.findUser(userLoginDto.email);
    
    if (!userData) {
      throw new UnauthorizedException('Incorrect Email or Password');
    }

    const isMatch = await AuthHelpers.validateHash(
      userLoginDto.password,
      userData && userData.password,
    );
    

    if (!isMatch) {
      throw new UnauthorizedException('Incorrect Email or Password');
    }
    return userData;
  }

  public async register(userRegisterDto: UserRegisterDto): Promise<User> {
    const userCreated = await this.userService.createUser(userRegisterDto);
    return userCreated;
  }

  public async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<PasswordResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { email: forgotPasswordDto.email}
    });

    if (!user) {
      throw new BadRequestException('User with this email does not exist');
    }
    const secret = JWT_SECRET + user.password;

    const payload = {
      email: user.email,
      id: user.id
    }

    const token =  jwt.sign(payload, secret, {
      expiresIn: '15m'    
    });

    const confirmPassChangeURL = `${process.env.FRONTEND_URL}/${user.id}/${token}`;
    Logger.log(confirmPassChangeURL)
    
    this.emailService.sendEmail(
      user.email,
      [],
      [],
      'Reset Password Link',
      './reset-password',
      {
        link: confirmPassChangeURL
      }
    );
    
    // Sending the token and user Id for testing purposes not meant for production
    const passwordPayload = {
      userId: user.id,
      token
    }

    return passwordPayload;
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<boolean> {
    const decoded = this.jwtService.decode(resetPasswordDto.token) as ForgotPasswordDecodedPayload;
    const email = decoded.email;

    const user = await this.prisma.user.findUnique({
      where: { email }
    });
    if (!user) {
      throw new BadRequestException('User with this email was not found');
    } 

    const secret = JWT_SECRET + user.password;
    try {
    const tokenVerified = jwt.verify(resetPasswordDto.token, secret);

    if(!tokenVerified) {
      throw new BadRequestException('Password could not be reset');
    }
    } catch (error) {
      throw new HttpException('The Reset Password link expired', HttpStatus.BAD_REQUEST);
    }

    const salt = await genSalt(10);
    const hashedPassword = await hash(resetPasswordDto.password, salt);
    user.password = hashedPassword;
    await this.prisma.user.update({
      where: {id: user.id},
      data: {...user}
    });
    return true;
  }

  async checkLinkExpiry(checkLinkDto: CheckLinkDto): Promise<boolean> {
    const decoded = this.jwtService.decode(checkLinkDto.token) as ForgotPasswordDecodedPayload;
    const email = decoded.email;
    const { id } = checkLinkDto;

    const user = await this.prisma.user.findFirst({
      where: { id, email }
    });
    
    if (!user) {
      throw new BadRequestException('User with this email or Id was not found');
    } 

    const secret = JWT_SECRET + user.password;
    try {
      const tokenVerified = jwt.verify(checkLinkDto.token, secret);

      if(!tokenVerified) {
        throw new HttpException('The Reset Password link expired', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      throw new HttpException('The Reset Password link expired', HttpStatus.BAD_REQUEST);
    }
    return true;
  }

  async createToken(user: User): Promise<TokenPayloadDto> {
    const expiresIn = GLOBAL_CONFIG.security.expiresIn;
    const accessToken = this.jwtService.sign(user, {
      expiresIn,
    });
    
    return new TokenPayloadDto(expiresIn, accessToken)
  }
}
