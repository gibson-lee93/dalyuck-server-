import {
  InternalServerErrorException,
  HttpException,
  NotFoundException,
  ConflictException
} from '@nestjs/common';
import { User } from './user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { TodoList } from '../todolist/todolist.entity';
import { Calendar } from '../calendar/calendar.entity';
import { insertHolidayCalendar, insertHolidayEvent } from '../function/query/queryFunctions';
import { OtherCalendar } from '../other-calendar/other-calendar.entity';
import {createToken, checkToken} from '../function/token/createToken';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { userName, email, password } = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User();
    user.userName = userName;
    user.email = email;
    user.password = hashedPassword;

    try {
      await user.save();
      const userId : number = user.id;

      const calendar = new Calendar();
      calendar.userId = userId;
      calendar.calendarName = `${user.userName}`;
      await calendar.save();

      await this.query(insertHolidayCalendar(userId));
      const otherCalendar = await OtherCalendar.findOne({ userId });
      await this.query(insertHolidayEvent(otherCalendar.id));

      const todoList = new TodoList();
      todoList.toDoListName = 'Tasks';
      todoList.userId = user.id;
      await todoList.save();
    } catch(error) {
      if(error.code === '23505') { //duplicate username
        throw new ConflictException('Username already exists');
      }
      else {
        throw new InternalServerErrorException();
      }
    }
  }
  // // 회원정보 삭제 코드
  // async deleteUser(userId : number, password:string, headers: any){
  //   if(!headers.authorization){
  //     // throw new UnauthorizedException("no token");
  //     return {error : 401, message : "no token"};
  //   }
  //
  //   try{
  //     const found = await User.findOne({id : userId});
  //     const token = headers.authorization.split(" ")[1];
  //     const decode = await checkToken(token, userId);
  //
  //     // token쪽에서 error가 발생시
  //     if(decode.error){
  //       return decode;
  //     }
  //
  //     // 토큰의 email과 DB의 email이 일치하지 않을때
  //     else if(decode.email !== found.email){
  //       // throw new HttpException("email unmatch", 401);
  //       return {error : 401, message : "email unmatch"};
  //     }
  //
  //     // 유저의 비밀번호와 DB의 비밀번호가 일치하지 않을때
  //     else if(password !== found.password){
  //       // throw new HttpException("email or password not found", 401);
  //       return {error : 401, message : "email or password not found"};
  //     }
  //
  //     // 모든 절차가 통과되면 최종적으로 해당유저를 삭제
  //     else{
  //
  //       // 삭제 절차
  //       // this.userDB = this.userDB.filter(ele => ele.userId !== userId)
  //       const result = await User.delete({id : userId});
  //       if(result.affected === 0){
  //         // throw new HttpException("User did not delete from the server", 500);
  //         return {error : 500, message : "User did not delete from the server"};
  //       }
  //       // throw new HttpException("User deleted", 200);
  //       return {status: 200, message : "User deleted"};
  //       // return "User deleted";
  //     }
  //
  //   }
  //   catch(err){
  //     console.log(err);
  //     // throw new HttpException(err.message, 500);
  //     return {error : 500, message : err.message};
  //   }
  // }

}
