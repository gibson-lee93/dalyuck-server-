import { Controller, Post, Body, Headers, Patch } from '@nestjs/common';
import { AttendRequestService } from './attend-request.service';
import { SendAttendRequestDto } from './dto/send-attend-request.dto';
import { ConfirmAttendRequestDto } from './dto/confirm-attend-request.dto';

@Controller('event')
export class AttendRequestController {
  constructor(private attendRequestService: AttendRequestService) {}

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
