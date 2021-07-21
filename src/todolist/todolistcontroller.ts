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
    HttpCode,
    Put,
    Param,
    ParseIntPipe,
    Query,
    UnauthorizedException
 } from '@nestjs/common';

import { Response } from 'express';
import { TodoListService } from './todolist.service';
import { TodoList } from './todolist.entity'

@Controller('todolist')
export class TodoListController {
constructor(private readonly todolistService: TodoListService) {}

// 등록되어있는 유저의 TodoList를 확인한다.
  @Get()
  async getTodoList(
    @Headers('authorization') headers: string,
    @Query() query
  ): Promise<TodoList[]> {
    console.log("TodoList GET activated");

    if(!query.userId){
      // service에서 method inquireAllMember를 이용하여
      // 모든 DB에 있는 member정보를 받는다.
      console.log("empty")
      throw new UnauthorizedException({
        "message" : "Parameter userId is empty or wrong"
      });
    }
    const result = this.todolistService.getTodoList(headers, query.userId);
    console.log(result)
    return result;
  }

  // 등록되어있는 유저의 TodoList를 확인한다.(POST)
  @Post('/:userId')
  async postTodoList(
    @Headers('authorization') headers: string,
    @Param('userId', ParseIntPipe) userId: number
  ): Promise<TodoList[]> {
    console.log("TodoList Post activated");

    if(!userId){
      // service에서 method inquireAllMember를 이용하여
      // 모든 DB에 있는 member정보를 받는다.
      console.log("empty")
      throw new UnauthorizedException({
        "message" : "Parameter userId is empty or wrong"
      });
    }
    const result = this.todolistService.getTodoList(headers, userId);
    console.log(result)
    return result;
  }

// TodoList를 등록한다.
@Post()
async userTodoListSignup(
// Client의 Body에서 온 정보를 각각 변수로
// 저장
@Headers() headers,
@Body() completeBody: {
userId : number,
colour : string,
toDoListName : string
}

) {
  console.log("공백 Post")
  const userTodoList = await this.todolistService.insertTodoList(
    headers,
    completeBody.userId,
    completeBody.colour,
    completeBody.toDoListName
  );


  // return값은 TodoList 및 message를 응답한다.
  return {
    "TodoList" : userTodoList,
    "message" : "TodoList Create"
  }
  // return userData;

}

// TodoList를 수정(update)한다.
@Patch()
async userTodoListUpdate(
// Client의 Body에서 온 정보를 각각 변수로
// 저장
@Headers() headers,
@Body() completeBody: {
userId : number,
toDoListId : number,
colour : string,
toDoListName : string
}

) {

  const userTodoList = await this.todolistService.updateTodoList(
    headers,
    completeBody.userId,
    completeBody.toDoListId,
    completeBody.colour,
    completeBody.toDoListName
  );

  return {
    "TodoList" : userTodoList,
    "message" : "TodoList Update!"
  }
  // return userData;

}

// TodoList를 삭제한다.
@Delete()
async userTodoListDelete(
  // Client의 Body에서 온 정보를 각각 변수로
  // 저장
  @Headers() headers,
  @Body() completeBody: {
    userId : number,
    toDoListId : number,
  },
  @Res() res : Response

) {

    const userTodoList = await this.todolistService.deleteTodoList(
      headers,
      completeBody.userId,
      completeBody.toDoListId
    );

    if(userTodoList.error){

      res.status(userTodoList.error);
      res.send({
        "statusCode" : userTodoList.error,
        "message" : userTodoList.message
      })

    }

    else if(!userTodoList.error){

      res.status(userTodoList.status);
      res.send({
        "statusCode" : userTodoList.status,
        "message" : userTodoList.message
      })

    }


}


}
