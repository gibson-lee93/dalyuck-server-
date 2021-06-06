import {
  Controller,
  Post,
  Headers,
  Body,
  Patch,
  Delete,
  Param,
  ParseIntPipe,
  Query,
  HttpCode
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from './notification.entity';

@Controller('notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Post('/:id')
  @HttpCode(200)
  getNotification(
    @Headers('authorization') headers: string,
    @Param('id', ParseIntPipe) userId: number,
    @Query('eventId', ParseIntPipe) eventId: number
  ): Promise<Notification[]> {
    return this.notificationService.getNotification(headers, userId, eventId);
  }

  @Post()
  createNotification(
    @Headers('authorization') headers: string,
    @Body('userId') userId: number,
    @Body() createNotificationDto: CreateNotificationDto
  ): Promise<Notification> {
    return this.notificationService.createNotification(headers, userId, createNotificationDto);
  }

  @Patch()
  updateNotification(
    @Headers('authorization') headers: string,
    @Body('userId') userId: number,
    @Body() updateNotificationDto: UpdateNotificationDto
  ): Promise<Notification> {
    return this.notificationService.updateNotification(headers, userId, updateNotificationDto);
  }

  @Delete()
  deleteNotification(
    @Headers('authorization') headers: string,
    @Body('userId') userId: number,
    @Body('notificationId') notificationId: number
  ): Promise<void> {
    return this.notificationService.deleteNotification(headers, userId, notificationId);
  }
}
