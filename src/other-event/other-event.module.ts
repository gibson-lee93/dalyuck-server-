import { Module } from '@nestjs/common';
import { OtherEventService } from './other-event.service';
import { OtherEventController } from './other-event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtherEventRepository } from './other-event.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([OtherEventRepository])
  ],
  providers: [OtherEventService],
  controllers: [OtherEventController]
})
export class OtherEventModule {}
