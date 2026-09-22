import { NextRequest, NextResponse } from 'next/server';

const MIDTRANS_SANDBOX_URL = 'https://app.sandbox.midtrans.com/snap/v1/transactions';
const MIDTRANS_PRODUCTION_URL = 'https://app.midtrans.com/snap/v1/transactions';

export async function POST(request: NextRequest) {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  if (!serverKey) {
    return NextResponse.json({ error: 'Midtrans server key is not configured.' }, { status: 500 });
  }

  try {
    const body = await request.json() as {
      orderId?: string;
      grossAmount?: number;
      customer?: { firstName?: string; email?: string; phone?: string };
    };

    const grossAmount = Math.round(Number(body.grossAmount));
    if (!body.orderId || !Number.isFinite(grossAmount) || grossAmount <= 0) {
      return NextResponse.json({ error: 'A valid order ID and gross amount are required.' }, { status: 400 });
    }

    const response = await fetch(
      process.env.MIDTRANS_IS_PRODUCTION === 'true'
        ? MIDTRANS_PRODUCTION_URL
        : MIDTRANS_SANDBOX_URL,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Basic ${Buffer.from(`${serverKey}:`).toString('base64')}`,
        },
        body: JSON.stringify({
          transaction_details: {
            order_id: body.orderId,
            gross_amount: grossAmount,
          },
          customer_details: {
            first_name: body.customer?.firstName || 'Modesy Customer',
            email: body.customer?.email,
            phone: body.customer?.phone,
          },
        }),
      }
    );

    const result = await response.json() as { token?: string; error_messages?: string[] };
    if (!response.ok || !result.token) {
      console.error('Midtrans token request failed:', result);
      return NextResponse.json(
        { error: result.error_messages?.join(', ') || 'Unable to create Midtrans payment.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ token: result.token });
  } catch (error) {
    console.error('Midtrans request error:', error);
    return NextResponse.json({ error: 'Unable to initialize Midtrans payment.' }, { status: 500 });
  }
}
