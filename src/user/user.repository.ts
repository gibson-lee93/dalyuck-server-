import { User } from './user.entity';
import { EntityRepository, Repository } from 'typeorm';
// import { checkToken } from '../function/token/createToken';
// import { CreateUserDto } from './dto/create-user.dto';
// import { InternalServerErrorException } from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

  

  // // Controller에서 회원정보 삭제 요청시 method
  // deleteUserInfo(userId : number, password:string, headers: any){

  //   if(!headers.authorization){
  //     return {error : 401, message : "no token"};
  //   }

  //   try{
  //     const found = this.find({id:userId});
  //     const token = headers.authorization.split(" ")[1];
  //     const decode = checkToken(token, userId);

  //     // token쪽에서 error가 발생시
  //     if(decode.error){
  //       return decode;
  //     }

  //     // 토큰의 email과 DB의 email이 일치하지 않을때
  //     else if(decode.email !== found.email){
  //       return {error : 401, message : "email unmatch"};
  //     }

  //     // 유저의 비밀번호와 DB의 비밀번호가 일치하지 않을때
  //     else if(password !== found.password){
  //       return {error : 401, message : "email or password not found"};
  //     }

  //     // 모든 절차가 통과되면 최종적으로 해당유저를 삭제
  //     else{

  //       // 삭제 절차
  //       this.userDB = this.userDB.filter(ele => ele.userId !== userId)
  //       return {status: 200, message : "User deleted"};
  //     }

  //   }
  //   catch(err){
  //     console.log(err);
  //     return {error : 500, message : err.message};
  //   }

  // }
}
