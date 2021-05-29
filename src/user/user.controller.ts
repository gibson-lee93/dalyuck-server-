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

        const userData = await this.userService.insertUser(
          completeBody.userName,
          completeBody.password,
          completeBody.email
        );


        // express문법으로 response
        res.set('Authorization', 'Bearer ' + userData.token);
        res.send({

            userId : userData.id,
            userName : userData.userName,
            email : userData.email,
            calender:[],
            toDoList:[],
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
    res.send({
      "userId" : user.id,
      "userName" : user.userName,
      "email" : user.email,
      "calendar" : user.calendar,
      "toDoList" : user.todolist
    });
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

  @Delete('info')
  async userDelete(
    @Body('userId') userId : number,
    @Body('password') password : string,
    @Headers() headers
  ) : Promise <any> {
    console.log("password" , password);


    // return await this.userService.deleteUserInfo(userId,password,headers);

    const deleteUser = await this.userService.deleteUserInfo(userId,password,headers);

    console.log("deleteUser : ", deleteUser);
    if(deleteUser.error){
      throw new HttpException(deleteUser.message, deleteUser.error);
    }

    return deleteUser;

  }

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

    await verify(completeBody.idToken)
      .then(data => {
        console.log("google OAuth confirm : ", data);
        res.status(200);
        res.send("ok");
      })
      .catch(err => {
        console.log(err);
        res.status(404);
        res.send("bad request");
      })

        // const userData = await this.userService.insertUser(
        //   completeBody.userName,
        //   completeBody.password,
        //   completeBody.email
        // );


        // // express문법으로 response
        // res.set('Authorization', 'Bearer ' + userData.token);
        // res.send({

        //     userId : userData.id,
        //     userName : userData.userName,
        //     email : userData.email,
        //     calender:[],
        //     toDoList:[],
        //     message : "userinfo updated"
            
        // })


  }
}
