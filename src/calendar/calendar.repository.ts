import { Calendar } from './calendar.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { InternalServerErrorException } from '@nestjs/common';

@EntityRepository(Calendar)
export class CalendarRepository extends Repository<Calendar> {

  async createCalendar(
    createCalendarDto: CreateCalendarDto
  ): Promise<Calendar> {
    const { calendarName, description } = createCalendarDto;

    const calendar = new Calendar();
    calendar.calendarName = calendarName;
    calendar.description = description;

    try {
      await calendar.save();
    } catch(err) {
      throw new InternalServerErrorException('Server error occurred');
    }

    return calendar;
  }
}
