import {
        BaseEntity,
        Entity,
        PrimaryGeneratedColumn,
        Column,
        OneToMany,
        ManyToOne
    } from 'typeorm';

import { User } from "../user/user.entity";
import { Todo } from "../todo/todo.entity";

@Entity()
export class TodoList extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'rgb(121, 134, 203)' })
  colour: string;

  @Column({ default: 'default todolist' })
  toDoListName: string;

  @Column()
  userId: number;

  @ManyToOne(type => User, user => user.todolist, {
    eager: false,
    onDelete: 'CASCADE'
  })
  user : User;

  @OneToMany(type => Todo, todo => todo.todolist, {
    eager: true,
    cascade: true
   })
  todo: Todo[];
}
