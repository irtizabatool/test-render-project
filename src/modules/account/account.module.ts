import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { ChecksService } from './checks.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [AccountService, ChecksService, PrismaService],
  controllers: [AccountController]
})
export class AccountModule {}
