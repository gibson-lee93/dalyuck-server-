import { AttendRequest } from './attend-request.entity';
import { EntityRepository, Repository } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';

@EntityRepository(AttendRequest)
export class AttendRequestRepository extends Repository<AttendRequest> {

  async sendAttendRequest(
    requesterEmail: string,
    requesteeEmail: string,
    eventId: number
  ): Promise<void> {
    const attendRequest = new AttendRequest();
    attendRequest.requesterEmail = requesterEmail;
    attendRequest.requesteeEmail = requesteeEmail;
    attendRequest.eventId = eventId;

    try{
      await attendRequest.save();
    } catch(err) {
      console.log(err);
      throw new InternalServerErrorException('Server error occurred');
    }
  }
}
