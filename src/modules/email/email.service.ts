import { Injectable, Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { MailerService } from '@nestjs-modules/mailer';
dotenv.config();
const logger = new Logger('EmailService');

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}


  sendEmail(
    to: string,
    cc: string[],
    bcc: string[],
    subject: string,
    template: string,
    context: Record<string, unknown>,
  ): any {
    this.mailerService
      .sendMail({
        to,
        from: process.env.SENDGRID_EMAIL,
        subject,
        template,
        context,
        cc,
        bcc,
      })
      .then((res) => {
        logger.log(res);
      });
  }
}
