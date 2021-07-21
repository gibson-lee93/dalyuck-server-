import { RequestEmail } from './request-email.entity';
import { EntityRepository, Repository } from 'typeorm';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';

@EntityRepository(RequestEmail)
export class RequestEmailRepository extends Repository<RequestEmail> {

  async subscribeCalendar(requesterEmail: string, requesteeEmail: string): Promise<void> {
    const requestEmail = new RequestEmail();
    requestEmail.requesterEmail = requesterEmail;
    requestEmail.requesteeEmail = requesteeEmail;

    try{
      await requestEmail.save();
    } catch(err) {
      console.log(err);
      throw new InternalServerErrorException('Server error occurred');
    }
  }

  async grantSubscription(
    calendarId: number,
    requesterEmail: string,
    requesteeEmail: string
  ): Promise<RequestEmail> {
    const requestEmail = await this.findOne({ requesteeEmail, requesterEmail });

    if(!requestEmail) {
      throw new NotFoundException('Request has not been made');
    }

    requestEmail.calendarId = calendarId;

    try{
      return await requestEmail.save();
    } catch(err) {
      console.log(err);
      throw new InternalServerErrorException('Server error occurred');
    }
  }
}
