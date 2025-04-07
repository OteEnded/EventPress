import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/emailservice';


export async function POST(req) {
  const { email } = await req.json();

  try {
    const x = await sendEmail(
      email,
        'Test email from Next.js + Brevo',
        '<p>Hello! If you can see this, Brevo SMTP is working!</p>'
    );
    
    console.log('Email sent successfully:', x);

    return NextResponse.json({ message: 'Email sent' }, { status: 200 });
  } catch (error) {
    console.error('Resend error:', error);
    return NextResponse.json({ error: 'Email failed' }, { status: 500 });
  }
}
