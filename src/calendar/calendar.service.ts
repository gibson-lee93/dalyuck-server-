import { Injectable, NotFoundException } from '@nestjs/common';
import { Calendar } from './calendar.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CalendarRepository } from './calendar.repository';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { UpdateCalendarDto } from './dto/update-calendar.dto';
import { OtherCalendar } from '../other-calendar/other-calendar.entity';
import { User } from '../user/user.entity';
import { searchCalendar, searchOtherCalendar, searchAttendEvent } from '../function/query/queryFunctions';
import { DateTime } from 'luxon';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(CalendarRepository)
    private calendarRepository: CalendarRepository
  ) {}

  async searchCalendar(
    keyword: string,
    user: User
  ): Promise<{ event:[], message: string }> {
    const userId = user.id;
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
    user: User
  ): Promise<{ calendar: {}, otherCalendars: {} }> {
    const result = { calendar: {}, otherCalendars: {} };
    result.calendar = await this.calendarRepository.find({ userId: user.id });
    result.otherCalendars = await OtherCalendar.find({ userId: user.id });
    return result;
  }

  async createCalendar(
    createCalendarDto: CreateCalendarDto,
    user: User
  ): Promise<Calendar> {
    return this.calendarRepository.createCalendar(user.id, createCalendarDto );
  }

  async updateCalendar(
    updateCalendarDto: UpdateCalendarDto,
    user: User
  ): Promise<Calendar> {
    return this.calendarRepository.updateCalendar(user.id, updateCalendarDto);
  }

  async deleteCalendar(
    calendarId: number
  ): Promise<void> {
    const result = await this.calendarRepository.delete({ id: calendarId });

    if(result.affected === 0) {
      throw new NotFoundException(`Calendar with ID "${calendarId}" not found`);
    }
  }
}
