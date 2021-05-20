import { Injectable, NotFoundException, Headers, UnauthorizedException } from '@nestjs/common';
import { Calendar } from './calendar.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CalendarRepository } from './calendar.repository';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { checkToken } from '../function/token/createToken';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(CalendarRepository)
    private calendarRepository: CalendarRepository
  ) {}

  async createCalendar(
    createCalendarDto: CreateCalendarDto,
    userId: number,
    headers: any
  ): Promise<Calendar> {
    const token = headers.authorization.split(" ")[1];
    const checkHeaderToken = await checkToken(token, userId);

    if(checkHeaderToken.error){
      throw new UnauthorizedException(checkHeaderToken.message);
    }

    return this.calendarRepository.createCalendar(createCalendarDto, userId);
  }

  async updateCalendar(
    userId: number,
    headers: any,
    calendarId: number,
    calendarName? : string,
    description? : string,
    colour? : string
  ): Promise<Calendar> {
    const token = headers.authorization.split(" ")[1];
    const checkHeaderToken = await checkToken(token, userId);

    if(checkHeaderToken.error){
      throw new UnauthorizedException(checkHeaderToken.message);
    }

    return this.calendarRepository.updateCalendar(userId, calendarId, calendarName, description, colour);
  }

  async deleteCalendar(
    headers: any,
    userId: number,
    calendarId: number
  ): Promise<void> {
    const token = headers.authorization.split(" ")[1];
    const checkHeaderToken = await checkToken(token, userId);

    if(checkHeaderToken.error){
      throw new UnauthorizedException(checkHeaderToken.message);
    }
    
    const result = await this.calendarRepository.delete({ id: calendarId });

    if(result.affected === 0) {
      throw new NotFoundException(`Task with ID "${calendarId}" not found`);
    }
  }
}
