import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Email from 'email-templates';
import { join } from 'path';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class MailingService {
  private email: Email;
  private templatesPath = join(__dirname, '..', '..', 'emails');

  constructor(private configService: ConfigService) {
    this.email = new Email({
      message: {
        from: this.configService.get('MAIL_ADDRESS'),
      },
      transport: {
        host: this.configService.get('MAIL_HOST'),
        port: parseInt(this.configService.get('MAIL_PORT')),
        secure: true,
        auth: {
          user: this.configService.get('MAIL_USERNAME'),
          pass: this.configService.get('MAIL_PASSWORD'),
        },
      },
      send: true,
    });
  }

  sendVerificationEmail(user: User, token: string) {
    this.email
      .send({
        template: join(this.templatesPath, 'verification'),
        message: {
          to: 'janekmachine@gmail.com',
        },
        locals: {
          name: user.firstName,
          token: token,
        },
      })
      .catch(console.error);
  }
}
