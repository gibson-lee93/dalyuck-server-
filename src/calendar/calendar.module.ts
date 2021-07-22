import { Module } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CalendarController } from './calendar.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarRepository } from './calendar.repository';
import { RequestEmailModule } from '../request-email/request-email.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CalendarRepository]),
    RequestEmailModule,
    UserModule
  ],
  providers: [CalendarService],
  controllers: [CalendarController]
})
export class CalendarModule {}
