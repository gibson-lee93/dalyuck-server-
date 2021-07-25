import {
  Controller,
  Body,
  Post,
  Patch,
  Delete,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { User } from './user.entity';
import { verify } from '../function/oauth/googleOauth';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UpdateUserDto} from './dto/update-user.dto';
import { GetUser } from './get-user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 등록되어있는 전체 유저를 확인한다.
  // @Get()
  // async userGet(){
  //   console.log("userGet active");
  //   return this.userService.postUser();
  // }
  //
  // // 등록되어있는 전체 유저를 확인한다.
  // @Get('info')
  // async userOneGet(
  //   @Body('userId') userId : number,
  //   @Headers() headers
  // ){
  //   console.log("userOneGet active");
  //   return await this.userService.checkOneUser(headers, userId );
  // }

  @Post('signup')
  signUp(
    @Body() authCredentialsDto: AuthCredentialsDto
  ): Promise<void> {
    return this.userService.signUp(authCredentialsDto);
  }

  @Post('login')
  logIn(
    @Body() authCredentialsDto: AuthCredentialsDto
  ): Promise<{ user: User, accessToken: string }> {
    return this.userService.logIn(authCredentialsDto);
  }

  @UseGuards(AuthGuard())
  @Patch()
  updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() user: User,
  ): Promise<User> {
    return this.userService.updateUser(updateUserDto, user);
  }

  @UseGuards(AuthGuard())
  @Delete()
  deleteUser(
    @GetUser() user: User
  ): Promise<void> {
    return this.userService.deleteUser(user);
  }

  // Google OAuth 2.0회원가입을 한다.
  // @Post('/oauth/google')
  // async userSignupOauth_Google(
  //   // Client의 Body에서 온 정보를 각각 변수로
  //   // 저장
  //   @Body() completeBody: {
  //     idToken: string,
  //     userName: string,
  //     email: string
  //   },
  //   @Res() res : Response // express문법의 res사용하기위한 코드
  //
  // ) {
  //
  //   // Client에서 받은 idToken을 검증한다.
  //   verify(completeBody.idToken)
  //     .then(async (data) => { // 검증완료 : True
  //       console.log("google OAuth confirm : ", data);
  //
  //       const found = await User.findOne({email : completeBody.email});
  //
  //         // DB에 Email이 존재하지 않음
  //         if(!found) {
  //           // 회원가입절차.
  //           const userData = await this.userService.insertUser(
  //             completeBody.userName,
  //             "OAuthUser_Google",
  //             completeBody.email
  //           )
  //           console.log(userData);
  //           // Client에 줄 Token 셋팅
  //           res.set('Authorization', 'Bearer ' + userData.token);
  //           // 정상처리로 statusCode는 200
  //           res.status(200);
  //           // 회원가입한 후이기 때문에 모든 정보를 Client쪽으로 전달
  //           res.send({
  //             userId : userData.user.id,
  //             userName : userData.user.userName,
  //             email : userData.user.email,
  //             calender:userData.calendar,
  //             toDoList:userData.todoList,
  //             message : "userinfo updated"
  //           });
  //         }
  //
  //         else{
  //           // 로그인 절차
  //           const user = await this.userService.logIn(completeBody.email, "OAuthUser_Google");
  //           res.set('Authorization', 'Bearer ' + user.token);
  //           delete user.token;
  //           res.send({
  //             user
  //           });
  //         }
  //
  //
  //
  //     })
  //     .catch(err => { // 검증완료 : False
  //       // const errorMessage = err.split(",")[0];
  //       let errorMessage:string ;
  //       console.log("Google OAuth 2.0 과정중 에러 발생!");
  //
  //       // 실제 google oauth에서 에러가 난건지 확인
  //       if(String(err).includes("Error: ")){
  //         res.status(403);
  //         res.send({
  //           message: "토큰에 문제가 있음",
  //           googleMessage: err.toString()
  //         });
  //       }
  //       // google oauth에서 난 에러가 아님
  //       else{
  //         res.status(500);
  //         res.send({
  //           message: "Server error occurred",
  //           systemMessage : String(err)
  //         });
  //       }
  //
  //     })
  // }
}
