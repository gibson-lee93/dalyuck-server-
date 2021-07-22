import {
  Get,
  Controller,
  Post,
  Body,
  Patch,
  Delete,
  Inject,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CalendarService } from './calendar.service';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { UpdateCalendarDto } from './dto/update-calendar.dto';
import { Calendar } from './calendar.entity';
import { RequestEmailService } from '../request-email/request-email.service';
import { SubscribeCalendarDto } from '../request-email/dto/subscribe-calendar.dto';
import { OtherCalendar } from '../other-calendar/other-calendar.entity';
import { GetUser } from '../user/get-user.decorator';
import { User } from '../user/user.entity';

@Controller('calendar')
@UseGuards(AuthGuard())
export class CalendarController {
  constructor(
    private calendarService: CalendarService,
    @Inject(RequestEmailService)
    private requestEmailService: RequestEmailService
  ) {}

  @Post('/subscribe')
  subscribeCalendar(
    @Body() subscribeCalendarDto: SubscribeCalendarDto,
    @GetUser() user: User
  ): Promise<OtherCalendar> {
    return this.requestEmailService.subscribeCalendar(subscribeCalendarDto, user);
  }

  @Post('/search')
  searchCalendar(
    @Body('keyword') keyword: string,
    @GetUser() user: User
  ): Promise<{ event:[], message: string }> {
    return this.calendarService.searchCalendar(keyword, user);
  }

  @Get()
  getCalendar(
    @GetUser() user: User
  ): Promise<{ calendar: {}, otherCalendars: {} }> {
    return this.calendarService.getCalendar(user);
  }

  @Post()
  createCalendar(
    @Body() createCalendarDto: CreateCalendarDto,
    @GetUser() user: User,
  ): Promise<Calendar> {
    return this.calendarService.createCalendar(createCalendarDto, user);
  }

  @Patch()
  updateCalendar(
    @Body() updateCalendarDto: UpdateCalendarDto,
    @GetUser() user: User,
  ): Promise<Calendar> {
    return this.calendarService.updateCalendar(updateCalendarDto, user);
  }

  @Delete()
  deleteCalendar(
    @Body('calendarId') calendarId: number
  ): Promise<void> {
    return this.calendarService.deleteCalendar(calendarId);
  }
}
