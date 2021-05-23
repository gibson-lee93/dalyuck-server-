import { Todo } from './todo.entity';
import { EntityRepository, Repository} from 'typeorm';
// import { CreateTodoListDto } from './dto/create-todolist.dto';
// import { checkToken } from '../function/token/createToken';
// import { CreateUserDto } from './dto/create-user.dto';
import { InternalServerErrorException } from '@nestjs/common';

@EntityRepository(Todo)
export class TodoRepository extends Repository<Todo> {

  // Todo를 생성한다.
  async createTodo(
    startTime : string,
    toDoName : string,
    description : string,
    todoListId : number
  ){

    const todo = new Todo();
    
    todo.startTime = startTime;
    todo.toDoName = toDoName;
    todo.todolistId = todoListId;
    

    if(description.length > 0){
      todo.description = description;
    }

    try{
      await todo.save();
      return todo;
    }

    catch(error){
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }


  }

  // Todo를 수정한다.
  async updateTodo(
    todoId: number,
    startTime : string,
    toDoName : string,
    description : string
  ){

    const todo = await this.findOne({ id: todoId});
    todo.startTime = startTime;
    todo.toDoName = toDoName.length !== 0 ? toDoName : todo.toDoName;
    todo.description = description.length !== 0 ? description : todo.description;

    try{
      await todo.save();
      return todo;
    }

    catch(error){
      throw new InternalServerErrorException(error.message);
    }


  }

  // TodoList를 삭제한다.
  async deleteTodo(
    todoId : number
  ){

    try{
      console.log("1. repository(deleteTodoList) : Start");
      const check = await this.findOne({id : todoId});
      console.log("check : ", check);
      if(!check){
        return{ error: 401, message : "TodoList does not exist" };
      }

      const result = await this.delete({id : todoId});
        if(result.affected === 0){
          console.log("error1 repository(deleteTodoList) : 삭제가 제대로 안됨");
          // throw new HttpException("User did not delete from the server", 500);
          return {error : 500, message : "TodoList did not delete from the server"};
        }
        // throw new HttpException("User deleted", 200);
        console.log("2. repository(deleteTodoList) : 삭제가 제대로 됨");
        return {status: 200, message : "TodoList deleted"};
        // return "User deleted";
      }

    catch(error){
      throw new InternalServerErrorException(error.message);
    }


  }
  
}
