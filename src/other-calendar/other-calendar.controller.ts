import { Controller, Patch, Body, Headers, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OtherCalendarService } from './other-calendar.service';
import { OtherCalendar } from './other-calendar.entity';
import { UpdateOtherCalendarDto } from './dto/update-other-calendar.dto';
import { GetUser } from '../user/get-user.decorator';
import { User } from '../user/user.entity';

@Controller('calendar')
export class OtherCalendarController {
  constructor(private otherCalendarService: OtherCalendarService) {}

  @Patch('/request')
  @UseGuards(AuthGuard())
  confirmSubscription(
    @Body('requestEmailId') requestEmailId: number,
    @GetUser() user: User
  ): Promise<OtherCalendar> {
    return this.otherCalendarService.confirmSubscription(requestEmailId, user);
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
