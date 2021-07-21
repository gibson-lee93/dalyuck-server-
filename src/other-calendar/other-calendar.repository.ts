import { OtherCalendar } from './other-calendar.entity';
import { EntityRepository, Repository } from 'typeorm';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UpdateOtherCalendarDto } from './dto/update-other-calendar.dto';
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

  async deleteOtherCalendar(userId: number, otherCalendarId: number): Promise<void> {
    const result = await this.delete({ id: otherCalendarId });

    if(result.affected === 0) {
      if(result.affected === 0) {
        throw new NotFoundException(`Other calendar with ID "${otherCalendarId}" not found`);
      }
    }

    try{
      await this.query(`DROP TRIGGER after_event_insert_${userId}_${otherCalendarId}`);
      await this.query(`DROP TRIGGER after_event_update_${userId}_${otherCalendarId}`);
      await this.query(`DROP TRIGGER after_event_delete_${userId}_${otherCalendarId}`);
      await this.query(`DROP TRIGGER after_other_calendar_update_${userId}_${otherCalendarId}`);
    } catch(err) {
      console.log(err);
      throw new InternalServerErrorException('Server error occurred');
    }
  }
}
