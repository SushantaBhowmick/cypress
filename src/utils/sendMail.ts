"use server";
import { Resend } from "resend";
import { render } from "@react-email/components";
import WelComeTemplate from "@/components/emails/email";
import nodeMailer from "nodemailer";

const resend = new Resend(process.env.RESEND_API_KEY);

// export const sendMailWithResend = async ({
//   email,
//   subject,
// }: {
//   email: string;
//   subject: string;
// }) => {
//   try {
//     const htmlContent = await render(
//       WelComeTemplate({
//         userFirstname: "Zeno",
//       })
//     );

//     const {data,error} = await resend.emails.send({
//       from: "Test <onboarding@resend.dev>", // or your verified sender domain
//       to: [email],
//       subject,
//       html: htmlContent,
//     });

//     if(error){
//         console.error("Error sending email:", error);
//         return { success: false, error };
//     }
//     console.log("Email sent successfully:", data);
//     return { success: true, data };
//   } catch (error) {
//     console.error("Error sending email:", error);
//     throw new Error("Failed to send email");
//   }
// };

interface SendMailOptions {
  email: string;
  username: string;
  url: string;
  title: string;
  btnText: string;
  subject: string;
}

export const sendMail = async (options: SendMailOptions) => {
  const htmlContent = await render(
    WelComeTemplate({
      userFirstname: options.username
        ? options.username
        : options.email.split("@")[0],
      url: options.url,
      title: options.title,
      btnText: options.btnText,
    })
  );

  try {
    console.log("Sending email...");

    const transporter = nodeMailer.createTransport({
      host: process.env.SMPT_HOST,
      port: Number(process.env.SMPT_PORT),
      service: process.env.SMPT_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"Cypress" <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      html: htmlContent,
    });

    console.log("Email sent successfully:", info.messageId);
    return { success: true, data: info };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};
