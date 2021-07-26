import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class CreateEventDto {
  @IsString()
  startTime: string;

  @IsString()
  endTime: string;

  @IsNumber()
  calendarId: number;

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

  @IsString()
  colour: string;
}
