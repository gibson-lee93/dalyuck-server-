import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Calendar } from './calendar.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CalendarRepository } from './calendar.repository';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { UpdateCalendarDto } from './dto/update-calendar.dto';
import { checkToken } from '../function/token/createToken';
import { OtherCalendar } from '../other-calendar/other-calendar.entity';
import { searchCalendar, searchOtherCalendar, searchAttendEvent } from '../function/query/queryFunctions';
import { DateTime } from 'luxon';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(CalendarRepository)
    private calendarRepository: CalendarRepository
  ) {}

  async searchCalendar(
    headers: string,
    userId: number,
    keyword: string
  ): Promise<{ event:[], message: string }> {
    const token = headers.split(" ")[1];
    const checkHeaderToken = await checkToken(token, userId);

    if(checkHeaderToken.error){
      throw new UnauthorizedException(checkHeaderToken.message);
    }

    const event = await this.calendarRepository.query(searchCalendar(userId, keyword));
    const otherEvent = await this.calendarRepository.query(searchOtherCalendar(userId, keyword));
    const attendEvent = await this.calendarRepository.query(searchAttendEvent(userId, keyword));
    event.push(...otherEvent, ...attendEvent);
    event.sort((a: DateTime, b: DateTime) => {
      return DateTime.fromISO(a.startTime) - DateTime.fromISO(b.startTime);
    })

    return {
      event,
      message: `Search result with keyword: ${keyword}`
    };
  }

  async getCalendar(
    headers: string,
    userId: number
  ): Promise<{ calendar: {}, otherCalendars: {} }> {
    const token = headers.split(" ")[1];
    const checkHeaderToken = await checkToken(token, userId);

    if(checkHeaderToken.error){
      throw new UnauthorizedException(checkHeaderToken.message);
    }

    const result = { calendar: {}, otherCalendars: {} };
    result.calendar = await this.calendarRepository.find({ userId });
    result.otherCalendars = await OtherCalendar.find({ userId });
    return result;
  }

  async createCalendar(
    createCalendarDto: CreateCalendarDto,
    userId: number,
    headers: string
  ): Promise<Calendar> {
    const token = headers.split(" ")[1];
    const checkHeaderToken = await checkToken(token, userId);

    if(checkHeaderToken.error){
      throw new UnauthorizedException(checkHeaderToken.message);
    }

    return this.calendarRepository.createCalendar(userId, createCalendarDto );
  }

  async updateCalendar(
    userId: number,
    headers: string,
    updateCalendarDto: UpdateCalendarDto
  ): Promise<Calendar> {
    const token = headers.split(" ")[1];
    const checkHeaderToken = await checkToken(token, userId);

    if(checkHeaderToken.error){
      throw new UnauthorizedException(checkHeaderToken.message);
    }

    return this.calendarRepository.updateCalendar(userId, updateCalendarDto);
  }

  async deleteCalendar(
    headers: string,
    userId: number,
    calendarId: number
  ): Promise<void> {
    const token = headers.split(" ")[1];
    const checkHeaderToken = await checkToken(token, userId);

    if(checkHeaderToken.error){
      throw new UnauthorizedException(checkHeaderToken.message);
    }

    const result = await this.calendarRepository.delete({ id: calendarId });

    if(result.affected === 0) {
      throw new NotFoundException(`Calendar with ID "${calendarId}" not found`);
    }
  }
}
