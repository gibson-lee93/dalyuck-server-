import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
require('dotenv').config();
import { join } from 'path';

export const mailConfig:any = {
  transport: {
    host: 'smtp.gmail.com',
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    },
  },
  defaults: {
    from: `"No Reply" <noreply@dalyuck.com>`
  },
  template: {
    dir: join(__dirname, '../email-templates/'),
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true
    }
  }
}
