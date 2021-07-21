import { Injectable, HttpException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { User } from './user.class';
import {createToken, checkToken} from '../function/token/createToken';
import { User } from "./user.entity";
import { UserRepository } from './user.repository';
import { TodoList } from '../todolist/todolist.entity';
import { Calendar } from '../calendar/calendar.entity';
import { insertHolidayCalendar, insertHolidayEvent } from '../function/query/queryFunctions';
import { OtherCalendar } from '../other-calendar/other-calendar.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository
  ) {}

  // userDB를 확인하기 위한 method
  async postUser():  Promise <User[]> {
    return await this.userRepository.find()
  }

  // userDB를 확인하기 위한 method
  async checkOneUser(
    headers: any,
    userId : number
  ):  Promise <User> {

    const token = headers.authorization.split(" ")[1];
    const checkHeaderToken = await checkToken(token, userId);

    if(checkHeaderToken.error){
      throw new UnauthorizedException(checkHeaderToken.message);
    }

    // 해당 userId를 찾아서 해당 캘린더 정보를 모두 보내준다.
    const result =  await this.userRepository.findOne({
      where:{id : checkHeaderToken.userId},
      relations:["calendar"]
    })

    delete result.password;
    delete result.salt;
    delete result.token;

    return result;

  }

  // Controller에서 회원정보 등록 요청시 method
  async insertUser(
    userName : string,
    password : string,
    email : string,
  ) : Promise <any>{

      console.log("Input userName : ", userName, typeof userName);

      return this.userRepository.signupUser(userName,password, email)
      
  }


  async logIn(email: string, password: string): Promise<User> {
    
    return this.userRepository.loginUser(email, password)
    
    
  }

  // Controller에서 회원정보 수정 요청시 method
  async editUserInfo(
      userId:number,
      oldPassword:string,
      newPassword:string,
      userName:string,
      headers: any
      ) : Promise <any>{
     
    return this.userRepository.updateUser(userId, oldPassword, newPassword, userName, headers)
    

  }



  // Controller에서 회원정보 삭제 요청시 method
  async deleteUserInfo(userId : number, password:string, headers: any) : Promise <any>{

    return this.userRepository.deleteUser(userId, password, headers);

  }

  async logOut(headers: any, userId: number): Promise<void> {
    const token = headers.authorization.split(" ")[1];
    const checkHeaderToken = await checkToken(token, userId);

    if(checkHeaderToken.error){
      throw new UnauthorizedException(checkHeaderToken.message);
    }

    const user = await this.userRepository.findOne({ id: userId });
    user.token = '';

    try{
      await user.save();
    } catch(err) {
      throw new HttpException("Server error occurred", 500);
    }
  }


}
