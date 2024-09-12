import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL, CARTESI_NODE_INSPECT_ENDPOINT } from '../../config';
import { ethers } from 'ethers';

export const runtime = 'edge'

async function getTotalScreams(): Promise<string> {
  const response = await fetch(CARTESI_NODE_INSPECT_ENDPOINT + '/total');
  const data = await response.json();
  if (data.reports && data.reports.length > 0) {
    const payload = data.reports[0].payload;
    const decodedPayload = ethers.toUtf8String(payload);
    const jsonPayload = JSON.parse(decodedPayload);
    console.log('jsonPayload', jsonPayload);
    return jsonPayload.toUpperTotal?.toString() || 'No total available';
  }
  return 'No data available';
}

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: FrameRequest = await req.json();
  const { isValid } = await getFrameMessage(body);

  if (!isValid) {
    return new NextResponse('Message not valid', { status: 500 });
  }

  const totalScreams = await getTotalScreams();
  const imageUrl = `${NEXT_PUBLIC_URL}/api/og?message=${encodeURIComponent(totalScreams)}`;

  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: 'Scream Again',
          action: 'post',
          target: NEXT_PUBLIC_URL,
        },
      ],
      image: {
        src: imageUrl,
      },
    }),
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export async function GET(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';