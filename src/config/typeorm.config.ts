import { TypeOrmModuleOptions } from '@nestjs/typeorm';
require('dotenv').config()

export const typeOrmConfig:any = {
  type: process.env.DATABASE_TYPE,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
  autoLoadEntities: true,
  synchronize: true
};

// export const typeOrmConfig: TypeOrmModuleOptions = {
// type: 'mysql',
// host: 'localhost',
// port: 3306,
// username: 'root',
// password: 'password',
// database: 'dalyuck',
// autoLoadEntities: true,
// synchronize: true
