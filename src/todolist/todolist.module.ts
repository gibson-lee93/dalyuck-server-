import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoListController } from './todolistcontroller';
import { TodoListRepository } from './todolist.repository';
import { TodoListService } from './todolist.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TodoListRepository])
  ],
  controllers: [TodoListController],
  providers: [TodoListService],
})
export class TodoListModule {}
