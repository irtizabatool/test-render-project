import { TokenPayloadDto } from './TokenPayload.dto';
import { UserDto } from './User.dto';

export class AuthResponseDTO {
  user: UserDto;
  token: TokenPayloadDto;
  
  constructor(user: UserDto, token: TokenPayloadDto) {
    this.user = user;
    this.token = token;
  }
}
