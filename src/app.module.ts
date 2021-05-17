import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CalendarModule } from './calendar/calendar.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';

@Module({
  imports: [
    CalendarModule,
    TypeOrmModule.forRoot(typeOrmConfig)
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
