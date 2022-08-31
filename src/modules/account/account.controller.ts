import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { RoleType, User } from '@prisma/client';
import { UUIDCheckPipe } from '../../common/pipes/uuid-check.pipe';
import { ResponseSuccess } from '../../common/dto/ResponseSuccess.dto';
import { AuthUser } from '../../decorators/auth.user.decorator';
import { Roles } from '../../decorators/roles.decorator';
import { AccessGuard } from '../../guards/access.guard';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { AccountService } from './account.service';
import { CompanyUpdateDto } from './dto/CompanyUpdate.dto';
import { ResumeSourceAddDto } from './dto/ResumeSourceAdd.dto';
import { ResumeSourceEditDto } from './dto/ResumeSourceEdit.dto';
import { SkillAddDto } from './dto/SkillAdd.dto';
import { SkillEditDto } from './dto/SkillEdit.dto';
import { SkillFilterDto } from './dto/SkillFilter.dto';
import { SourceFilterDto } from './dto/SourceFilter.dto';

@Controller('account')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Get('resume-source')
  @UseGuards(AuthGuard, AccessGuard, RolesGuard)
  @Roles(RoleType.SUPER_ADMIN)
  async viewResumeSources(
    @AuthUser() user: User,
    @Body() filterData: SourceFilterDto,
    @Query('searchQuery') searchQuery: string,
  ): Promise<ResponseSuccess> {
    const status = await this.accountService.viewResumeSources(
      user,
      filterData,
      searchQuery,
    );
    return new ResponseSuccess(`Resume Source list`, status);
  }

  @Post('resume-source/add')
  @UseGuards(AuthGuard, AccessGuard, RolesGuard)
  @Roles(RoleType.SUPER_ADMIN)
  async addResumeSource(
    @AuthUser() user: User,
    @Body() resumeSourceAddDto: ResumeSourceAddDto,
  ): Promise<ResponseSuccess> {
    const status = await this.accountService.addResumeSource(resumeSourceAddDto, user);
    return new ResponseSuccess(`Your source added successfully`, status);
  }

  @Put('resume-source/edit')
  @UseGuards(AuthGuard, AccessGuard, RolesGuard)
  @Roles(RoleType.SUPER_ADMIN)
  async editResumeSource(
    @Body() resumeSourceEditDto: ResumeSourceEditDto,
  ): Promise<ResponseSuccess> {
    const status = await this.accountService.editResumeSource(resumeSourceEditDto);
    return new ResponseSuccess(`Your source updated successfully`, status);
  }

  @Delete('resume-source/delete/:sourceId')
  @UseGuards(AuthGuard, AccessGuard, RolesGuard)
  @Roles(RoleType.SUPER_ADMIN)
  async deleteResumeSource(
    @Param('sourceId', UUIDCheckPipe) sourceId: string,
  ): Promise<ResponseSuccess> {
    const status = await this.accountService.deleteResumeSource(sourceId);
    return new ResponseSuccess(`Your source deleted successfully`, status);
  }

  @Get('skill')
  @UseGuards(AuthGuard, AccessGuard, RolesGuard)
  @Roles(RoleType.SUPER_ADMIN)
  async viewSkills(
    @AuthUser() user: User,
    @Body() filterData: SkillFilterDto,
    @Query('searchQuery') searchQuery: string,
  ): Promise<ResponseSuccess> {
    const status = await this.accountService.viewSkills(
      user,
      filterData,
      searchQuery,
    );
    return new ResponseSuccess(`Skill list`, status);
  }

  @Post('skill/add')
  @UseGuards(AuthGuard, AccessGuard, RolesGuard)
  @Roles(RoleType.SUPER_ADMIN)
  async addSkill(
    @AuthUser() user: User,
    @Body() skillAddDto: SkillAddDto,
  ): Promise<ResponseSuccess> {
    const status = await this.accountService.addSkill(skillAddDto, user);
    return new ResponseSuccess(`Your skill added successfully`, status);
  }

  @Put('skill/edit')
  @UseGuards(AuthGuard, AccessGuard, RolesGuard)
  @Roles(RoleType.SUPER_ADMIN)
  async editSkill(
    @Body() skillEditDto: SkillEditDto,
  ): Promise<ResponseSuccess> {
    const status = await this.accountService.editSkill(skillEditDto);
    return new ResponseSuccess(`Your skill updated successfully`, status);
  }

  @Delete('skill/delete/:skillId')
  @UseGuards(AuthGuard, AccessGuard, RolesGuard)
  @Roles(RoleType.SUPER_ADMIN)
  async deleteSkill(
    @Param('skillId', UUIDCheckPipe) skillId: string,
  ): Promise<ResponseSuccess> {
    const status = await this.accountService.deleteSkill(skillId);
    return new ResponseSuccess(`Your skill deleted successfully`, status);
  }

  @Put('update-company')
  @UseGuards(AuthGuard, AccessGuard, RolesGuard)
  @Roles(RoleType.SUPER_ADMIN)
  async updateCompany(
    @AuthUser() user: User,
    @Body() updateDetails: CompanyUpdateDto,
  ): Promise<ResponseSuccess> {
    const status = await this.accountService.updateCompany(updateDetails, user);
    return new ResponseSuccess(`Your company profile updated successfully`, status);
  }
}
