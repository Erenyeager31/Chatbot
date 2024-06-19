import nodemailer from "nodemailer";
import { config } from "dotenv";
import Handlebars from "handlebars";
import fs from "fs";
import path from "path"
config();

const templatesDir = path.join(__dirname, "../templates");
const templateSource = fs.readFileSync(path.join(templatesDir,"index.handlebars"),"utf-8");
const template = Handlebars.compile(templateSource);

export const sendEmailGenericTemplate = async (
  email: string,
  username: string,
  subject:string,
  message:string,
) => {
  console.log(process.env.SMTP_EMAIL, process.env.SMTP_PASS);

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASS,
      },
    });

    const htmlTosend = template({ username,message });

    const mailOptions = {
      from: process.env.SMTP_MAIL,
      to: email,
      subject: subject,
      html: htmlTosend,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Email sent: " + info.response);
    });

    return {
      status: true,
      message: "Email sent to the registered email",
    };
  } catch (error) {
    return {
      status: false,
      message: "Some error occured, please try again later !",
    };
  }
};
