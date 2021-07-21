import { User } from './user.entity';
import { EntityRepository, Repository } from 'typeorm';
// import { checkToken } from '../function/token/createToken';
// import { CreateUserDto } from './dto/create-user.dto';
import { InternalServerErrorException , HttpException, NotFoundException} from '@nestjs/common';
import { TodoList } from '../todolist/todolist.entity';
import { Calendar } from '../calendar/calendar.entity';
import { insertHolidayCalendar, insertHolidayEvent } from '../function/query/queryFunctions';
import { OtherCalendar } from '../other-calendar/other-calendar.entity';
import {createToken, checkToken} from '../function/token/createToken';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

  // 회원가입 코드
  async signupUser(
    userName : string,
    password : string,
    email : string,
  ){
    const user = new User();
      const userEmailChack = await this.findOne({
        email
      });
      console.log("user", user);
      console.log("1- emali pass");

      if(userEmailChack) {
      throw new HttpException("email already exist", 401);
      }

      console.log("2- emali pass");

      user.userName = userName;
      user.password = password;
      user.email = email;
      user.salt = email + userName + (Math.random()*100000).toString() // salt생성
      console.log("3- user register pass");
      console.log("user", user);

      await user.save();
      const todoList = new TodoList();
      const calendar = new Calendar();
      try{
        

        console.log("4- user save pass :  ", user.id);
        const userId : number = user.id;

        
        calendar.userId = user.id;
        calendar.calendarName = `${user.userName}`;
        await calendar.save();

        await this.query(insertHolidayCalendar(userId));
        const otherCalendar = await OtherCalendar.findOne({ userId });
        
        if(otherCalendar){ 
          console.log()
          await this.query(insertHolidayEvent(otherCalendar.id)); // 에러구간
          console.log("4-2- user save pass :  ", user.id);
        }
        // 에러 발생시 console.log로 출력
        else{
          console.log("otherCalendar : ", otherCalendar);
        }

        const todoList = new TodoList();

        todoList.toDoListName = 'Tasks';
        todoList.userId = user.id;
        await todoList.save();
        console.log("todoList : ",todoList);
        const payload = {
          userId,
          email
        };
        //토큰 생성
        user.token = createToken(payload, user.salt, { expiresIn: "1h" });
        console.log("5- user save pass");
        await user.save(); 

        console.log("6- user save pass");

        return {user, todoList, calendar};

      }

      catch(err){
        console.log(err)
        throw new HttpException({
          message : "Server error occurred",
          errorMessage : err.message
        }, 500);
        
        
      }
  }

  // 로그인 코드
  async loginUser(email: string, password: string){

    let user:User

    if(password === "OAuthUser_Google"){
      user = await this.findOne({
        email: email
      });
    }

    else{
      user = await this.findOne({
        email: email,
        password: password
      });
    }


    if(!user) {
      throw new NotFoundException('email or password not found');
    }

    const userId = user.id;
    const payload = {
      userId,
      email
    };

    user.token = createToken(payload, user.salt, { expiresIn: "1h" });
    console.log(user.token);

    try{
      await user.save();
    }catch(err) {
      throw new InternalServerErrorException("Server error occurred");
    }

    delete user.password;
    delete user.salt;

    return user;

  }

  // 회원정보 수정 코드
  async updateUser(
    userId:number,
    oldPassword:string,
    newPassword:string,
    userName:string,
    headers: any
  ){

    try{
      const found = await User.findOne({id : userId});

      // authorization header가 존재하지 않을때
      if(!headers.authorization){
        return {error : 401, message : "no token"};
      }

      const token = headers.authorization.split(" ")[1];
      const decode = await checkToken(token, userId);
      // console.log("decode : ",decode)
      console.log("헤더 체크 : ", token);

      // userDB에 userId을  못찾으면 if문 실행
      if(!found) return {error: 401, message : "no Id"};

      // userDB에 해당 userName의 password와
      // oldPassword가 다르면 else if문 실행
      else if(found.password !== oldPassword){
        return {error: 401, message : "unauthorized"};
      }

      else if(decode.error){
        return decode;
      }

      // 위 2개의 if문에 해당되지 않으면
      // 비밀번호 변경
      else{
        console.log(newPassword);
        found.password = newPassword.length === 0 ? found.password: newPassword;
        found.userName = userName.length === 0 ? found.userName: userName;

        found.save();


        return {user : found, message : "userinfo updated"};
      }
    }
    catch(err){
      console.log(err);
      return {error : 500, message : err.message};
    }

  }

  // 회원정보 삭제 코드
  async deleteUser(userId : number, password:string, headers: any){
    if(!headers.authorization){
      // throw new UnauthorizedException("no token");
      return {error : 401, message : "no token"};
    }

    try{
      const found = await User.findOne({id : userId});
      const token = headers.authorization.split(" ")[1];
      const decode = await checkToken(token, userId);

      // token쪽에서 error가 발생시
      if(decode.error){
        return decode;
      }

      // 토큰의 email과 DB의 email이 일치하지 않을때
      else if(decode.email !== found.email){
        // throw new HttpException("email unmatch", 401);
        return {error : 401, message : "email unmatch"};
      }

      // 유저의 비밀번호와 DB의 비밀번호가 일치하지 않을때
      else if(password !== found.password){
        // throw new HttpException("email or password not found", 401);
        return {error : 401, message : "email or password not found"};
      }

      // 모든 절차가 통과되면 최종적으로 해당유저를 삭제
      else{

        // 삭제 절차
        // this.userDB = this.userDB.filter(ele => ele.userId !== userId)
        const result = await User.delete({id : userId});
        if(result.affected === 0){
          // throw new HttpException("User did not delete from the server", 500);
          return {error : 500, message : "User did not delete from the server"};
        }
        // throw new HttpException("User deleted", 200);
        return {status: 200, message : "User deleted"};
        // return "User deleted";
      }

    }
    catch(err){
      console.log(err);
      // throw new HttpException(err.message, 500);
      return {error : 500, message : err.message};
    }
  }

}
