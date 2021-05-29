import { Controller, Post, Body, Headers } from '@nestjs/common';
import { AttendRequestService } from './attend-request.service';
import { SendAttendRequestDto } from './dto/send-attend-request.dto';

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
}
