import { Controller, Post, Headers, Body } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Controller('notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Post()
  createNotification(
    @Headers('authorization') headers: string,
    @Body('userId') userId: number,
    @Body() createNotificationDto: CreateNotificationDto
  ): Promise<void> {
    return this.notificationService.createNotification(headers, userId, createNotificationDto);
  }
}
