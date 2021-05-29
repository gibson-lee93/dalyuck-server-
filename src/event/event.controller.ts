import {
  Controller,
  Post,
  Body,
  Patch,
  Delete,
  Headers,
  Get,
  ParseIntPipe,
  Param,
  Query } from '@nestjs/common';
import { Event } from './event.entity';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Controller('event')
export class EventController {
  constructor(private eventService: EventService) {}

  @Get('/:id')
  getCalendar(
    @Headers('authorization') headers: string,
    @Param('id', ParseIntPipe) userId: number,
    @Query('calendarId', ParseIntPipe) calendarId: number
  ): Promise<Event[]> {
    return this.eventService.getEvent(headers, userId, calendarId);
  }

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
