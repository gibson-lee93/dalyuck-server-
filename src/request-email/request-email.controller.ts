import { Controller, Post, Body, Headers, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RequestEmailService } from './request-email.service';
import { SubscribeCalendarDto } from './dto/subscribe-calendar.dto';
import { GrantSubscriptionDto } from './dto/grant-subscription.dto';
import { OtherCalendar } from '../other-calendar/other-calendar.entity';
import { GetUser } from '../user/get-user.decorator';
import { User } from '../user/user.entity';

@Controller('calendar')
@UseGuards(AuthGuard())
export class RequestEmailController {
  constructor(private requestEmailService: RequestEmailService) {}

  @Post('/request')
  grantSubscription(
    @Body() grantSubscriptionDto: GrantSubscriptionDto,
    @GetUser() user: User
  ): Promise<OtherCalendar> {
    return this.requestEmailService.grantSubscription(grantSubscriptionDto, user);
  }
}
