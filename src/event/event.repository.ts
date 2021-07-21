import { Event } from './event.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';


@EntityRepository(Event)
export class EventRepository extends Repository<Event> {

  async createEvent(createEventDto: CreateEventDto): Promise<Event> {
    const {
      calendarId, startTime, endTime,
      eventName, description, access,
      location, colour
    } = createEventDto;

    const event = new Event();
    event.calendarId = calendarId;
    event.startTime = startTime;
    event.endTime = endTime;
    event.eventName = eventName;
    event.description = description;
    event.access = access;
    event.location = location;
    event.colour = colour;

    try{
      await event.save();
    } catch(err) {
      console.log(err);
      throw new InternalServerErrorException('Server error occurred');
    }

    return event;
  }

  async updateEvent(userId: number,updateEventDto: UpdateEventDto): Promise<Event> {
    const {
      calendarId, startTime, endTime,
      eventName, description, access,
      location, colour, eventId
    } = updateEventDto;

    const event = await this.findOne({ id: eventId });
    if(!event) {
      throw new NotFoundException('Cannot find event');
    }

    event.calendarId = calendarId ? calendarId : event.calendarId;
    event.eventName = eventName ? eventName : event.eventName;
    event.description = description ? description : event.description;
    event.startTime = startTime ? startTime : event.startTime;
    event.endTime = endTime ? endTime : event.endTime;
    event.location = location ? location : event.location;
    event.colour = colour ? colour : event.colour;
    event.access = access ? access : event.access;

    try{
      await event.save();
    } catch(err) {
      console.log(err);
      throw new InternalServerErrorException('Server error occurred');
    }

    return event;
  }
}
