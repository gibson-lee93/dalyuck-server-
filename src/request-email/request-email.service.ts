import { Injectable,
  NotFoundException,
  UnauthorizedException,
  InternalServerErrorException,
  Inject
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestEmailRepository } from './request-email.repository';
import { checkToken } from '../function/token/createToken';
import { User } from '../user/user.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { SubscribeCalendarDto } from './dto/subscribe-calendar.dto';
import { GrantSubscriptionDto } from './dto/grant-subscription.dto';
import { Calendar } from '../calendar/calendar.entity';
import { OtherCalendarService } from '../other-calendar/other-calendar.service';
import { OtherCalendar } from '../other-calendar/other-calendar.entity';

@Injectable()
export class RequestEmailService {
  constructor(
    @InjectRepository(RequestEmailRepository)
    private requestEmailRepository: RequestEmailRepository,
    private mailerService: MailerService,
    @Inject(OtherCalendarService)
    private otherCalendarService: OtherCalendarService
  ) {}

  async subscribeCalendar(
    subscribeCalendarDto: SubscribeCalendarDto,
    user: User
  ): Promise<OtherCalendar> {
    const { requesterEmail, requesteeEmail } = subscribeCalendarDto;
    const calendar = await Calendar.findOne({ userId: user.id });

    try{
      await this.sendEmail(requesteeEmail, requesterEmail,
        'You have a calendar subscrition request', './subscriptionRequest');
    } catch(err) {
      console.log(err);
      throw new InternalServerErrorException('Server error occurred');
    }

    await this.requestEmailRepository.subscribeCalendar(requesterEmail, requesteeEmail);
    return await this.grantSubscription({ calendarId: calendar.id, requesterEmail, requesteeEmail }, user);
  }

  async grantSubscription(
    grantSubscriptionDto: GrantSubscriptionDto,
    user: User
  ): Promise<OtherCalendar> {
    const { calendarId, requesterEmail, requesteeEmail } = grantSubscriptionDto;

    try{
      await this.sendEmail(requesteeEmail, requesterEmail,
        'Your subscrition request has been granted', './subscriptionGranted');
    } catch(err) {
      console.log(err);
      throw new InternalServerErrorException('Server error occurred');
    }

    const requestEamil = await this.requestEmailRepository.grantSubscription(calendarId, requesterEmail, requesteeEmail);
    return await this.otherCalendarService.confirmSubscription(requestEamil.id, user);
  }

  async sendEmail(
    requesteeEmail: string,
    requesterEmail: string,
    subject: string,
    template: string
  ): Promise<void> {
    await this
      .mailerService
      .sendMail({
        to: requesterEmail,
        subject: subject,
        template: template,
        context: {
          requestee: requesteeEmail,
          requester: requesterEmail,
          url: 'dalyuck.com'
        }
    });
  }
}
