import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './user.class';

@Injectable()
export class UserService {
  private userDB: User[] = [];

  logIn(email: string, password: string): User {
    const user: User = this.userDB.find(user =>
      user.email === email && user.password === password
    );

    if(!user) {
      throw new NotFoundException('email or password not found');
    }

    delete user.password;
    return user;
  }
}
