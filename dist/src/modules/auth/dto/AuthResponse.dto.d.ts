import { User } from '@prisma/client';
export declare class AuthResponseDTO {
    user: User;
    accessToken: string;
}
