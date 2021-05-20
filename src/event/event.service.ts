import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { EventRepository } from './event.repository';
import { CreateEventDto } from './dto/create-event.dto';
import { checkToken } from '../function/token/createToken';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(EventRepository)
    private eventRepository: EventRepository
  ) {}

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
}
