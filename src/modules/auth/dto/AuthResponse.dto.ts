import { RoleType, User } from '@prisma/client';

export class AuthResponseDTO {
  user: User;
  accessToken: string;
}
