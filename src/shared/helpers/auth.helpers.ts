import * as bcrypt from 'bcrypt';


export class AuthHelpers {

  static async validateHash(password: string, hash: string): Promise<boolean> {
    
    return bcrypt.compare(password, hash || '');
  }
}