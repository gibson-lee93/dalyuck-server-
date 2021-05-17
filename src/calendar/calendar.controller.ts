import { Controller, Post, Body, Patch, Delete } from '@nestjs/common';
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

  @Patch()
  updateCalendar(
    @Body('calendarId') calendarId: number,
    @Body('calendarName') calendarName?: string,
    @Body('description') description?: string,
    @Body('colour') colour?: string
  ): Promise<Calendar> {
    return this.calendarService.updateCalendar(calendarId, calendarName, description, colour);
  }

  @Delete()
  deleteCalendar(@Body('calendarId') calendarId: number): Promise<void> {
    return this.calendarService.deleteCalendar(calendarId);
  }
}
