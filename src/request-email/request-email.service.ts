import { Injectable, NotFoundException, UnauthorizedException, InternalServerErrorException, Inject } from '@nestjs/common';
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
    headers: string,
    userId: number,
    subscribeCalendarDto: SubscribeCalendarDto
  ): Promise<OtherCalendar> {
    const token = headers.split(" ")[1];
    const checkHeaderToken = await checkToken(token, userId);

    if(checkHeaderToken.error){
      throw new UnauthorizedException(checkHeaderToken.message);
    }

    const { requesterEmail, requesteeEmail } = subscribeCalendarDto;

    const user = await User.findOne({ email: requesteeEmail });
    const calendar = await Calendar.findOne({ userId: user.id });

    if(!user) {
      throw new NotFoundException(`${requesteeEmail} has no dalyuck account`);
    }

    try{
      await this
        .mailerService
        .sendMail({
          to: requesteeEmail,
          subject: 'You have a calendar subscrition request',
          template: './subscriptionRequest',
          context: {
            requestee: requesteeEmail,
            requester: requesterEmail,
            url: 'dalyuck.com'
          }
      });
    } catch(err) {
      console.log(err);
      throw new InternalServerErrorException('Server error occurred');
    }

    await this.requestEmailRepository.subscribeCalendar(requesterEmail, requesteeEmail);
    return await this.grantSubscription(headers, userId, { calendarId: calendar.id, requesterEmail, requesteeEmail });
  }

  async grantSubscription(
    headers: string,
    userId: number,
    grantSubscriptionDto: GrantSubscriptionDto
  ): Promise<OtherCalendar> {
    const token = headers.split(" ")[1];
    const checkHeaderToken = await checkToken(token, userId);

    if(checkHeaderToken.error){
      throw new UnauthorizedException(checkHeaderToken.message);
    }

    const { calendarId, requesterEmail, requesteeEmail } = grantSubscriptionDto;

    try{
      await this
        .mailerService
        .sendMail({
          to: requesterEmail,
          subject: 'Your subscrition request has been granted',
          template: './subscriptionGranted',
          context: {
            requester: requesterEmail,
            requestee: requesteeEmail,
            url: 'dalyuck.com'
          }
      })
    } catch(err) {
      console.log(err);
      throw new InternalServerErrorException('Server error occurred');
    }

    const requestEamil = await this.requestEmailRepository.grantSubscription(calendarId, requesterEmail, requesteeEmail);
    return await this.otherCalendarService.confirmSubscription(headers, userId, requestEamil.id);
  }
}
