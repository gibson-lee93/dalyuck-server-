import { Controller, Post, Body, Patch, Delete, Headers } from '@nestjs/common';
import { Event } from './event.entity';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Controller('event')
export class EventController {
  constructor(private eventService: EventService) {}

  @Post()
  createEvent(
    @Body() createEventDto: CreateEventDto,
    @Body('userId') userId: number,
    @Headers('authorization') headers: string
  ): Promise<Event> {
    return this.eventService.createEvent(createEventDto, userId, headers);
  }

  @Patch()
  updateEvent(
    @Body() updateEventDto: UpdateEventDto,
    @Body('userId') userId: number,
    @Headers('authorization') headers: string
  ): Promise<Event> {
    return this.eventService.updateEvent(updateEventDto, userId, headers);
  }

  @Delete()
  deleteEvent(
    @Body('eventId') eventId: number,
    @Body('userId') userId: number,
    @Headers('authorization') headers: string
  ): Promise<void> {
    return this.eventService.deleteEvent(eventId, userId, headers);
  }
}
