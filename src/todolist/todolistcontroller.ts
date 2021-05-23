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
          Put
       } from '@nestjs/common';
import { Response } from 'express';
import { TodoListService } from './todolist.service';
import { TodoList } from './todolist.entity'

@Controller('todolist')
export class TodoListController {
  constructor(private readonly todolistService: TodoListService) {}

  // 등록되어있는 유저의 TodoList를 확인한다.
  @Get()
  async userTodoList(){
    console.log("userTodoList active");
    return this.todolistService.postTodoList();
  }


  // TodoList를 등록한다.
  @Post('signup')
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

        const userTodoList = await this.todolistService.insertTodoList(
          headers,
          completeBody.userId,
          completeBody.colour,
          completeBody.toDoListName
        );

        

        return {
          "TodoList" : userTodoList
        }
        // return userData;

  }

  // TodoList를 수정한다.
  @Put()
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
          "TodoList" : userTodoList
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
