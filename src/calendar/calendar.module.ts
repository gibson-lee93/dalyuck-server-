import { Module } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CalendarController } from './calendar.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarRepository } from './calendar.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([CalendarRepository])
  ],
  providers: [CalendarService],
  controllers: [CalendarController]
})
export class CalendarModule {}
