import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// NodeJS에 있는 모든 FileSystem을
// fs로 import 한다.
import * as fs from 'fs';

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);
  
    // CORS 추가부분 #135-2
    app.enableCors({
      origin : true,
      methods: 'GET, PATCH, POST, DELETE',
      credentials: true,
      exposedHeaders: ['Authorization'],
      allowedHeaders:'Content-Type, Accept, Authorization'
    })
    
  await app.listen(3000);
}
bootstrap();
