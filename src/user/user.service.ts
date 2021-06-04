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
  // DB구축전 테스트용 코드(DB설치후 삭제)
  // private userDB: User[] = [];


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
      // email유효성 검사 코딩 필요(DB구축후) : for루프는 임시!
      // user.find
      // for(let i : number = 0; i < this.userDB.length; i++){
      //   if(email === this.userDB[i].email){
      //     console.log("error : ", 401,"email already exist")
      //     throw new HttpException("email already exist", 401);
      //   }
      // }

      console.log("Input userName : ", userName, typeof userName);


      const user = new User();
      const userEmailChack = await this.userRepository.findOne({
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

        await this.userRepository.query(insertHolidayCalendar(userId));
        const otherCalendar = await OtherCalendar.findOne({ userId });
        console.log("4-1- user save pass :  ", user.id);
        await this.userRepository.query(insertHolidayEvent(otherCalendar.id));
        
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

      }

      catch(err){
        console.log("Error : ", err);
        throw new HttpException("Server error occurred", 500);
      }
      console.log(user);
      delete user.password;
      console.log("7- user save pass");
      return {user,todoList, calendar};
  }


  async logIn(email: string, password: string): Promise<User> {
    let user:User

    if(password === "OAuthUser_Google"){
      user = await this.userRepository.findOne({
        email: email
      });
    }

    else{
      user = await this.userRepository.findOne({
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
      throw new HttpException("Server error occurred", 500);
    }

    delete user.password;
    delete user.salt;

    return user;
  }

  // Controller에서 회원정보 수정 요청시 method
  async editUserInfo(
      userId:number,
      oldPassword:string,
      newPassword:string,
      userName:string,
      headers: any
      ) : Promise <any>{
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



  // Controller에서 회원정보 삭제 요청시 method
  async deleteUserInfo(userId : number, password:string, headers: any) : Promise <any>{

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
