import { Controller, Post, Body } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { Calendar } from './calendar.entity';

@Controller('calendar')
export class CalendarController {
  constructor(private calendarService: CalendarService) {}

  @Post()
  createCalendar(
    @Body() createCalendarDto: CreateCalendarDto
  ): Promise<Calendar> {
    return this.calendarService.createCalendar(createCalendarDto);
  }
}
