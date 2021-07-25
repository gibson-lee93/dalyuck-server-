import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  InternalServerErrorException
 } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from "./user.entity";
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './jwt-payload.interface';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRepository.createUser(authCredentialsDto);
  }

  async logIn(
    authCredentialsDto: AuthCredentialsDto
  ): Promise<{ user: User, accessToken: string }> {
    const { email, password } = authCredentialsDto;
    const user = await this.userRepository.findOne({ email });

    if(user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { email };
      const accessToken = await this.jwtService.sign(payload);
      delete user.password;
      return { user, accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  async updateUser(
    updateUserDto: UpdateUserDto,
    user: User
  ): Promise<User> {
    const { userName, password } = updateUserDto;

    if(userName) {
      user.userName = userName;
    }

    if(password) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }

    try {
      await this.userRepository.save(user);
      delete user.password;
      return user;
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async deleteUser(user: User): Promise<void> {
    const result = await this.userRepository.delete({ id: user.id });

    if(result.affected === 0) {
      throw new NotFoundException(`User with ID "${user.id}" not found`);
    }
  }
}
