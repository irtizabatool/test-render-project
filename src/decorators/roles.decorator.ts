import { SetMetadata } from '@nestjs/common';
import { RoleType } from '@prisma/client';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Roles = (...roles: RoleType[]) => SetMetadata('roles', roles);
