import { Controller, Post, Body, Patch, Delete, Headers } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { Calendar } from './calendar.entity';

@Controller('calendar')
export class CalendarController {
  constructor(private calendarService: CalendarService) {}

  @Post()
  createCalendar(
    @Body() createCalendarDto: CreateCalendarDto,
    @Body('userId') userId: number,
    @Headers() headers: any
  ): Promise<Calendar> {
    return this.calendarService.createCalendar(createCalendarDto, userId, headers);
  }

  @Patch()
  updateCalendar(
    @Headers() headers: any,
    @Body('userId') userId: number,
    @Body('calendarId') calendarId: number,
    @Body('calendarName') calendarName?: string,
    @Body('description') description?: string,
    @Body('colour') colour?: string
  ): Promise<Calendar> {
    return this.calendarService.updateCalendar(userId, headers, calendarId, calendarName, description, colour);
  }

  @Delete()
  deleteCalendar(
    @Headers() headers: any,
    @Body('userId') userId: number,
    @Body('calendarId') calendarId: number
  ): Promise<void> {
    return this.calendarService.deleteCalendar(headers, userId, calendarId);
  }
}
