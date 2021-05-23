import { TodoList } from './todolist.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTodoListDto } from './dto/create-todolist.dto';
// import { checkToken } from '../function/token/createToken';
// import { CreateUserDto } from './dto/create-user.dto';
import { InternalServerErrorException } from '@nestjs/common';

@EntityRepository(TodoList)
export class TodoListRepository extends Repository<TodoList> {

  // TodoList를 생성한다.
  async createTodoList(
    userId : number,
    colour : string,
    toDoListName : string 
  ){

    const todoList = new TodoList();
    todoList.userId = userId;
    if(colour.length > 0){
      todoList.colour = colour;
    }
    
    todoList.toDoListName = toDoListName;

    try{
      await todoList.save();
      return todoList;
    }

    catch(error){
      throw new InternalServerErrorException(error.message);
    }


  }

  // TodoList를 수정한다.
  async updateTodoList(
    userId : number,
    toDoListId : number,
    colour : string,
    toDoListName : string 
  ){

    const todoList = await this.findOne({ id: toDoListId});
    todoList.colour = colour.length !== 0 ? colour: todoList.colour;
    todoList.toDoListName = toDoListName.length !== 0 ? toDoListName : todoList.toDoListName;

    try{
      await todoList.save();
      return todoList;
    }

    catch(error){
      throw new InternalServerErrorException(error.message);
    }


  }

  // // TodoList를 삭제한다.
  // async deleteTodoList(
  //   toDoListId : number
  // ){

  //   try{
  //     console.log("1. repository(deleteTodoList) : Start");
  //     const check = await TodoList.findOne({id : toDoListId});
  //     console.log("check : ", check);
  //     if(!check){
  //       return{ error: 401, message : "TodoList does not exist" };
  //     }

  //     const result = await TodoList.delete({id : toDoListId});
  //       if(result.affected === 0){
  //         console.log("error1 repository(deleteTodoList) : 삭제가 제대로 안됨");
  //         // throw new HttpException("User did not delete from the server", 500);
  //         return {error : 500, message : "TodoList did not delete from the server"};
  //       }
  //       // throw new HttpException("User deleted", 200);
  //       console.log("2. repository(deleteTodoList) : 삭제가 제대로 됨");
  //       return {status: 200, message : "TodoList deleted"};
  //       // return "User deleted";
  //     }

  //   catch(error){
  //     throw new InternalServerErrorException(error.message);
  //   }


  // }
  
}
