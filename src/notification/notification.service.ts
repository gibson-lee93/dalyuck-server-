import { Injectable,
  UnauthorizedException,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationRepository } from './notification.repository';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { checkToken } from '../function/token/createToken';
import { MailerService } from '@nestjs-modules/mailer';
import { DateTime } from 'luxon';
import { User } from '../user/user.entity';
import { Event } from '../event/event.entity';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from './notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationRepository)
    private notificationRepository: NotificationRepository,
    private mailerService: MailerService
  ) {}

  async getNotification(
    headers: string,
    userId: number,
    eventId: number
  ): Promise<Notification[]> {
    const token = headers.split(" ")[1];
    const checkHeaderToken = await checkToken(token, userId);

    if(checkHeaderToken.error){
      throw new UnauthorizedException(checkHeaderToken.message);
    }

    return await this.notificationRepository.find({ eventId });
  }

  async createNotification(
    headers: string,
    userId: number,
    createNotificationDto: CreateNotificationDto,
    notificationId?: number
  ): Promise<Notification> {
    const token = headers.split(" ")[1];
    const checkHeaderToken = await checkToken(token, userId);

    if(checkHeaderToken.error){
      throw new UnauthorizedException(checkHeaderToken.message);
    }

    const { eventId, alarm } = createNotificationDto;
    const notification = await this.notificationRepository.createNotification(eventId, alarm, notificationId);

    const diff = DateTime.now().diff(DateTime.fromISO(alarm)).as('milliseconds') * -1;
    if(diff >= 0) {
      const user = await User.findOne({ id: userId });
      this.sendEmail(eventId, diff, user.email, notification.id);
    }

    return notification;
  }

  async updateNotification(
    headers: string,
    userId: number,
    updateNotificationDto: UpdateNotificationDto
  ): Promise<Notification> {
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
      return await this.createNotification(headers, userId, { eventId, alarm }, notificationId);
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
      });
    });
  }

  async deleteNotification(
    headers: string,
    userId: number,
    notificationId: number
  ): Promise<void> {
    const token = headers.split(" ")[1];
    const checkHeaderToken = await checkToken(token, userId);

    if(checkHeaderToken.error){
      throw new UnauthorizedException(checkHeaderToken.message);
    }

    const result = await this.notificationRepository.delete({ id: notificationId });
    if(result.affected === 0) {
      throw new NotFoundException(`Notification with ID "${notificationId}" not found`);
    }
  }
}
