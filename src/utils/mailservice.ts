import nodemailer, { SendMailOptions } from "nodemailer";
import { testMailCreds } from "./constants";

const smtp = testMailCreds;

const transporter = nodemailer.createTransport({
  ...smtp,
  auth: { user: smtp.user, pass: smtp.pass },
});

export const sendMail = async (payload: SendMailOptions) => {
  transporter.sendMail(payload, (err, info) => {
    if (err) {
      console.log("error in sending email");
      return;
    }
    console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
  });
};
