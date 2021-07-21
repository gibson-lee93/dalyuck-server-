import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  Timestamp
} from 'typeorm';

import { TodoList } from "../todolist/todolist.entity";

@Entity()
export class Todo extends BaseEntity {
@PrimaryGeneratedColumn()
id: number;

@Column()
startTime: string;

@Column({ default: 'rgb(121, 134, 203)' })
colour: string;

@Column({ nullable : false })
toDoName: string;

@Column({ nullable : true })
description : string;

@Column({ nullable : false })
todolistId : number;

@Column({ nullable : true })
endTime : string;

@Column({ default : false })
isFinish : boolean;

@ManyToOne(type => TodoList, todolist => todolist.todo, {
eager: false,
onDelete: 'CASCADE'
})
todolist : TodoList;


}
