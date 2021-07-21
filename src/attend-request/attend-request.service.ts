import { Injectable, UnauthorizedException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AttendRequestRepository } from './attend-request.repository';
import { checkToken } from '../function/token/createToken';
import { MailerService } from '@nestjs-modules/mailer';
import { SendAttendRequestDto } from './dto/send-attend-request.dto';
import { User } from '../user/user.entity';
import { Event } from '../event/event.entity';
import { ConfirmAttendRequestDto } from './dto/confirm-attend-request.dto';

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

    const attendRequest = await this.attendRequestRepository.sendAttendRequest(sendAttendRequestDto);
    await this.confirmAttendRequest(user.id, { eventId: event.id, requestId: attendRequest.id});
  }

  async confirmAttendRequest(
    userId: number,
    confirmAttendRequestDto: ConfirmAttendRequestDto
  ): Promise<void> {
    const { eventId, requestId } = confirmAttendRequestDto;

    try{
      await this.attendRequestRepository.query(
        `INSERT INTO user_event(eventId, userId)
        VALUES (${eventId}, ${userId})`
      );
      await this.attendRequestRepository.delete({ id: requestId });
    } catch(err) {
      console.log(err);
      throw new InternalServerErrorException('Server error occurred');
    }
  }
}
