import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service'
import { User } from './user.class';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/login')
  logIn(
    @Body('email') email: string,
    @Body('password') password: string
  ): User {
    return this.userService.logIn(email, password);
  }
}
