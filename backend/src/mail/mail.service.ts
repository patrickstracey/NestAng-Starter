import { Injectable } from '@nestjs/common';
import * as sendgrid from '@sendgrid/mail';
import { environment } from '../../environments/environment';

interface BasicEmailTemplate {
  to: string;
  from: string;
  subject: string;
  html: string;
}

interface IntegratedEmailTemplate {
  to: string;
  from: string;
  templateId: string;
  dynamicTemplateData: object;
}

const TEMPLATE_IDS = {
  PASSWORD_RESET: 'SENDGRID_TEMPLATE_ID_GOES_HERE',
  INVITE: 'SENDGRID_TEMPLATE_ID_GOES_HERE',
  WELCOME: 'SENDGRID_TEMPLATE_ID_GOES_HERE',
};

@Injectable()
export class MailService {
  constructor() {
    sendgrid.setApiKey(environment.sendgrid.api_key);
  }

  private sendEmail(emailData: BasicEmailTemplate | IntegratedEmailTemplate) {
    sendgrid.send(emailData).then(
      () => {
        return;
      },
      (error) => {
        console.error(error);
        if (error.response) {
          console.error(error.response.body);
        }
      },
    );
  }

  sendPasswordResetEmail(toEmail: string, resetUuid: string) {
    const linkUrl = `${environment.sendgrid.url}/reset-password/${resetUuid}`;
    const result: IntegratedEmailTemplate = {
      to: toEmail,
      from: 'no-reply@nestang.com',
      templateId: TEMPLATE_IDS.PASSWORD_RESET,
      dynamicTemplateData: {
        linkUrl: linkUrl,
      },
    };

    this.sendEmail(result);
  }

  async sendInviteEmail(_id: string, email: string) {
    const dynamicData = {
      invite_url: `${environment.sendgrid.url}/signup/${_id}`,
      subject: `You have been invited to PRODUCT NAME!`,
    };

    const result: IntegratedEmailTemplate = {
      to: email,
      from: 'welcome@nestang.com',
      templateId: TEMPLATE_IDS.INVITE,
      dynamicTemplateData: dynamicData,
    };

    this.sendEmail(result);
  }

  sendCreationWelcomeEmail(email: string) {
    const result: IntegratedEmailTemplate = {
      to: email,
      from: 'welcome@nestang.com',
      templateId: TEMPLATE_IDS.WELCOME,
      dynamicTemplateData: null,
    };

    this.sendEmail(result);
  }
}
