import { RequestEmail } from './request-email.entity';
import { EntityRepository, Repository } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';

@EntityRepository(RequestEmail)
export class RequestEmailRepository extends Repository<RequestEmail> {

  async subscribeCalendar(userId: number, id: number): Promise<void> {
    const requestEmail = new RequestEmail();
    requestEmail.requestId = userId;
    requestEmail.respondId = id;

    try{
      await requestEmail.save();
    } catch(err) {
      console.log(err);
      throw new InternalServerErrorException('Server error occurred');
    }
  }
}
