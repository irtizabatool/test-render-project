import { MailerService } from '@nestjs-modules/mailer';
export declare class EmailService {
    private readonly mailerService;
    constructor(mailerService: MailerService);
    sendEmail(to: string, cc: string[], bcc: string[], subject: string, template: string, context: Record<string, unknown>): any;
}
