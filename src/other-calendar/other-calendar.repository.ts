import { OtherCalendar } from './other-calendar.entity';
import { EntityRepository, Repository, getConnection } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { UpdateOtherCalendarDto } from './dto/update-other-calendar.dto';
import { OtherEvent } from '../other-event/other-event.entity';
import {
  addTriggerAfterInsertEvent,
  addTriggerAfterUpdateEvent,
  addTriggerAfterDeleteEvent,
  insertIntoOtherCalendar,
  insertIntoOtherEvent,
  addTriggerAfterUpdateOtherCalendar
} from '../function/query/queryFunctions';

@EntityRepository(OtherCalendar)
export class OtherCalendarRepository extends Repository<OtherCalendar> {

  async confirmSubscription(calendarId: number, userId: number): Promise<OtherCalendar> {
    try{
      const copyCalendar = await this.query(insertIntoOtherCalendar(userId, calendarId));
      const otherCalendar = await this.findOne({ id: copyCalendar.insertId });

      await this.query(insertIntoOtherEvent(otherCalendar.colour, otherCalendar.id, calendarId));
      await this.query(addTriggerAfterInsertEvent(userId, otherCalendar.id, calendarId, otherCalendar.colour));
      await this.query(addTriggerAfterUpdateEvent(userId, otherCalendar.id, calendarId));
      await this.query(addTriggerAfterDeleteEvent(userId, otherCalendar.id, calendarId));
      await this.query(addTriggerAfterUpdateOtherCalendar(userId, otherCalendar.id));

      return await this.findOne({ id: copyCalendar.insertId });;

    } catch(err) {
      console.log(err);
      throw new InternalServerErrorException('Server error occurred');
    }
  }

  async updateOtherCalendar(updateOtherCalendarDto: UpdateOtherCalendarDto): Promise<OtherCalendar> {
    const{ otherCalendarId, colour, calendarName } = updateOtherCalendarDto;

    const otherCalendar = await this.findOne({ id: otherCalendarId });
    otherCalendar.calendarName = calendarName ? calendarName : otherCalendar.calendarName;
    otherCalendar.colour = colour ? colour : otherCalendar.colour;

    try{
      await otherCalendar.save();
      return await this.findOne({ id: otherCalendarId });
    } catch(err) {
      console.log(err);
      throw new InternalServerErrorException('Server error occurred');
    }
  }
}
