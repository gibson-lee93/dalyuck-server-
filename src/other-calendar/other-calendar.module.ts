import { Module } from '@nestjs/common';
import { OtherCalendarService } from './other-calendar.service';
import { OtherCalendarController } from './other-calendar.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtherCalendarRepository } from './other-calendar.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([OtherCalendarRepository])
  ],
  providers: [OtherCalendarService],
  controllers: [OtherCalendarController],
  exports: [OtherCalendarService]
})
export class OtherCalendarModule {}
