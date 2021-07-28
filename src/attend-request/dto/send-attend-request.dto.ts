import { IsString, IsNumber } from 'class-validator';

export class SendAttendRequestDto {
  @IsString()
  requesterEmail: string;

  @IsString()
  requesteeEmail: string;

  @IsNumber()
  eventId: number;
}
