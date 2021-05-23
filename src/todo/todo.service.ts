import { Injectable, HttpException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Timestamp } from 'typeorm';
// import { User } from './user.class';
import { checkToken } from '../function/token/createToken';
import { Todo } from "./todo.entity";
import { TodoRepository } from './todo.repository';


@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoRepository)
    private todoRepository: TodoRepository
  ) {}
  // DB구축전 테스트용 코드(DB설치후 삭제)
  // private userDB: User[] = [];


  // userDB를 확인하기 위한 method
  async postTodoList():  Promise <Todo[]> {
    return await this.todoRepository.find()
  }

  

  // Controller에서 Todo정보 등록 요청시 method
  async insertTodo(
    headers : any,
    userId : number,
    todoListId : number,
    startTime : string,
    toDoName : string,
    description : string
  ) : Promise <any>{
    const token = headers.authorization.split(" ")[1];
    const checkHeaderToken = await checkToken(token, userId);

    if(checkHeaderToken.error){
      throw new UnauthorizedException(checkHeaderToken.message);
    }

    const result = this.todoRepository.createTodo(startTime, toDoName, description, todoListId);

    return result;
  }


  // Controller에서 Todo정보 업데이트 요청시 method
  async updateTodo(
    headers : any,
    userId : number,
    todoId: number,
    startTime : string,
    toDoName : string,
    description : string
  ) : Promise <any>{
    const token = headers.authorization.split(" ")[1];
    const checkHeaderToken = await checkToken(token, userId);

    if(checkHeaderToken.error){
      throw new UnauthorizedException(checkHeaderToken.message);
    }

    const result = this.todoRepository.updateTodo(todoId, startTime, toDoName, description);

    return result;
  }

  // Controller에서 Todo정보 삭제 요청시 method
  async deleteTodo(
    headers : any,
    userId : number,
    todoId: number
  ) : Promise <any>{
    const token = headers.authorization.split(" ")[1];
    const checkHeaderToken = await checkToken(token, userId);

    if(checkHeaderToken.error){
      throw new UnauthorizedException(checkHeaderToken.message);
    }

    const result = this.todoRepository.deleteTodo(todoId);
    console.log(result);

    return result;
  }

}
