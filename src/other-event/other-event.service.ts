import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OtherEvent } from './other-event.entity';
import { OtherEventRepository } from './other-event.repository';
import { checkToken } from '../function/token/createToken';

@Injectable()
export class OtherEventService {
  constructor(
    @InjectRepository(OtherEventRepository)
    private otherEventRepository: OtherEventRepository
  ) {}

  async getOtherEvent(
    headers: string,
    userId: number,
    otherCalendarId: number
  ): Promise<OtherEvent[]> {
    const token = headers.split(" ")[1];
    const checkHeaderToken = await checkToken(token, userId);

    if(checkHeaderToken.error){
      throw new UnauthorizedException(checkHeaderToken.message);
    }

    const result = await this.otherEventRepository.find({ otherCalendarId });

    if(result.length === 0) {
      throw new NotFoundException(`Event for other calendar with id:${otherCalendarId} not found`);
    }

    return result;
  }
}
