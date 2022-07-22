import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthHelpers } from '../../shared/helpers/auth.helpers';
import { GLOBAL_CONFIG } from '../../configs/global.config';


import { UserRegisterDto } from './dto/UserRegister.dto';
import { UserLoginDto } from './dto/UserLogin.dto';
import { AuthResponseDTO } from './dto/AuthResponse.dto';
import { User } from '@prisma/client';
import { ForgotPasswordDto } from './dto/ForgotPassword.dto';
import { ResetPasswordDto } from './dto/ResetPassword.dto';
import { ForgotPasswordDecodedPayload } from 'src/interfaces/ForgotPasswordPayload';
import { genSalt, hash } from 'bcrypt';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  public async login(userLoginDto: UserLoginDto): Promise<AuthResponseDTO> {
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

    const payload = {
      id: userData.id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      companyName: userData.companyName,
      email: userData.email,
      password: null,
      role: userData.role,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: GLOBAL_CONFIG.security.expiresIn,
    });

    return {
      user: payload,
      accessToken: accessToken,
    };
  }

  public async register(user: UserRegisterDto): Promise<AuthResponseDTO> {
    const userCreated = await this.userService.createUser(user);
    const payload = {
      id: userCreated.id,
      firstName: userCreated.firstName,
      lastName: userCreated.lastName,
      companyName: userCreated.companyName,
      email: userCreated.email,
      password: null,
      role: userCreated.role,
      createdAt: userCreated.createdAt,
      updatedAt: userCreated.updatedAt
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: GLOBAL_CONFIG.security.expiresIn,
    });

    return {
      user: payload,
      accessToken: accessToken,
    };
  }

  public async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email: forgotPasswordDto.email}
    });

    if (!user) {
      throw new BadRequestException('User with this email was not found');
    }

    const token = this.jwtService.sign({
      email: forgotPasswordDto.email,
    });

    const forgotPasswordRoute = 'forgot-password/confirm';
    const confirmPassChangeURL = `${process.env.FRONTEND_URL}/${forgotPasswordRoute}/${token}`;
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
    
    
    return true;
    // return confirmPassChangeURL;
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
    const salt = await genSalt(10);
    const hashedPassword = await hash(resetPasswordDto.password, salt);
    user.password = hashedPassword;
    await this.prisma.user.update({
      where: {id: user.id},
      data: {...user}
    });
    return true;
  }

}
