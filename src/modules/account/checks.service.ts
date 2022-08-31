import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Organisation, ResumeSource, RoleType, Skill, User } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ChecksService {
  constructor(private prisma: PrismaService) {}

  async findResumeSourceById(id: string): Promise<ResumeSource | null> {
    try {
      const sourceFound = await this.prisma.resumeSource.findUnique({
        where: { id },
      });
      return sourceFound;
    } catch (e) {
      throw new NotFoundException('Resume source with this Id was not found');
    }
  }

  async findSkillById(id: string): Promise<Skill | null> {
    try {
      const skillFound = await this.prisma.skill.findUnique({
        where: { id },
      });
      return skillFound;
    } catch (e) {
      throw new NotFoundException('Skill with this Id was not found');
    }
  }

  async findOrganisationById(id: string): Promise<Organisation | null> {
    try {
      const organisationFound = await this.prisma.organisation.findUnique({
        where: { id },
      });
      return organisationFound;
    } catch (e) {
      throw new UnauthorizedException('Organisation with this Id was not found');
    }
  }
}
