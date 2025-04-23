import { sendMail } from '@/utils/sendMail';
import { NextResponse } from 'next/server';

export async function GET() {
    let options={
        email: 'demo2@yopmail.com',
        username: "User",
        url: 'http://localhost:3000/dashboard/c99301e3-b15b-46d2-aa57-7f3b80ecab6f/tasks',
        title: 'Another New task 2',
        btnText: 'View Task',
        subject: 'New Task Assigned'
      }
    try {
        const response = {
            message: 'Email API is working!',
            status: 'success',
        };
        await sendMail(options)
        // html: '<h1>Hello from Resend</h1><p>This is a test email.</p>',
        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Something went wrong', status: 'error' }, { status: 500 });
    }
}