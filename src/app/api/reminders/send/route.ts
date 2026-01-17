import { NextRequest, NextResponse } from 'next/server';
import { sendPaymentReminder } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { toEmail, toName, fromName, amount, groupName, currency } = await request.json();

    if (!toEmail || !toName || !fromName || !amount || !groupName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await sendPaymentReminder({
      toEmail,
      toName,
      fromName,
      amount,
      groupName,
      currency,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to send reminder' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Send reminder error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
