import { Controller, Post, Headers, Param, Query, ParseIntPipe, HttpCode } from '@nestjs/common';
import { OtherEventService } from './other-event.service';
import { OtherEvent } from './other-event.entity';

@Controller('otherEvent')
export class OtherEventController {
  constructor(private otherEventService: OtherEventService) {}

  @Post('/:id')
  @HttpCode(200)
  getCalendar(
    @Headers('authorization') headers: string,
    @Param('id', ParseIntPipe) userId: number,
    @Query('otherCalendarId', ParseIntPipe) otherCalendarId: number
  ): Promise<OtherEvent[]> {
    return this.otherEventService.getOtherEvent(headers, userId, otherCalendarId);
  }
}
