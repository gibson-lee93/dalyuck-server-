import { Module } from '@nestjs/common';
import { RequestEmailService } from './request-email.service';
import { RequestEmailController } from './request-email.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestEmailRepository } from './request-email.repository';
import { OtherCalendarModule } from '../other-calendar/other-calendar.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RequestEmailRepository]),
    OtherCalendarModule
  ],
  providers: [RequestEmailService],
  controllers: [RequestEmailController],
  exports: [RequestEmailService]
})
export class RequestEmailModule {}
