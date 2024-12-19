import { sendEmail } from "@/lib/sendGrid";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;
    if (!email) {
      return NextResponse.json(
        {
          message: "Email is required!",
        },
        { status: 400 }
      );
    }

    await sendEmail(email,'Test Email','This is a test email from Cypress')
    return NextResponse.json(
        {message:'Email sent successfully'},
        {status:200}
    )
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
