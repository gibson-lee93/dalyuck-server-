import {
  Injectable,
  HttpException,
  UnauthorizedException,
  NotFoundException,
  InternalServerErrorException
 } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {createToken, checkToken} from '../function/token/createToken';
import { User } from "./user.entity";
import { UserRepository } from './user.repository';
import { TodoList } from '../todolist/todolist.entity';
import { Calendar } from '../calendar/calendar.entity';
import { insertHolidayCalendar, insertHolidayEvent } from '../function/query/queryFunctions';
import { OtherCalendar } from '../other-calendar/other-calendar.entity';
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

  // userDB를 확인하기 위한 method
  // async postUser():  Promise <User[]> {
  //   return await this.userRepository.find()
  // }
  //
  // // userDB를 확인하기 위한 method
  // async checkOneUser(
  //   headers: any,
  //   userId : number
  // ):  Promise <User> {
  //
  //   const token = headers.authorization.split(" ")[1];
  //   const checkHeaderToken = await checkToken(token, userId);
  //
  //   if(checkHeaderToken.error){
  //     throw new UnauthorizedException(checkHeaderToken.message);
  //   }
  //
  //   // 해당 userId를 찾아서 해당 캘린더 정보를 모두 보내준다.
  //   const result =  await this.userRepository.findOne({
  //     where:{id : checkHeaderToken.userId},
  //     relations:["calendar"]
  //   })
  //
  //   delete result.password;
  //   delete result.salt;
  //   delete result.token;
  //
  //   return result;
  //
  // }

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
  // async logOut(headers: any, userId: number): Promise<void> {
  //   const token = headers.authorization.split(" ")[1];
  //   const checkHeaderToken = await checkToken(token, userId);
  //
  //   if(checkHeaderToken.error){
  //     throw new UnauthorizedException(checkHeaderToken.message);
  //   }
  //
  //   const user = await this.userRepository.findOne({ id: userId });
  //   user.token = '';
  //
  //   try{
  //     await user.save();
  //   } catch(err) {
  //     throw new HttpException("Server error occurred", 500);
  //   }
  // }


}
