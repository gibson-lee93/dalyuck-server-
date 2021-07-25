import {
  InternalServerErrorException,
  HttpException,
  NotFoundException,
  ConflictException
} from '@nestjs/common';
import { User } from './user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { TodoList } from '../todolist/todolist.entity';
import { Calendar } from '../calendar/calendar.entity';
import { insertHolidayCalendar, insertHolidayEvent } from '../function/query/queryFunctions';
import { OtherCalendar } from '../other-calendar/other-calendar.entity';
import {createToken, checkToken} from '../function/token/createToken';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { userName, email, password } = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User();
    user.userName = userName;
    user.email = email;
    user.password = hashedPassword;

    try {
      await user.save();
      const userId : number = user.id;

      const calendar = new Calendar();
      calendar.userId = userId;
      calendar.calendarName = `${user.userName}`;
      await calendar.save();

      await this.query(insertHolidayCalendar(userId));
      const otherCalendar = await OtherCalendar.findOne({ userId });
      await this.query(insertHolidayEvent(otherCalendar.id));

      const todoList = new TodoList();
      todoList.toDoListName = 'Tasks';
      todoList.userId = user.id;
      await todoList.save();
    } catch(error) {
      if(error.code === '23505') { //duplicate username
        throw new ConflictException('Username already exists');
      }
      else {
        throw new InternalServerErrorException();
      }
    }
  }
}
