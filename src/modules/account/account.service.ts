import { HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ResumeSource, Skill, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ChecksService } from './checks.service';
import { CompanyUpdateDto } from './dto/CompanyUpdate.dto';
import { ResumeSourceAddDto } from './dto/ResumeSourceAdd.dto';
import { ResumeSourceEditDto } from './dto/ResumeSourceEdit.dto';
import { SkillAddDto } from './dto/SkillAdd.dto';
import { SkillEditDto } from './dto/SkillEdit.dto';
import { SkillFilterDto } from './dto/SkillFilter.dto';
import { SourceFilterDto } from './dto/SourceFilter.dto';

const logger = new Logger('AccountService');

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService, private checksService: ChecksService) {}

  async viewResumeSources(
    user: User,
    filterData: SourceFilterDto,
    searchQuery: string,
  ): Promise<ResumeSource[]> {
    try {
      const sources = await this.prisma.resumeSource.findMany({
          where: {
            NOT: {
              deleted: true,
            },
            AND: [
              {
                organisationId: user.organisationId,
              },
              {
                ...filterData,
              },
            ],
            OR: [
              {
                sourceName: { contains: searchQuery },
              },
            ],
          },
          orderBy: [
            {
              sourceName: 'asc',
            },
          ],
        });
      logger.log(sources);
      return sources;
    } catch (error) {
      logger.log(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async addResumeSource(sourceDetails: ResumeSourceAddDto, currentUser: User): Promise<boolean> {
    try {
      const addedSource = await this.prisma.resumeSource.create({
        data: {
          organisationId: currentUser.organisationId,
          ...sourceDetails,
        },
      });

      if (!addedSource)
        throw new HttpException('Resume Source cannot be added', HttpStatus.BAD_REQUEST);
      return true;
    } catch (error) {
      logger.log(error);
      throw new HttpException('Resume Source cannot be added', HttpStatus.BAD_REQUEST);
    }
  }

  async editResumeSource(resumeSourceEditDto: ResumeSourceEditDto): Promise<boolean> {
    const sourceFound = await this.checksService.findResumeSourceById(resumeSourceEditDto.id);
    if (!sourceFound) throw new NotFoundException('Resume Source with given Id not found');
    try {
      const sourceUpdated = await this.prisma.resumeSource.update({
        where: {
          id: resumeSourceEditDto.id,
        },
        data: { ...resumeSourceEditDto },
      });

      if (!sourceUpdated)
        throw new HttpException('Resume source cannot be updated', HttpStatus.BAD_REQUEST);

      return true;
    } catch (error) {
      logger.log(error);
      throw new HttpException('Resume source cannot be updated', HttpStatus.BAD_REQUEST);
    }
  }

  async deleteResumeSource(id: string): Promise<boolean> {
    const sourceFound = await this.checksService.findResumeSourceById(id);
    if (!sourceFound || sourceFound.deleted === true)
      throw new NotFoundException('Resume Source with given Id not found');
    try {
      const sourceUpdated = await this.prisma.resumeSource.update({
        where: {
          id,
        },
        data: { deleted: true },
      });

      if (!sourceUpdated)
        throw new HttpException('Resume source cannot be deleted', HttpStatus.BAD_REQUEST);

      return true;
    } catch (error) {
      logger.log(error);
      throw new HttpException('Resume source cannot be deleted', HttpStatus.BAD_REQUEST);
    }
  }

  async viewSkills(
    user: User,
    filterData: SkillFilterDto,
    searchQuery: string,
  ): Promise<Skill[]> {
    try {
      const  skills = await this.prisma.skill.findMany({
          where: {
            NOT: {
              deleted: true,
            },
            AND: [
              {
                organisationId: user.organisationId,
              },
              {
                ...filterData,
              },
            ],
            OR: [
              {
                skillName: { contains: searchQuery },
              },
            ],
          },
          orderBy: [
            {
              skillName: 'asc',
            },
          ],
        });
        logger.log(skills);
      
      return skills;
    } catch (error) {
      Logger.log(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async addSkill(skillDetails: SkillAddDto, currentUser: User): Promise<boolean> {
    try {
      const addedSkill = await this.prisma.skill.create({
        data: {
          organisationId: currentUser.organisationId,
          ...skillDetails,
        },
      });

      if (!addedSkill)
        throw new HttpException('Skill cannot be added', HttpStatus.BAD_REQUEST);
      return true;
    } catch (error) {
      logger.log(error);
      throw new HttpException('Skill cannot be added', HttpStatus.BAD_REQUEST);
    }
  }

  async editSkill(skillEditDto: SkillEditDto): Promise<boolean> {
    const skillFound = await this.checksService.findSkillById(skillEditDto.id);
    if (!skillFound) throw new NotFoundException('Skill with given Id not found');
    try {
      const skillUpdated = await this.prisma.skill.update({
        where: {
          id: skillEditDto.id,
        },
        data: { ...skillEditDto },
      });

      if (!skillUpdated)
        throw new HttpException('Skill cannot be updated', HttpStatus.BAD_REQUEST);

      return true;
    } catch (error) {
      logger.log(error);
      throw new HttpException('Skill cannot be updated', HttpStatus.BAD_REQUEST);
    }
  }

  async deleteSkill(id: string): Promise<boolean> {
    const skillFound = await this.checksService.findSkillById(id);
    if (!skillFound || skillFound.deleted === true)
      throw new NotFoundException('Skill with given Id not found');
    try {
      const skillUpdated = await this.prisma.skill.update({
        where: {
          id,
        },
        data: { deleted: true },
      });

      if (!skillUpdated)
        throw new HttpException('Skill cannot be deleted', HttpStatus.BAD_REQUEST);

      return true;
    } catch (error) {
      logger.log(error);
      throw new HttpException('Skill cannot be deleted', HttpStatus.BAD_REQUEST);
    }
  }

  async updateCompany(companyDetails: CompanyUpdateDto, currentUser: User): Promise<boolean> {
    const company = await this.checksService.findOrganisationById(currentUser.organisationId);
    if (!company) throw new NotFoundException('Company with given Id not found');
    try {
      const companyUpdated = await this.prisma.organisation.update({
        where: {
          id: currentUser.organisationId,
        },
        data: { ...companyDetails },
      });

      if (!companyUpdated) {
        throw new HttpException('Company profile cannot be updated', HttpStatus.BAD_REQUEST);
      }

      return true;
    } catch (error) {
      logger.log(error);
      throw new HttpException('Company profile cannot be updated', HttpStatus.BAD_REQUEST);
    }
  }
}
