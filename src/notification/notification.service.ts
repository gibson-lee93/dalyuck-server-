import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationRepository } from './notification.repository';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { checkToken } from '../function/token/createToken';
import { MailerService } from '@nestjs-modules/mailer';
import { DateTime } from 'luxon';
import { User } from '../user/user.entity';
import { Event } from '../event/event.entity';
import { UpdateNotificationDto } from './dto/update-notification.dto';

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
    const notification = await this.notificationRepository.createNotification(eventId, alarm);

    const now = DateTime.now();
    const diff = now.diff(DateTime.fromSQL(alarm)).as('milliseconds') * -1;
    if(diff < 1) {
      return;
    }

    const user = await User.findOne({ id: userId });
    this.sendEmail(eventId, diff, user.email, notification.id);
  }

  async updateNotification(
    headers: string,
    userId: number,
    updateNotificationDto: UpdateNotificationDto
  ): Promise<void> {
    const token = headers.split(" ")[1];
    const checkHeaderToken = await checkToken(token, userId);

    if(checkHeaderToken.error){
      throw new UnauthorizedException(checkHeaderToken.message);
    }

    const { notificationId, alarm } = updateNotificationDto;
    const notification = await this.notificationRepository.findOne({ id: notificationId });
    const eventId = notification.eventId;

    try{
      await this.notificationRepository.delete({ id: notificationId });
      this.createNotification(headers, userId, { eventId, alarm });
    } catch(err) {
      console.log(err);
      throw new InternalServerErrorException('Server error occurred');
    }
  }

  async sendEmail(
    eventId: number,
    alarm: number,
    email: string,
    notificationId: number
  ): Promise<void> {
    const event = await Event.findOne({ id: eventId });

    const util = require('util');
    const setTimeoutPromise = util.promisify(setTimeout);

    setTimeoutPromise(alarm)
    .then(() => {
      this.notificationRepository.findOne({ id: notificationId })
      .then((result) => {
        if(!result) {
          return;
        }
        this.mailerService
        .sendMail({
          to: email,
          subject: 'You have a notification for an event',
          template: './sendNotification',
          context: {
            eventName: event.eventName,
            startTime: event.startTime,
            endTime: event.endTime
          }
        });
      })
    });
  }
}
