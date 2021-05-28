import { Injectable, UnauthorizedException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AttendRequestRepository } from './attend-request.repository';
import { checkToken } from '../function/token/createToken';
import { MailerService } from '@nestjs-modules/mailer';
import { SendAttendRequestDto } from './dto/send-attend-request.dto';
import { User } from '../user/user.entity';
import { Event } from '../event/event.entity';

@Injectable()
export class AttendRequestService {
  constructor(
    @InjectRepository(AttendRequestRepository)
    private attendRequestRepository: AttendRequestRepository,
    private mailerService: MailerService
  ) {}

  async sendAttendRequest(
    headers: string,
    userId: number,
    sendAttendRequestDto: SendAttendRequestDto
  ): Promise<void> {
    const token = headers.split(" ")[1];
    const checkHeaderToken = await checkToken(token, userId);

    if(checkHeaderToken.error){
      throw new UnauthorizedException(checkHeaderToken.message);
    }

    const { requesterEmail, requesteeEmail, eventId } = sendAttendRequestDto;

    const user = await User.findOne({ email: requesteeEmail });

    if(!user) {
      throw new NotFoundException(`${requesteeEmail} has no dalyuck account`);
    }

    const event = await Event.findOne({ id: eventId });

    try{
      await this
        .mailerService
        .sendMail({
          to: requesteeEmail,
          subject: 'You have a event attend request',
          template: './sendAttendRequest',
          context: {
            eventName: event.eventName,
            startTime: event.startTime,
            endTime: event.endTime,
            requester: requesterEmail,
            url: 'dalyuck.com'
          }
      });
    } catch(err) {
      console.log(err);
      throw new InternalServerErrorException('Server error occurred');
    }

    this.attendRequestRepository.sendAttendRequest(requesterEmail, requesteeEmail, eventId);
  }
}
