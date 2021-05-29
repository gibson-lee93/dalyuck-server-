import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { EventRepository } from './event.repository';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { checkToken } from '../function/token/createToken';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(EventRepository)
    private eventRepository: EventRepository
  ) {}

  async getEvent(
    headers: string,
    userId: number,
    calendarId: number
  ): Promise<Event[]> {
    const token = headers.split(" ")[1];
    const checkHeaderToken = await checkToken(token, userId);

    if(checkHeaderToken.error){
      throw new UnauthorizedException(checkHeaderToken.message);
    }

    const result = await this.eventRepository.find({ calendarId });

    if(result.length === 0) {
      throw new NotFoundException(`Event not found`);
    }

    return result;
  }

  async createEvent(
    createEventDto: CreateEventDto,
    userId: number,
    headers: string
  ): Promise<Event> {
    const token = headers.split(" ")[1];
    const checkHeaderToken = await checkToken(token, userId);

    if(checkHeaderToken.error){
      throw new UnauthorizedException(checkHeaderToken.message);
    }

    return this.eventRepository.createEvent(createEventDto);
  }

  async updateEvent(
    updateEventDto: UpdateEventDto,
    userId: number,
    headers: string
  ): Promise<Event> {
    const token = headers.split(" ")[1];
    const checkHeaderToken = await checkToken(token, userId);

    if(checkHeaderToken.error){
      throw new UnauthorizedException(checkHeaderToken.message);
    }

    return this.eventRepository.updateEvent(updateEventDto);
  }

  async deleteEvent(
    eventId: number,
    userId: number,
    headers: string
  ): Promise<void> {
    const token = headers.split(" ")[1];
    const checkHeaderToken = await checkToken(token, userId);

    if(checkHeaderToken.error){
      throw new UnauthorizedException(checkHeaderToken.message);
    }

    const result = await this.eventRepository.delete({ id: eventId });

    if(result.affected === 0) {
      throw new NotFoundException(`Event with ID "${eventId}" not found`)
    }
  }
}
