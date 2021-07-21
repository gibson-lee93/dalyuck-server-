import { Calendar } from './calendar.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { UpdateCalendarDto } from './dto/update-calendar.dto';
import { InternalServerErrorException } from '@nestjs/common';

@EntityRepository(Calendar)
export class CalendarRepository extends Repository<Calendar> {

  async createCalendar(
    userId: number,
    createCalendarDto: CreateCalendarDto
  ): Promise<Calendar> {
    const { calendarName, description } = createCalendarDto;

    const calendar = new Calendar();
    calendar.calendarName = calendarName;
    calendar.description = description;
    calendar.userId = userId;

    try {
      await calendar.save();
    } catch(err) {
      throw new InternalServerErrorException('Server error occurred');
    }

    return calendar;
  }

  async updateCalendar(
    userId: number,
    updateCalendarDto: UpdateCalendarDto
  ): Promise<Calendar> {
    const { calendarId, calendarName, description, colour } = updateCalendarDto;
    const calendar = await this.findOne({ id: calendarId});
    calendar.calendarName = calendarName ? calendarName : calendar.calendarName;
    calendar.description = description ? description : calendar.description;
    calendar.colour = colour ? colour : calendar.colour;
    calendar.userId = userId;

    try{
      await calendar.save();
    } catch(err) {
      throw new InternalServerErrorException('Server error occurred');
    }

    return calendar;
  }
}
