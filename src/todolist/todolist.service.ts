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


  // userDB를 확인하기 위한 method
  async postTodoList():  Promise <TodoList[]> {
    return await this.todolistRepository.find()
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

    if(checkHeaderToken.error){
      throw new UnauthorizedException(checkHeaderToken.message);
    }

    const result = this.todolistRepository.createTodoList(userId, colour, toDoListName);

    return result;
  }

  // // Controller에서 TodoList정보 업데이트 요청시 method
  // async updateTodoList(
  //   headers : any,
  //   userId : number,
  //   toDoListId: number,
  //   colour : string,
  //   toDoListName : string,
  // ) : Promise <any>{
  //   const token = headers.authorization.split(" ")[1];
  //   const checkHeaderToken = await checkToken(token, userId);

  //   if(checkHeaderToken.error){
  //     throw new UnauthorizedException(checkHeaderToken.message);
  //   }

  //   const result = this.todolistRepository.updateTodoList(userId,toDoListId,colour, toDoListName);

  //   return result;
  // }

  // // Controller에서 TodoList정보 삭제 요청시 method
  // async deleteTodoList(
  //   headers : any,
  //   userId : number,
  //   toDoListId: number
  // ) : Promise <any>{
  //   const token = headers.authorization.split(" ")[1];
  //   const checkHeaderToken = await checkToken(token, userId);

  //   if(checkHeaderToken.error){
  //     throw new UnauthorizedException(checkHeaderToken.message);
  //   }

  //   const result = this.todolistRepository.deleteTodoList(toDoListId);
  //   console.log(result);

  //   return result;
  // }

}
