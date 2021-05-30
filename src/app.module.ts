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
import { MailerModule } from '@nestjs-modules/mailer';
import { mailConfig } from './config/mail.config';
import { RequestEmailModule } from './request-email/request-email.module';
import { OtherCalendarModule } from './other-calendar/other-calendar.module';
import { OtherEventModule } from './other-event/other-event.module';
import { AttendRequestModule } from './attend-request/attend-request.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    UserModule,
    CalendarModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    EventModule,
    TodoListModule,
    TodoModule,
    MailerModule.forRoot(mailConfig),
    RequestEmailModule,
    OtherCalendarModule,
    OtherEventModule,
    AttendRequestModule,
    NotificationModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
