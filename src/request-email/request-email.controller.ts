import { Controller, Post, Body, Headers } from '@nestjs/common';
import { RequestEmailService } from './request-email.service';
import { SubscribeCalendarDto } from './dto/subscribe-calendar.dto';
import { GrantSubscriptionDto } from './dto/grant-subscription.dto';
import { OtherCalendar } from '../other-calendar/other-calendar.entity';

@Controller('calendar')
export class RequestEmailController {
  constructor(private requestEmailService: RequestEmailService) {}

  @Post('/request')
  grantSubscription(
    @Headers('authorization') headers: string,
    @Body('userId') userId: number,
    @Body() grantSubscriptionDto: GrantSubscriptionDto
  ): Promise<OtherCalendar> {
    return this.requestEmailService.grantSubscription(headers, userId, grantSubscriptionDto);
  }
}
