import config from "../config";

import  nodemailer from "nodemailer"

export const sendEmail = async (to: string| string[], html: string,subject:string) => {
 
 try {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: config.mail,
      pass: config.mail_pass,
    },
  });

  const recipients = Array.isArray(to) ? to.join(", ") : to;
   await transporter.sendMail({
    from: 'akonhasan680@gmail.com', // sender address
    to:recipients, // list of receivers
    subject, // Subject line
    text: '', // plain text body
    html, // html body
  });
  
 } catch (error) {
  console.log(error)
 }

};