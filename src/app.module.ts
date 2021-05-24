import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CalendarModule } from './calendar/calendar.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { EventModule } from './event/event.module';
import { TodoListModule } from './todolist/todolist.module';
import { TodoModule } from './todo/todo.module';



@Module({
  imports: [UserModule,
    CalendarModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    EventModule,
    TodoListModule,
    TodoModule


  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
