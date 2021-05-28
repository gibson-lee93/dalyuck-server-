import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// NodeJS에 있는 모든 FileSystem을
// fs로 import 한다.
import * as fs from 'fs';

async function bootstrap() {
  // https옵션을 저장할 변수
  // httpsOption을 생성한다.
  const httpsOptions = {
    // key, cert의 해당경로를 통해 read한다.
    // __dirname은 디렉토리 경로를 나타낸다.
    // mkcert -key-file key.pem -cert-file cert.pem localhost 127.0.0.1 ::1으로 key,cert생성
    // 이후 key, cert.pem 파일은 dist폴더로 이동
    key: fs.readFileSync(__dirname + '/key.pem'),
    cert: fs.readFileSync(__dirname + '/cert.pem'),
  }
  const app = await NestFactory.create(AppModule,

  {
    httpsOptions
  });
  // CORS 추가부분 #135
  app.enableCors({
    origin: true
    methods: 'GET,PATCH,POST,DELETE',
    credentials: true,
    exposedHeaders: ['Authorization'] // 코드 추가부분
  });
    
  await app.listen(3000);
}
bootstrap();
