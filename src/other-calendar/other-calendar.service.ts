import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OtherCalendarRepository } from './other-calendar.repository';
import { OtherCalendar } from './other-calendar.entity';
import { checkToken } from '../function/token/createToken';
import { RequestEmail } from '../request-email/request-email.entity';

@Injectable()
export class OtherCalendarService {
  constructor(
    @InjectRepository(OtherCalendarRepository)
    private otherCalendarRepository: OtherCalendarRepository
  ) {}

  async confirmSubscription(
    headers: string,
    userId: number,
    requestEmailId: number
  ): Promise<OtherCalendar> {
    const token = headers.split(" ")[1];
    const checkHeaderToken = await checkToken(token, userId);

    if(checkHeaderToken.error){
      throw new UnauthorizedException(checkHeaderToken.message);
    }

    const requestEmail = await RequestEmail.findOne({ id: requestEmailId});

    try{
      const otherCalendar = await this.otherCalendarRepository.confirmSubscription(requestEmail.calendarId, userId);
      await RequestEmail.delete({ id: requestEmailId });
      return otherCalendar;
    } catch(err) {
      console.log(err);
      throw new InternalServerErrorException('Server error occurred');
    }
  }
}
