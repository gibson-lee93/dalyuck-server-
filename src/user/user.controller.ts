import {
  Controller,
  Get,
  Body,
  Post,
  Patch,
  Delete,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { User } from './user.entity';
import { verify } from '../function/oauth/googleOauth';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UpdateUserDto} from './dto/update-user.dto';
import { GetUser } from './get-user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard())
  @Get()
  getUser(
    @GetUser() user: User
  ): User {
    delete user.password;
    return user;
  }

  @Post('signup')
  signUp(
    @Body() authCredentialsDto: AuthCredentialsDto
  ): Promise<void> {
    return this.userService.signUp(authCredentialsDto);
  }

  @Post('login')
  logIn(
    @Body() authCredentialsDto: AuthCredentialsDto
  ): Promise<{ user: User, accessToken: string }> {
    return this.userService.logIn(authCredentialsDto);
  }

  @UseGuards(AuthGuard())
  @Patch()
  updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() user: User,
  ): Promise<User> {
    return this.userService.updateUser(updateUserDto, user);
  }

  @UseGuards(AuthGuard())
  @Delete()
  deleteUser(
    @GetUser() user: User
  ): Promise<void> {
    return this.userService.deleteUser(user);
  }
}
