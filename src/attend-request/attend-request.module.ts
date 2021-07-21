import { Module } from '@nestjs/common';
import { AttendRequestService } from './attend-request.service';
import { AttendRequestController } from './attend-request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendRequestRepository } from './attend-request.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([AttendRequestRepository])
  ],
  providers: [AttendRequestService],
  controllers: [AttendRequestController],
  exports: [AttendRequestService]
})
export class AttendRequestModule {}
