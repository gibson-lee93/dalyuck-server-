import { Controller, Post, Body, Headers } from '@nestjs/common';
import { RequestEmailService } from './request-email.service';
import { SubscribeCalendarDto } from './dto/subscribe-calendar.dto';

@Controller('calendar')
export class RequestEmailController {
  constructor(private requestEmailService: RequestEmailService) {}

  @Post('/subscribe')
  subscribeCalendar(
    @Headers('authorization') headers: string,
    @Body('userId') userId: number,
    @Body() subscribeCalendarDto: SubscribeCalendarDto
  ): Promise<void> {
    return this.requestEmailService.subscribeCalendar(headers, userId, subscribeCalendarDto);
  }
}
