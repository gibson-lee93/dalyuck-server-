import { Controller, Patch, Body, Headers, Delete } from '@nestjs/common';
import { OtherCalendarService } from './other-calendar.service';
import { OtherCalendar } from './other-calendar.entity';
import { UpdateOtherCalendarDto } from './dto/update-other-calendar.dto';

@Controller('calendar')
export class OtherCalendarController {
  constructor(private otherCalendarService: OtherCalendarService) {}

  @Patch('/request')
  confirmSubscription(
    @Headers('authorization') headers: string,
    @Body('userId') userId: number,
    @Body('requestEmailId') requestEmailId: number
  ): Promise<OtherCalendar> {
    return this.otherCalendarService.confirmSubscription(headers, userId, requestEmailId);
  }

  @Patch('/subscribe')
  updateOtherCalendar(
    @Headers('authorization') headers: string,
    @Body('userId') userId: number,
    @Body() updateOtherCalendarDto: UpdateOtherCalendarDto
  ): Promise<OtherCalendar> {
    return this.otherCalendarService.updateOtherCalendar(headers, userId, updateOtherCalendarDto);
  }

  @Delete('/subscribe')
  deleteOtherCalendar(
    @Headers('authorization') headers: string,
    @Body('userId') userId: number,
    @Body('otherCalendarId') otherCalendarId: number
  ): Promise<void> {
    return this.otherCalendarService.deleteOtherCalendar(headers, userId, otherCalendarId);
  }
}
