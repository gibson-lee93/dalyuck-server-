import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class UpdateEventDto {
  @IsString()
  eventId: number;

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;

  @IsOptional()
  @IsNumber()
  calendarId?: number;

  @IsOptional()
  @IsString()
  eventName?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  access?: boolean;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  colour?: string;
}
