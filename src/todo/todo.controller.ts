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
          Query
       } from '@nestjs/common';
import { Response } from 'express';
import { TodoService } from './todo.service';
import { Todo } from './todo.entity'
import { Timestamp } from 'typeorm';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  // 등록되어있는 유저의 TodoList를 확인한다.
  @Get('/:id')
  async getTodo(
    @Headers('authorization') headers: string,
    @Param('id', ParseIntPipe) userId: number,
    @Query('todolistId', ParseIntPipe) todolistId: number
  ): Promise<Todo[]> {
    return this.todoService.getTodo(headers, userId, todolistId);
  }


  // Todo를 등록한다.
  @Post()
  async userTodoListSignup(
    // Client의 Body에서 온 정보를 각각 변수로
    // 저장
    @Headers() headers,
    @Body() completeBody: {
      userId : number,
      toDoListId : number,
      toDoName : string,
      startTime : string,
      description : string,
      endTime : string
    }

  ) {

        const userTodo = await this.todoService.insertTodo(
          headers,
          completeBody.userId,
          completeBody.toDoListId,
          completeBody.startTime,
          completeBody.toDoName,
          completeBody.description,
          completeBody.endTime

        );



        return {
          "Todo" : userTodo,
          "message" : "Post Todo success"
        }

  }

  // Todo를 수정한다.
  @Patch()

  async userTodoUpdate(
    // Client의 Body에서 온 정보를 각각 변수로
    // 저장
    @Headers() headers,
    @Body() completeBody: {
      userId : number,
      startTime : string,
      toDoName : string,
      description : string,
      toDoId : number,
      isFinish: boolean,
      endTime : string
    }

  ) {
      console.log("startTime : ", completeBody.startTime)


      const userTodo = await this.todoService.updateTodo(
        headers,
        completeBody.userId,
        completeBody.toDoId,
        completeBody.startTime,
        completeBody.toDoName,
        completeBody.description,
        completeBody.isFinish,
        completeBody.endTime
      );


      return {
        Todo : userTodo,
        "message" : "Patch Todo success"
      }


  }


  // Todo를 삭제한다.
  @Delete()
  async userTodoListDelete(
    // Client의 Body에서 온 정보를 각각 변수로
    // 저장
    @Headers() headers,
    @Body() completeBody: {
      userId : number,
      todoId : number,
    },
    @Res() res : Response

  ) {

      const userTodo = await this.todoService.deleteTodo(
        headers,
        completeBody.userId,
        completeBody.todoId
      );

      if(userTodo.error){

        res.status(userTodo.error);
        res.send({
          "statusCode" : userTodo.error,
          "message" : userTodo.message
        })

      }

      else if(!userTodo.error){

        res.status(userTodo.status);
        res.send({
          "statusCode" : userTodo.status,
          "message" : userTodo.message
        })

      }


  }


}
