import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { EventRepository } from './event.repository';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { checkToken } from '../function/token/createToken';
import { User } from '../user/user.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(EventRepository)
    private eventRepository: EventRepository
  ) {}

  async getAttendEvent(headers: string, userId: number): Promise<Event[]> {
    const token = headers.split(" ")[1];
    const checkHeaderToken = await checkToken(token, userId);

    if(checkHeaderToken.error){
      throw new UnauthorizedException(checkHeaderToken.message);
    }

    const user = await User.findOne({ id: userId });
    return user.attendEvents;
  }

  async getEvents(
    calendarId: number
  ): Promise<Event[]> {
    return await this.eventRepository.find({ calendarId });
  }

  async createEvent(
    createEventDto: CreateEventDto,
  ): Promise<Event> {
    return this.eventRepository.createEvent(createEventDto);
  }

  async updateEvent(
    updateEventDto: UpdateEventDto
  ): Promise<Event> {
    return this.eventRepository.updateEvent(updateEventDto);
  }

  async deleteEvent(
    eventId: number
  ): Promise<void> {
    const result = await this.eventRepository.delete({ id: eventId });

    if(result.affected === 0) {
      throw new NotFoundException(`Event with ID "${eventId}" not found`);
    }
  }
}
