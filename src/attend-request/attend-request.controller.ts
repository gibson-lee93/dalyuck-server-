import { Controller, Post, Body, Headers, Patch, Get, Param, ParseIntPipe } from '@nestjs/common';
import { AttendRequestService } from './attend-request.service';
import { SendAttendRequestDto } from './dto/send-attend-request.dto';
import { ConfirmAttendRequestDto } from './dto/confirm-attend-request.dto';
import { Event } from '../event/event.entity';

@Controller('event')
export class AttendRequestController {
  constructor(private attendRequestService: AttendRequestService) {}

  @Get('/attend/:id')
  getAttendEvent(
    @Headers('authorization') headers: string,
    @Param('id', ParseIntPipe) userId: number,
  ): Promise<Event[]> {
    return this.attendRequestService.getAttendEvent(headers, userId);
  }

  @Post('/attend')
  sendAttendRequest(
    @Headers('authorization') headers: string,
    @Body('userId') userId: number,
    @Body() sendAttendRequestDto: SendAttendRequestDto
  ): Promise<void> {
    return this.attendRequestService.sendAttendRequest(headers, userId, sendAttendRequestDto);
  }

  @Patch('/attend')
  confirmAttendRequest(
    @Headers('authorization') headers: string,
    @Body('userId') userId: number,
    @Body() confirmAttendRequestDto: ConfirmAttendRequestDto
  ): Promise<void> {
    return this.attendRequestService.confirmAttendRequest(headers, userId, confirmAttendRequestDto);
  }
}
