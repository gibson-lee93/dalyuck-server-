import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
require('dotenv').config();


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
    
  await app.listen(process.env.SERVER_PORT);
}
bootstrap();
