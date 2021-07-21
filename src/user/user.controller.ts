import { Controller,
          Body,
          Get,
          Post,
          HttpException,
          Res,
          Patch,
          Delete,
          Headers,
          HttpStatus,
          HttpCode
       } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { User } from './user.entity'
import { verify } from '../function/oauth/googleOauth'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 등록되어있는 전체 유저를 확인한다.
  @Get()
  async userGet(){
    console.log("userGet active");
    return this.userService.postUser();
  }

  // 등록되어있는 전체 유저를 확인한다.
  @Get('info')
  async userOneGet(
    @Body('userId') userId : number,
    @Headers() headers
  ){
    console.log("userOneGet active");
    return await this.userService.checkOneUser(headers, userId );
  }

  @Post('signup')
  async userSignup(
    @Body() completeBody: {
      userName : string,
      password : string,
      email : string
    },
    @Res() res : Response 

  ) {

        const userData = await this.userService.insertUser(
          completeBody.userName,
          completeBody.password,
          completeBody.email
        );


        res.set('Authorization', 'Bearer ' + userData.token);
        res.send({

            userId : userData.user.id,
            userName : userData.user.userName,
            email : userData.user.email,
            calender:userData.calendar,
            toDoList: userData.todoList,
            message : "userinfo updated"

        })


  }

  @Post('/login')
  @HttpCode(200)
  async logIn(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res() res : Response
  ): Promise<any> {
    const user = await this.userService.logIn(email, password);
    res.set('Authorization', 'Bearer ' + user.token);
    delete user.token;
    res.send({ user });
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
  ) : Promise <any> {
    const {userId,userName,oldPassword,newPassword} = completeBody;

    const result = await this.userService.editUserInfo(userId, oldPassword, newPassword,userName,headers);
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
    throw new HttpException("userinfo updated", 200);

  }

  // 회원정보를 삭제한다.
  @Delete('info')
  async userDelete(
    @Body('userId') userId : number,
    @Body('password') password : string,
    @Headers() headers
  ) : Promise <any> {
    console.log("password" , password);


    const deleteUser = await this.userService.deleteUserInfo(userId,password,headers);

    console.log("deleteUser : ", deleteUser);

    if(deleteUser.error){
      throw new HttpException(deleteUser.message, deleteUser.error);
    }

    return deleteUser;

  }

  // 로그아웃 한다.
  @Post('/logout')
  @HttpCode(200)
  logOut(
    @Headers() headers,
    @Body('userId') userId: number
  ): Promise<void> {
    return this.userService.logOut(headers, userId);
  }

  // Google OAuth 2.0회원가입을 한다.
  @Post('/oauth/google')
  async userSignupOauth_Google(
    // Client의 Body에서 온 정보를 각각 변수로
    // 저장
    @Body() completeBody: {
      idToken: string,
      userName: string,
      email: string
    },
    @Res() res : Response // express문법의 res사용하기위한 코드

  ) {

    // Client에서 받은 idToken을 검증한다.
    verify(completeBody.idToken)
      .then(async (data) => { // 검증완료 : True
        console.log("google OAuth confirm : ", data);

        const found = await User.findOne({email : completeBody.email});

          // DB에 Email이 존재하지 않음
          if(!found) {
            // 회원가입절차.
            const userData = await this.userService.insertUser(
              completeBody.userName,
              "OAuthUser_Google",
              completeBody.email
            )
            console.log(userData);
            // Client에 줄 Token 셋팅
            res.set('Authorization', 'Bearer ' + userData.token);
            // 정상처리로 statusCode는 200
            res.status(200);
            // 회원가입한 후이기 때문에 모든 정보를 Client쪽으로 전달
            res.send({
              userId : userData.user.id,
              userName : userData.user.userName,
              email : userData.user.email,
              calender:userData.calendar,
              toDoList:userData.todoList,
              message : "userinfo updated"
            });
          }

          else{
            // 로그인 절차
            const user = await this.userService.logIn(completeBody.email, "OAuthUser_Google");
            res.set('Authorization', 'Bearer ' + user.token);
            delete user.token;
            res.send({
              user
            });
          }



      })
      .catch(err => { // 검증완료 : False
        // const errorMessage = err.split(",")[0];
        let errorMessage:string ;
        console.log("Google OAuth 2.0 과정중 에러 발생!");

        // 실제 google oauth에서 에러가 난건지 확인
        if(String(err).includes("Error: ")){
          res.status(403);
          res.send({
            message: "토큰에 문제가 있음",
            googleMessage: err.toString()
          });
        }
        // google oauth에서 난 에러가 아님
        else{
          res.status(500);
          res.send({
            message: "Server error occurred",
            systemMessage : String(err)
          });
        }

      })
  }
}
