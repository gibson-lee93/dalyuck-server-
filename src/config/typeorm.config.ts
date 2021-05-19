import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'qweasdZXC123',
  database: 'dalyuck',
  autoLoadEntities: true,
  synchronize: true
};
