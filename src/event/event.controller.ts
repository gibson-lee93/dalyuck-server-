import {
  Controller,
  Post,
  Body,
  Patch,
  Delete,
  Headers,
  ParseIntPipe,
  Param,
  HttpCode,
  Inject,
  Query,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Event } from './event.entity';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { AttendRequestService } from '../attend-request/attend-request.service';
import { SendAttendRequestDto } from '../attend-request/dto/send-attend-request.dto';
import { GetUser } from '../user/get-user.decorator';
import { User } from '../user/user.entity';

@Controller('event')
@UseGuards(AuthGuard())
export class EventController {
  constructor(
    private eventService: EventService,
    @Inject(AttendRequestService)
    private attendRequestService: AttendRequestService
  ) {}

  @Post('/attend')
  sendAttendRequest(
    @Headers('authorization') headers: string,
    @Body('userId') userId: number,
    @Body() sendAttendRequestDto: SendAttendRequestDto
  ): Promise<void> {
    return this.attendRequestService.sendAttendRequest(headers, userId, sendAttendRequestDto);
  }

  @Post('/attendant')
  @HttpCode(200)
  getAttendEvent(
    @Headers('authorization') headers: string,
    @Body('userId', ParseIntPipe) userId: number,
  ): Promise<Event[]> {
    return this.eventService.getAttendEvent(headers, userId);
  }

  @Post('/:id')
  @HttpCode(200)
  getEvent(
    @Headers('authorization') headers: string,
    @Param('id', ParseIntPipe) userId: number,
    @Query('calendarId', ParseIntPipe) calendarId: number
  ): Promise<Event[]> {
    return this.eventService.getEvent(headers, userId, calendarId);
  }

  @Post()
  createEvent(
    @Body() createEventDto: CreateEventDto,
  ): Promise<Event> {
    return this.eventService.createEvent(createEventDto);
  }

  @Patch()
  updateEvent(
    @Body() updateEventDto: UpdateEventDto
  ): Promise<Event> {
    return this.eventService.updateEvent(updateEventDto);
  }

  @Delete()
  deleteEvent(
    @Headers('authorization') headers: string,
    @Body('userId') userId: number,
    @Body('eventId') eventId: number
  ): Promise<void> {
    return this.eventService.deleteEvent(headers, userId, eventId);
  }
}
