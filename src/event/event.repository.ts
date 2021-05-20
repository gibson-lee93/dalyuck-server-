import { Event } from './event.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { InternalServerErrorException } from '@nestjs/common';

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
}
