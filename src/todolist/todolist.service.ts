import { Injectable, HttpException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { User } from './user.class';
import { checkToken } from '../function/token/createToken';
import { TodoList } from "./todolist.entity";
import { TodoListRepository } from './todolist.repository';


@Injectable()
export class TodoListService {
  constructor(
    @InjectRepository(TodoListRepository)
    private todolistRepository: TodoListRepository
  ) {}
  // DB구축전 테스트용 코드(DB설치후 삭제)
  // private userDB: User[] = [];
  async getTodoList(
    headers: string,
    userId: number
  ): Promise<TodoList[]> {
    const token = headers.split(" ")[1];
    const checkHeaderToken = await checkToken(token, userId);
    console.log("getTodoList1");
    // token이상으로 에러 메세지 응답
    if(checkHeaderToken.error){
      throw new UnauthorizedException(checkHeaderToken.message);
    }
    console.log("getTodoList2");
    return await this.todolistRepository.find({ userId });
  }

  // Controller에서 TodoList정보 등록 요청시 method
  async insertTodoList(
    headers : any,
    userId : number,
    colour : string,
    toDoListName : string,
  ) : Promise <any>{
    const token = headers.authorization.split(" ")[1];
    const checkHeaderToken = await checkToken(token, userId);

    // token이상으로 에러 메세지 응답
    if(checkHeaderToken.error){
      throw new UnauthorizedException(checkHeaderToken.message);
    }

    const result = this.todolistRepository.createTodoList(userId, colour, toDoListName);

    return result;
  }

  // Controller에서 TodoList정보 업데이트 요청시 method
  async updateTodoList(
    headers : any,
    userId : number,
    toDoListId: number,
    colour : string,
    toDoListName : string,
  ) : Promise <any>{
    const token = headers.authorization.split(" ")[1];
    const checkHeaderToken = await checkToken(token, userId);

    // token이상으로 에러 메세지 응답
    if(checkHeaderToken.error){
      throw new UnauthorizedException(checkHeaderToken.message);
    }

    const result = this.todolistRepository.updateTodoList(toDoListId,colour, toDoListName);

    return result;
  }

  // Controller에서 TodoList정보 삭제 요청시 method
  async deleteTodoList(
    headers : any,
    userId : number,
    toDoListId: number
  ) : Promise <any>{
    const token = headers.authorization.split(" ")[1];
    const checkHeaderToken = await checkToken(token, userId);

    // token이상으로 에러 메세지 응답
    if(checkHeaderToken.error){
      throw new UnauthorizedException(checkHeaderToken.message);
    }

    const result = this.todolistRepository.deleteTodoList(toDoListId);
    console.log(result);

    return result;
  }


}
