import { Controller, Post, Body, Headers, Patch } from '@nestjs/common';
import { AttendRequestService } from './attend-request.service';
import { SendAttendRequestDto } from './dto/send-attend-request.dto';
import { ConfirmAttendRequestDto } from './dto/confirm-attend-request.dto';

@Controller('event')
export class AttendRequestController {
  constructor(private attendRequestService: AttendRequestService) {}

  @Patch('/attend')
  confirmAttendRequest(
    @Body('userId') userId: number,
    @Body() confirmAttendRequestDto: ConfirmAttendRequestDto
  ): Promise<void> {
    return this.attendRequestService.confirmAttendRequest(userId, confirmAttendRequestDto);
  }
}
