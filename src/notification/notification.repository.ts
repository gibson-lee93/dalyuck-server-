import { Notification } from './notification.entity';
import { EntityRepository, Repository } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';

@EntityRepository(Notification)
export class NotificationRepository extends Repository<Notification> {

  async createNotification(
    eventId: number,
    alarm: string
  ): Promise<Notification> {
    const notification = new Notification();
    notification.eventId = eventId;
    notification.alarm = alarm;

    try{
      return await notification.save();
    } catch(err) {
      console.log(err);
      throw new InternalServerErrorException('Server error occurred');
    }
  }
}
