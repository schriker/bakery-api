import { Module } from '@nestjs/common';
import { MailingService } from './mailing.service';

@Module({
  exports: [MailingService],
  providers: [MailingService],
})
export class MailingModule {}
