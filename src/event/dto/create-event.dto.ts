export class CreateEventDto {
  startTime: string;
  endTime: string;
  calendarId: number;
  eventName?: string;
  description?: string;
  access?: boolean;
  location?: string;
  colour: string;
}
