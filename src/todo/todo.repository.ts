import { Todo } from './todo.entity';
import { EntityRepository, Repository} from 'typeorm';
// import { CreateTodoListDto } from './dto/create-todolist.dto';
// import { checkToken } from '../function/token/createToken';
// import { CreateUserDto } from './dto/create-user.dto';
import { InternalServerErrorException, ForbiddenException } from '@nestjs/common';

@EntityRepository(Todo)
export class TodoRepository extends Repository<Todo> {

  // Todo를 생성한다.
  async createTodo(
    startTime : string,
    toDoName : string,
    description : string,
    todoListId : number,
    endTime : string
  ){

    const todo = new Todo();
    
    todo.startTime = startTime;
    todo.toDoName = toDoName;
    todo.todolistId = todoListId;
    todo.endTime = endTime;
    
    // description의 문자열 길이가 0보다 크면 if문을 실행한다.(description에 내용이 있음)
    if(description.length > 0){
      todo.description = description;
    }

    // todo를 DB에 저장후 Service로 return
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
    description : string,
    isFinish : boolean,
    endTime : string
  ){

    const todo = await this.findOne({ id: todoId});
    // todo를 DB에서 찾지 못한경우 if문 수행
    if(!todo){
      throw new ForbiddenException({ message : `can not find todoId ${todoId}`});
    }

    todo.startTime = startTime;
    todo.toDoName = toDoName.length !== 0 ? toDoName : todo.toDoName;
    todo.description = description.length !== 0 ? description : todo.description;
    todo.isFinish = isFinish;
    todo.endTime = endTime.length !== 0 ? endTime : todo.endTime;

    // todo를 DB에 저장후 Service로 return
    try{
      await todo.save();
      return todo;
    }

    catch(error){
      throw new InternalServerErrorException(error.message);
    }


  }


  // Todo를 삭제한다.
  async deleteTodo(
    todoId : number
  ){
    // todo를 DB에서 찾지 못한경우 if문 수행
    if(!todoId){
      throw new ForbiddenException({ message : `can not find todoId ${todoId}`});
    }

    try{
      console.log("1. repository(deleteTodo) : Start");
      const check = await this.findOne({id : todoId});
      console.log("check : ", check);
      if(!check){
        return{ error: 401, message : "Todo does not exist" };
      }

      const result = await this.delete({id : todoId});
        if(result.affected === 0){
          console.log("error1 repository(deleteTodo) : 삭제가 제대로 안됨");
          return {error : 500, message : "Todo did not delete from the server"};
        }

        console.log("2. repository(deleteTodo) : 삭제가 제대로 됨");
        return {status: 200, message : "Todo deleted"};

      }

    catch(error){
      throw new InternalServerErrorException(error.message);
    }


  }

  
}
