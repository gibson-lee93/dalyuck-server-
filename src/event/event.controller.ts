import {
  Get,
  Controller,
  Post,
  Body,
  Patch,
  Delete,
  ParseIntPipe,
  Param,
  Inject,
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
    @Body() sendAttendRequestDto: SendAttendRequestDto
  ): Promise<void> {
    return this.attendRequestService.sendAttendRequest(sendAttendRequestDto);
  }

  @Get('/attendant')
  getAttendEvent(@GetUser() user: User): Promise<Event[]> {
    return this.eventService.getAttendEvent(user.id);
  }

  @Get('/:id')
  getEvents(
    @Param('id', ParseIntPipe) calendarId: number
  ): Promise<Event[]> {
    return this.eventService.getEvents(calendarId);
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
    @Body('eventId') eventId: number
  ): Promise<void> {
    return this.eventService.deleteEvent(eventId);
  }
}
