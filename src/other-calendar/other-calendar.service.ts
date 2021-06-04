import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OtherCalendarRepository } from './other-calendar.repository';
import { OtherCalendar } from './other-calendar.entity';
import { checkToken } from '../function/token/createToken';
import { RequestEmail } from '../request-email/request-email.entity';
import { UpdateOtherCalendarDto } from './dto/update-other-calendar.dto';

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

    const requestEmail = await RequestEmail.findOne({ id: requestEmailId });
    
    try{
      const otherCalendar = await this.otherCalendarRepository.confirmSubscription(requestEmail.calendarId, userId);
      await RequestEmail.delete({ id: requestEmailId });
      return otherCalendar;
    } catch(err) {
      console.log(err);
      throw new InternalServerErrorException('Server error occurred');
    }
  }

  async updateOtherCalendar(
    headers: string,
    userId: number,
    updateOtherCalendarDto: UpdateOtherCalendarDto
  ): Promise<OtherCalendar> {
    const token = headers.split(" ")[1];
    const checkHeaderToken = await checkToken(token, userId);

    if(checkHeaderToken.error){
      throw new UnauthorizedException(checkHeaderToken.message);
    }

    try{
      return await this.otherCalendarRepository.updateOtherCalendar(updateOtherCalendarDto);
    } catch(err) {
      console.log(err);
      throw new InternalServerErrorException('Server error occurred');
    }
  }

  async deleteOtherCalendar(
    headers: string,
    userId: number,
    otherCalendarId: number
  ): Promise<void> {
    const token = headers.split(" ")[1];
    const checkHeaderToken = await checkToken(token, userId);

    if(checkHeaderToken.error){
      throw new UnauthorizedException(checkHeaderToken.message);
    }

    try{
      return await this.otherCalendarRepository.deleteOtherCalendar(userId, otherCalendarId);
    } catch(err) {
      console.log(err);
      throw new InternalServerErrorException('Server error occurred');
    }
  }
}
