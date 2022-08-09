import { Module } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from '../prisma/prisma.module';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { EmailService } from '../email/email.service';
import { ChecksService } from './checks.service';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService, PrismaService, EmailService, ChecksService],
  exports: [UserService],
})
export class UserModule {}
