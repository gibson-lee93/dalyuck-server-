import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventRepository } from './event.repository';
import { AttendRequestModule } from '../attend-request/attend-request.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventRepository]),
    AttendRequestModule
  ],
  providers: [EventService],
  controllers: [EventController]
})
export class EventModule {}
