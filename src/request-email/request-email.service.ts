import { Injectable, NotFoundException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestEmailRepository } from './request-email.repository';
import { checkToken } from '../function/token/createToken';
import { User } from '../user/user.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { SubscribeCalendarDto } from './dto/subscribe-calendar.dto';

@Injectable()
export class RequestEmailService {
  constructor(
    @InjectRepository(RequestEmailRepository)
    private requestEmailRepository: RequestEmailRepository,
    private mailerService: MailerService
  ) {}



  async subscribeCalendar(
    headers: string,
    userId: number,
    subscribeCalendarDto: SubscribeCalendarDto
  ): Promise<void> {
    const token = headers.split(" ")[1];
    const checkHeaderToken = await checkToken(token, userId);

    if(checkHeaderToken.error){
      throw new UnauthorizedException(checkHeaderToken.message);
    }

    const { requesterEmail, requesteeEmail } = subscribeCalendarDto;

    const user = await User.findOne({ email: requesteeEmail });

    if(!user) {
      throw new NotFoundException(`${requesteeEmail} has no dalyuck account`);
    }

    try{
      await this
        .mailerService
        .sendMail({
          to: requesteeEmail,
          subject: 'You have a calendar subscrition request',
          text: 'test',
          html: '<b>testing</b>'
          // template: './subscriptionRequest',
          // context: {
          //   name: requesterEmail,
          //   requester: requesterEmail,
          //   url: 'dalyuck.com'
          // }
      })
    } catch(err) {
      console.log(err);
      throw new InternalServerErrorException('Server error occurred');
    }

    this.requestEmailRepository.subscribeCalendar(userId, user.id);
  }
}
