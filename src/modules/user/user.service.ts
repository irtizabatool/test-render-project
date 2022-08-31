import { BadRequestException, HttpException, HttpStatus, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { Prisma, RoleType, User, UserStatus } from "@prisma/client";
import { genSalt, hash } from "bcrypt";
import { randomUUID } from "crypto";
import { DO_ACCESS_KEY_ID, DO_BUCKET_NAME, DO_END_POINT, DO_SECRET_ACCESS_KEY, DO_URL, JWT_SECRET } from "../../shared/constants/global.constants";
import { UserRegisterDto } from "../auth/dto/UserRegister.dto";
import { EmailService } from "../email/email.service";

import { PrismaService } from "../prisma/prisma.service";
import { ChecksService } from "./checks.service";
import { UserInviteDto } from "./dto/UserInvite.dto";
import * as jwt from 'jsonwebtoken';

import * as AWS from 'aws-sdk';
import { InviteAcceptDto } from "./dto/AcceptInvite.dto";
import { ForgotPasswordDecodedPayload } from "../../interfaces/ForgotPasswordPayload";
import { UserDto } from "../auth/dto/User.dto";
import { UserFilterDto } from "./dto/UserFilter.dto";
import { PageOptionsDto } from "../../common/dto/PaginationDto";
import { PageDto } from "../../common/dto/PageDto";
import { UtilsService } from "../../common/utils/utils.service";
import { CheckUserStatusDto } from "./dto/ChangeUserStatus.dto";
import { UserUpdateDto } from "./dto/UserUpdate.dto";
import { PasswordResponseDto } from "../auth/dto/PasswordResponse.dto";
import { ChangePasswordDto } from "../auth/dto/ChangePassword.dto";
import { AuthHelpers } from "../../shared/helpers/auth.helpers";
import { IFile } from "../../interfaces/IFile";
const logger = new Logger('UserService');

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private checksService: ChecksService,
    private emailService: EmailService,
  ) {}

  async findUser(email: string): Promise<User | null> {
    try {
      const userFound = await this.prisma.user.findUnique({
        where: { email },
      });
      return userFound;
    } catch (e) {
      throw new UnauthorizedException('User with this Email or Password was not found');
    }
  }

  async users(
    filterData: UserFilterDto,
    searchQuery: string,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto> {
    try {
      const [itemCount, users] = await this.prisma.$transaction([
        this.prisma.user.count({
          where: {
            NOT: {
                    role: RoleType.SUPER_ADMIN,
                  },
            AND: [
              {
                ...filterData,
              },
            ],
            OR: [
              {
                firstName: { contains: searchQuery },
              },
              {
                lastName: { contains: searchQuery },
              },
              {
                email: { contains: searchQuery },
              },
            ],
          },
        }),
        this.prisma.user.findMany({
          skip: pageOptionsDto.skip,
          take: pageOptionsDto.take,
          where: {
            NOT: {
              role: RoleType.SUPER_ADMIN,
            },
            AND: [
              {
                ...filterData,
              },
            ],
            OR: [
              {
                firstName: { contains: searchQuery },
              },
              {
                lastName: { contains: searchQuery },
              },
              {
                email: { contains: searchQuery },
              },
            ],
          },
          orderBy: [
            {
              firstName: pageOptionsDto.sortOrder,
            },
          ],
        }),
      ]);
      users.forEach((users) => {
        users.password = null;
      });
      return UtilsService.Pagination(users, pageOptionsDto, itemCount);
    } catch (error) {
      Logger.log(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async createUser(userRegisterDto: UserRegisterDto): Promise<User> {
    const { email, password } = userRegisterDto;
    await this.checksService.userEmailExists(email.toLowerCase());
    const salt = await genSalt(10);
    userRegisterDto.password = await hash(userRegisterDto.password, salt);
   logger.log('Creating super admin')
    const user = await this.prisma.user.create({
      data: {
        email: email.toLowerCase(),
        ...userRegisterDto,
        status: UserStatus.JOINED,
        organisation: {
          create: {
            companyName: process.env.COMPANY_NAME,
          }
        }
      }
    });
    return user;
  }

  async inviteUser(userInviteDto: UserInviteDto, currentLoggedInUser: User ): Promise<PasswordResponseDto> {
    await this.checksService.checkForSuperAdmin(userInviteDto.role);
    
    userInviteDto.email = userInviteDto.email.toLowerCase();
    await this.checksService.userEmailExists(userInviteDto.email);

    let password = randomUUID()
    const salt = await genSalt(10);
    password = await hash(password, salt);
    let user;
    try {
      user = await this.prisma.user.create({
        data: {
          ...userInviteDto,
          password,
          organisation:{ 
            connect:  { id: currentLoggedInUser.organisationId }
          }
        },
        
      });
    } catch(error) {
      throw new BadRequestException('User cannot be Invited, please try again');
    } 

  
    const secret = JWT_SECRET + user.password;

    const payload  = {
      email: user.email,
      userId: user.id,
    }

    const token =  jwt.sign(payload, secret, {
      expiresIn: '24h'    
    });

    const invitationLinkUrl = `${process.env.FRONTEND_URL_JOIN}/${user.id}/${token}`;
    Logger.log(invitationLinkUrl)
    
    this.emailService.sendEmail(
      user.email,
      [],
      [],
      'Crownstack ATS Invitation',
      './send-invitation',
      {
        user: user.firstName,
        link: invitationLinkUrl
      }
    );
    
    // Sending the token and user Id for testing purposes not meant for production
    const passwordPayload = {
      userId: user.id,
      token
    }

    return passwordPayload;
  }

  async acceptInvitation(inviteAcceptDto: InviteAcceptDto): Promise<boolean> {
    let email;
    try {
      const decoded = jwt.decode(inviteAcceptDto.token) as ForgotPasswordDecodedPayload;
     email = decoded.email;
    } catch (error) {
      Logger.log(error);
      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
    }

    const user = await this.findUser(email);

    if (!user) {
      throw new HttpException('User with this email was not found', HttpStatus.NOT_FOUND);
    } 

    const secret = JWT_SECRET + user.password;
    try {
    const tokenVerified = jwt.verify(inviteAcceptDto.token, secret);

    if(!tokenVerified) {
      throw new HttpException('Password could not be set', HttpStatus.BAD_REQUEST);
    }
    } catch (error) {
      throw new HttpException('The link has expired', HttpStatus.BAD_REQUEST);
    }

    try{
      const salt = await genSalt(10);
      const hashedPassword = await hash(inviteAcceptDto.password, salt);
      user.password = hashedPassword;
      user.status = UserStatus.JOINED;
      await this.prisma.user.update({
        where: {id: user.id},
        data: {...user}
      });
      return true;
    } catch(error) {
      Logger.log(error);
      throw new HttpException('Something went wrong, please try again', HttpStatus.BAD_REQUEST);
    }
  }

  async resendInvite(id: string): Promise<PasswordResponseDto> {
    const user = await this.checksService.findUserById(id);

    if (!user) {
      throw new HttpException('User with this email was not found', HttpStatus.NOT_FOUND);
    }

    if(user.status !== UserStatus.INVITED) {
      throw new HttpException("You cannot resend the invite", HttpStatus.BAD_REQUEST);
    }
    
    const secret = JWT_SECRET + user.password;

    const payload  = {
      email: user.email,
      userId: user.id,
    }

    const token =  jwt.sign(payload, secret, {
      expiresIn: '24h'    
    });

    const invitationLinkUrl = `${process.env.FRONTEND_URL_JOIN}/${user.id}/${token}`;
    Logger.log(invitationLinkUrl)
    
    this.emailService.sendEmail(
      user.email,
      [],
      [],
      'Crownstack ATS Invitation',
      './send-invitation',
      {
        user: user.firstName,
        link: invitationLinkUrl
      }
    );

    const passwordPayload = {
      userId: user.id,
      token
    }

    return passwordPayload;
  }

  async getCurrentUser(currentUser: User): Promise<UserDto> {
    const user = await this.checksService.findUserById(currentUser.id);

    if(!user) throw new HttpException('User with this Id was not found', HttpStatus.NOT_FOUND);

    return new UserDto(user);
  }

  async changeUserStatus(checkUserStatusDto: CheckUserStatusDto): Promise<string> {
    const { id, loginAccess } = checkUserStatusDto;
    const user = await this.checksService.findUserById(id);

    if(!user) throw new HttpException('User with this Id was not found', HttpStatus.NOT_FOUND)

    if(user.status  === UserStatus.INVITED) {
      throw new HttpException('The Status of the User cannot be changed', HttpStatus.BAD_REQUEST);
    }

    if(loginAccess === false) {
      user.loginAccess = loginAccess;
      user.status = UserStatus.DEACTIVATED;
    } else {
      user.loginAccess = loginAccess;
      user.status = UserStatus.JOINED;
    }

    try{
      const updatedUser = await this.prisma.user.update({
        where: {id: user.id},
        data: {
          status: user.status,
          loginAccess: user.loginAccess
        }
      });

      if(!updatedUser) {
        throw new HttpException('The Status of the User cannot be changed', HttpStatus.BAD_REQUEST);
      }
      
      if(loginAccess === false) {
        this.emailService.sendEmail(
          user.email,
          [],
          [],
          'Account Deactivated',
          './user-account-deactivated',
          {
            user: user.firstName,
          }
        );
      } else {
        this.emailService.sendEmail(
          user.email,
          [],
          [],
          'Account Activated',
          './user-account-activated',
          {
            user: user.firstName,
          }
        );
      }
      
      if(user.status  === UserStatus.DEACTIVATED) {
        return 'deactivated'
      } else {
        return 'activated'
      }

    } catch(error) {
      throw new HttpException('The Status of the User cannot be changed', HttpStatus.BAD_REQUEST);
    }
  }

  async updateUser(userDetails: UserUpdateDto, currentUser: User): Promise<boolean> {
    const user = await this.checksService.findUserById(currentUser.id);

    if(!user) {
      throw new HttpException('User was not found', HttpStatus.NOT_FOUND);
    }

    try {
      const userUpdated = await this.prisma.user.update({
        where: {
          id: user.id
        },
        data: { ...userDetails },
      });

      if(!userUpdated) {
        throw new HttpException('User Profile cannot be updated', HttpStatus.BAD_REQUEST)
      }

      return true;
    } catch (error) {
      Logger.log(error);
      throw new HttpException('User Profile cannot be updated', HttpStatus.BAD_REQUEST);
    }
  }

  async changePassword(changePasswordDto: ChangePasswordDto, currentUser: User): Promise<boolean> {
    const user = await this.checksService.findUserById(currentUser.id);

    const isMatch = await AuthHelpers.validateHash(
      changePasswordDto.oldPassword,
      user && user.password,
    );

    if(!isMatch) {
      throw new BadRequestException('Your Password was incorrect');
    }

    const salt = await genSalt(10);
    const hashedPassword = await hash(changePasswordDto.newPassword, salt);
   
    try {
      const passwordChanged = await this.prisma.user.update({
        where: {id: user.id},
        data: {
          password: hashedPassword
        }
      });

      if(!passwordChanged) {
        throw new HttpException('User password cannot be changed', HttpStatus.BAD_REQUEST)
      }

      this.emailService.sendEmail(
        user.email,
        [],
        [],
        'Changed Password',
        './change-password',
        {
          user: user.firstName,
        }
      );

      return true;
    } catch (error) {
      Logger.log(error);
      throw new HttpException('User password cannot be changed', HttpStatus.BAD_REQUEST);
    }
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }

  async uploadDOFile(file: IFile): Promise<any> {
    // An actual AWS.S3 instance
    logger.log('uploading file');
    const spacesEndpoint = new AWS.Endpoint(DO_END_POINT);
    const S3 = new AWS.S3({
      endpoint: spacesEndpoint.href,
      credentials: new AWS.Credentials({
        accessKeyId: DO_ACCESS_KEY_ID,
        secretAccessKey: DO_SECRET_ACCESS_KEY,
      }),
    });
    // Precaution to avoid having 2 files with the same name
    const fileName = `${Date.now()}-${file.originalname}`;

    // Return a promise that resolves only when the file upload is complete
    return new Promise((resolve, reject) => {
      S3.putObject(
        {
          Bucket: DO_BUCKET_NAME,
          Key: fileName,
          Body: file.buffer,
          ACL: 'public-read',
        },
        (error: AWS.AWSError) => {
          if (!error) {
            resolve(`${DO_URL}/${fileName}`);
          } else {
            reject(
              new Error(
                `DoSpacesService_ERROR: ${
                  error.message || 'Something went wrong'
                }`,
              ),
            );
          }
        },
      );
    });
  }

  public async logout(user: User): Promise<boolean> {
    Logger.log(`${user.email} logging out`);
    //TODO: Once we will have  fcmtokens for push notifications we will delete current fcmtoken wwhile logging out
    return true;
  }

  
}
