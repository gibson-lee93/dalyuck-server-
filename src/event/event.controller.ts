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
  getEvent(
    @Headers('authorization') headers: string,
    @Param('id', ParseIntPipe) userId: number,
    @Query('calendarId', ParseIntPipe) calendarId: number
  ): Promise<Event[]> {
    return this.eventService.getEvent(headers, userId, calendarId);
  }

  @Post()
  createEvent(
    @Headers('authorization') headers: string,
    @Body('userId') userId: number,
    @Body() createEventDto: CreateEventDto
  ): Promise<Event> {
    return this.eventService.createEvent(headers, userId, createEventDto);
  }

  @Patch()
  updateEvent(
    @Headers('authorization') headers: string,
    @Body('userId') userId: number,
    @Body() updateEventDto: UpdateEventDto
  ): Promise<Event> {
    return this.eventService.updateEvent(headers, userId, updateEventDto);
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
