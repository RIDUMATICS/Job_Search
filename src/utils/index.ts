import config from '../config';
import * as nodemailer from 'nodemailer';

export class CustomError extends Error {
  status: number;
  constructor(msg: string, status: number) {
    super(msg);
    this.status = status;
  }
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.mail.user,
    pass: config.mail.pass,
  },
});

export const sendMail = (message: string) => {
  const mailOptions = {
    from: 'Cron Job Offers',
    to: config.mail.receiver,
    subject: 'Cron Job Offers',
    text: message,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  console.log(message);
};
