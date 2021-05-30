import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationRepository } from './notification.repository';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { checkToken } from '../function/token/createToken';
import { MailerService } from '@nestjs-modules/mailer';
import { DateTime } from 'luxon';
import { User } from '../user/user.entity';
import { Event } from '../event/event.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationRepository)
    private notificationRepository: NotificationRepository,
    private mailerService: MailerService
  ) {}

  async createNotification(
    headers: string,
    userId: number,
    createNotificationDto: CreateNotificationDto
  ): Promise<void> {
    const token = headers.split(" ")[1];
    const checkHeaderToken = await checkToken(token, userId);

    if(checkHeaderToken.error){
      throw new UnauthorizedException(checkHeaderToken.message);
    }

    const { eventId, alarm } = createNotificationDto;
    const user = await User.findOne({ id: userId });
    const event = await Event.findOne({ id: eventId });

    this.notificationRepository.createNotification(eventId, alarm);

    const now = DateTime.now();
    const diff = now.diff(DateTime.fromSQL(alarm)).as('milliseconds') * -1;

    const util = require('util');
    const setTimeoutPromise = util.promisify(setTimeout);

    setTimeoutPromise(diff).then(() => {
      this.mailerService
      .sendMail({
        to: user.email,
        subject: 'You have a notification for an event',
        template: './sendNotification',
        context: {
          eventName: event.eventName,
          startTime: event.startTime,
          endTime: event.endTime
        }
      });
    });
  }
}
