import { AttendRequest } from './attend-request.entity';
import { EntityRepository, Repository } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { SendAttendRequestDto } from './dto/send-attend-request.dto';

@EntityRepository(AttendRequest)
export class AttendRequestRepository extends Repository<AttendRequest> {

  async sendAttendRequest(
    sendAttendRequestDto: SendAttendRequestDto
  ): Promise<AttendRequest> {
    const { requesterEmail, requesteeEmail, eventId } = sendAttendRequestDto;
    
    const attendRequest = new AttendRequest();
    attendRequest.requesterEmail = requesterEmail;
    attendRequest.requesteeEmail = requesteeEmail;
    attendRequest.eventId = eventId;

    try{
      return await attendRequest.save();
    } catch(err) {
      console.log(err);
      throw new InternalServerErrorException('Server error occurred');
    }
  }
}
