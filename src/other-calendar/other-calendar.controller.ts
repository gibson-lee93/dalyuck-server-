import { Controller, Patch, Body, Headers } from '@nestjs/common';
import { OtherCalendarService } from './other-calendar.service';
import { OtherCalendar } from './other-calendar.entity';

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
}
