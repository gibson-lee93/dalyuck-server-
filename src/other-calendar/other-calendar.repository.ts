import { OtherCalendar } from './other-calendar.entity';
import { EntityRepository, Repository } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import {
  addTriggerAfterInsertEvent,
  addTriggerAfterUpdateEvent,
  addTriggerAfterDeleteEvent,
  insertIntoOtherCalendar,
  insertIntoOtherEvent
} from '../function/query/queryFunctions';

@EntityRepository(OtherCalendar)
export class OtherCalendarRepository extends Repository<OtherCalendar> {

  async confirmSubscription(calendarId: number, userId: number): Promise<OtherCalendar> {
    console.log(calendarId);

    try{
      const copyCalendar = await this.query(insertIntoOtherCalendar(userId, calendarId));
      const otherCalendar = await this.findOne({ id: copyCalendar.insertId });

      await this.query(insertIntoOtherEvent(otherCalendar.colour, otherCalendar.id, calendarId));
      await this.query(addTriggerAfterInsertEvent(userId, otherCalendar.id, calendarId, otherCalendar.colour));
      await this.query(addTriggerAfterUpdateEvent(userId, otherCalendar.id, calendarId));
      await this.query(addTriggerAfterDeleteEvent(userId, otherCalendar.id, calendarId));

      return await this.findOne({ id: copyCalendar.insertId });;

    } catch(err) {
      console.log(err);
      throw new InternalServerErrorException('Server error occurred');
    }
  }
}
