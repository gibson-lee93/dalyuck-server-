import { Controller, Post, Body, Patch, Delete, Headers } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { UpdateCalendarDto } from './dto/update-calendar.dto';
import { Calendar } from './calendar.entity';

@Controller('calendar')
export class CalendarController {
  constructor(private calendarService: CalendarService) {}

  @Post()
  createCalendar(
    @Body() createCalendarDto: CreateCalendarDto,
    @Body('userId') userId: number,
    @Headers('authorization') headers: string
  ): Promise<Calendar> {
    return this.calendarService.createCalendar(createCalendarDto, userId, headers);
  }

  @Patch()
  updateCalendar(
    @Headers('authorization') headers: string,
    @Body('userId') userId: number,
    @Body() updateCalendarDto: UpdateCalendarDto
  ): Promise<Calendar> {
    return this.calendarService.updateCalendar(userId, headers, updateCalendarDto);
  }

  @Delete()
  deleteCalendar(
    @Headers('authorization') headers: string,
    @Body('userId') userId: number,
    @Body('calendarId') calendarId: number
  ): Promise<void> {
    return this.calendarService.deleteCalendar(headers, userId, calendarId);
  }

}
