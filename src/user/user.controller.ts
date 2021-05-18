import { Controller, 
          Body, 
          Get,
          Post, 
          HttpException,
          Res,
          Patch,
          Delete,
          Headers,
          HttpStatus
       } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 등록되어있는 전체 유저를 확인한다.
  @Get()
  async userGet(){
    return this.userService.postUser();
  }

  // 회원가입을 한다.
  @Post('signup')
  async userSignup(
    // Client의 Body에서 온 정보를 각각 변수로 
    // 저장
    @Body() completeBody: {
      userName : string,
      password : string,
      email : string
    },
    @Res() res : Response // express문법의 res사용하기위한 코드
      
  ) {

        const userData = this.userService.insertUser(
          completeBody.userName,
          completeBody.password,
          completeBody.email
        );

        // express문법으로 response
        res.set('Authorization', 'Bearer ' + userData.token);
        res.send({message : "userinfo updated"})

  }

  // 회원의 정보를 수정한다.
  @Patch('info')
  async userEdit(
    @Body() completeBody: {
      userId : number,
      userName : string,
      oldPassword : string,
      newPassword : string
    },
    @Headers() headers
  ){
    const {userId,userName,oldPassword,newPassword} = completeBody;

    const result = this.userService.editUserInfo(userId, oldPassword, newPassword,userName,headers);
    console.log("result : ", result);

    // 에러 발생시 if문 실행
    if(typeof result === "object" && result.message !== "userinfo updated"){
      if(result.error === 500){
        throw new HttpException(result.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }

      else{
        throw new HttpException(result.message, result.error);
      }
      
    }
    throw new HttpException("userinfo updated", 201);

  }

  @Delete('info')
  async userDelete(
    @Body('userId') userId : number,
    @Body('password') password : string,
    @Headers() headers
  ){
    console.log("password" , password);

    const deleteUser = this.userService.deleteUserInfo(userId,password,headers);

    if(deleteUser.error){
      throw new HttpException(deleteUser.message, deleteUser.error);
    }

    return deleteUser;

  }

}
