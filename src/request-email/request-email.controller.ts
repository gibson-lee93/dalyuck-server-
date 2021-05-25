import { Controller, Post, Body, Headers, HttpCode } from '@nestjs/common';
import { RequestEmailService } from './request-email.service';
import { SubscribeCalendarDto } from './dto/subscribe-calendar.dto';
import { GrantSubscriptionDto } from './dto/grant-subscription.dto';

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

  @Post('/request')
  @HttpCode(200)
  grantSubscription(
    @Headers('authorization') headers: string,
    @Body('userId') userId: number,
    @Body() grantSubscriptionDto: GrantSubscriptionDto
  ): Promise<void> {
    return this.requestEmailService.grantSubscription(headers, userId, grantSubscriptionDto);
  }
}
