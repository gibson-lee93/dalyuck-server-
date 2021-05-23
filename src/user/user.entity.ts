import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany
} from 'typeorm';

import { Calendar } from "../calendar/calendar.entity";
import { TodoList } from "../todolist/todolist.entity";

@Entity()
export class User extends BaseEntity {
@PrimaryGeneratedColumn()
id: number;

@Column()
userName: string;

@Column()
email: string;

@Column()
password: string;

@Column()
salt: string;

@Column({nullable:true})
token: string;

@OneToMany(type => Calendar, calendar => calendar.user, {
eager: true,
cascade: true
})
calendar: Calendar[];

@OneToMany(type => TodoList, todolist => todolist.user, {
eager: true,
cascade: true
})
todolist: TodoList[];
}
