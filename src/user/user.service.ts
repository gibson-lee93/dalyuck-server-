import { Injectable, HttpException } from '@nestjs/common';
import { User } from './user.class';
import {createToken, checkToken} from '../function/token/createToken';


@Injectable()
export class UserService {

  // DB구축전 테스트용 코드(DB설치후 삭제)
  private userDB: User[] = [];

  // userDB를 확인하기 위한 method
  postUser():  object[] {
    return [...this.userDB];
  }

  // Controller에서 회원정보 등록 요청시 method
  insertUser(
    userName : string,
    password : string,
    email : string,
  ) : any{
      // email유효성 검사 코딩 필요(DB구축후) : for루프는 임시!
      // user.find
      for(let i : number = 0; i < this.userDB.length; i++){
        if(email === this.userDB[i].email){
          console.log("error : ", 401,"email already exist")
          throw new HttpException("email already exist", 401);
        }
      }
      try{
        // userDB의 원소갯수를 이용하여 userId(PK ID)를 생성(DB구축시 삭제)
        const userId = this.userDB.length === 0 ? 
        0 : this.userDB[this.userDB.length-1].userId+1; // PK아이디 생성

        const salt = email + userName + (Math.random()*100000).toString() // salt생성

        //토큰 만들기 위한 준비작업(payload 생성)
        const payload = {
          userId,
          email
        };

        //토큰 생성
        const token = createToken(payload, salt, { expiresIn: "1h" });

        // newMember에 새로운 class을 생성후 Client에서 받은 원소들을 입력
        const newUser = new User(userId, email, userName, password, salt, token);
        // Array members에 newMember을 Push하여 배열을 삽입
        this.userDB.push(newUser);
        
        return {
          userId,
          password,
          email,
          userName,
          salt,
          token
        };
      }

      catch(err){
        throw new HttpException("Server error occurred", 500);
      }
      


      

  }

  // Controller에서 회원정보 수정 요청시 method
  editUserInfo(userId:number, oldPassword:string, newPassword:string,userName:string, headers: any){
    try{
      const found = this.userDB.find(ele => ele.userId === userId);

      // authorization header가 존재하지 않을때
      if(!headers.authorization){
        return {error : 401, message : "no token"};
      }

      const token = headers.authorization.split(" ")[1];
      const decode = checkToken(token, userId, this.userDB);
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

        this.userDB = this.userDB.filter((ele) => {
          return ele.userId !== found.userId
        });

        this.userDB = [...this.userDB, found];


        return {user : found, message : "userinfo updated"};
      }
    }
    catch(err){
      console.log(err);
      return {error : 500, message : err.message};
    }
    
  }

  // Controller에서 회원정보 삭제 요청시 method
  deleteUserInfo(userId : number, password:string, headers: any){

    if(!headers.authorization){
      return {error : 401, message : "no token"};
    }

    try{
      const found = this.userDB.find(ele => ele.userId === userId);
      const token = headers.authorization.split(" ")[1];
      const decode = checkToken(token, userId, this.userDB);

      // token쪽에서 error가 발생시
      if(decode.error){
        return decode;
      }

      // 토큰의 email과 DB의 email이 일치하지 않을때
      else if(decode.email !== found.email){
        return {error : 401, message : "email unmatch"};
      }

      // 유저의 비밀번호와 DB의 비밀번호가 일치하지 않을때
      else if(password !== found.password){
        return {error : 401, message : "email or password not found"};
      }

      // 모든 절차가 통과되면 최종적으로 해당유저를 삭제
      else{

        // 삭제 절차
        this.userDB = this.userDB.filter(ele => ele.userId !== userId)
        return {status: 200, message : "User deleted"};
      }

    }
    catch(err){
      console.log(err);
      return {error : 500, message : err.message};
    }

  }

}
