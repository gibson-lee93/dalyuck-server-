import { Injectable, NotFoundException } from '@nestjs/common';
import { Calendar } from './calendar.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CalendarRepository } from './calendar.repository';
import { CreateCalendarDto } from './dto/create-calendar.dto';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(CalendarRepository)
    private calendarRepository: CalendarRepository
  ) {}

  async createCalendar(createCalendarDto: CreateCalendarDto): Promise<Calendar> {
    return this.calendarRepository.createCalendar(createCalendarDto);
  }

  async updateCalendar(
    calendarId: number,
    calendarName? : string,
    description? : string,
    colour? : string
  ): Promise<Calendar> {
    return this.calendarRepository.updateCalendar(calendarId, calendarName, description, colour);
  }

  async deleteCalendar(calendarId: number): Promise<void> {
    const result = await this.calendarRepository.delete({ id: calendarId });

    if(result.affected === 0) {
      throw new NotFoundException(`Task with ID "${calendarId}" not found`);
    }
  }
}
