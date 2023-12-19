import { Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { IMailSender } from 'src/common/interfaces';

export const sendEmailTemplate = async (
  { email, first_name, last_name, emailText }: IMailSender
): Promise<void> => {
   const { SMTP_HOST, SMTP_PASSWORD, SMTP_USER, SMTP_PORT } = process.env;
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT),
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
    secure: false,
    requireTLS: true,
  } as nodemailer.TransportOptions);

  const mailOptions = {
    from: 'example.support@gmail.com',
    to: email,
    subject: `Hi ${first_name}`,
    text: `Hello ${first_name} ${last_name}. ${emailText}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    Logger.log(`Email sent to ${email}`);
  } catch (error) {
    Logger.error(`Error sending email: ${error.message}`);
    throw error;
  }
};