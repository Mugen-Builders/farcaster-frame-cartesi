import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL, CARTESI_NODE_GRAPHQL_ENDPOINT, CARTESI_INPUT_BOX_ADDR } from '../../config';
import { ethers } from 'ethers';
import { createPublicClient, http, decodeEventLog } from 'viem';
import { baseSepolia } from 'viem/chains';
import InputBoxABI from '../../_contracts/InputBoxABI';

export const runtime = 'edge'

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

interface GraphQLResponse {
  data: {
    notice: {
      index: number;
      payload: string;
    };
  };
}

async function getInputIndex(transactionHash: string): Promise<bigint | null> {
  console.log('Getting input index for transaction', transactionHash);
  const receipt = await publicClient.waitForTransactionReceipt({ hash: transactionHash as `0x${string}` });
  const event = receipt.logs.find(log => 
    log.address.toLowerCase() === CARTESI_INPUT_BOX_ADDR.toLowerCase()
  );

  if (event) {
    const decodedEvent = decodeEventLog({
      abi: InputBoxABI,
      data: event.data,
      topics: event.topics,
    });
    console.log('Decoded event', decodedEvent);
    console.log('Input index', decodedEvent.args.inputIndex);
    return decodedEvent.args.inputIndex as bigint;
  }
  return null;
}

async function getNotice(inputIndex: number): Promise<string | null> {
  const query = `
    query {
      notice(noticeIndex: 0, inputIndex: ${inputIndex}) {
        index
        payload
      }
    }
  `;

  const response = await fetch(CARTESI_NODE_GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });

  const data = await response.json() as GraphQLResponse;
  console.log('GraphQL response', data);
  
  if (!data.data || !data.data.notice) {
    console.log('No notice data found');
    return null;
  }
  
  return data.data.notice.payload ? ethers.toUtf8String(data.data.notice.payload) : null;
}

async function pollForNotice(inputIndex: number, maxAttempts = 10, interval = 3000): Promise<string | null> {
  console.log('Polling for notice with input index', inputIndex);
  for (let i = 0; i < maxAttempts; i++) {
    const notice = await getNotice(inputIndex);
    if (notice && notice.trim() !== '') {
      console.log('Found notice', notice);
      return notice;
    }
    await new Promise(resolve => setTimeout(resolve, interval));
  }
  return null;
}

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: FrameRequest = await req.json();
  const { isValid } = await getFrameMessage(body);

  if (!isValid) {
    return new NextResponse('Message not valid', { status: 500 });
  }

  const transactionId = body.untrustedData.transactionId;
  if (!transactionId) {
    return new NextResponse('No transaction ID provided', { status: 400 });
  }

  const inputIndexBigInt = await getInputIndex(transactionId);
  if (!inputIndexBigInt) {
    return new NextResponse('Failed to get input index', { status: 500 });
  }

  const inputIndex = Number(inputIndexBigInt);
  const notice = await pollForNotice(inputIndex);
  const message = notice || 'No notice available after polling';
  console.log('Updating Message', message);

  const imageUrl = `${NEXT_PUBLIC_URL}/api/og?message=${encodeURIComponent(message)}`;

  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: 'Total scream counter',
          action: 'post',
        },
      ],
      image: {
        src: imageUrl,
      },
      postUrl: `${NEXT_PUBLIC_URL}/api/inspect-cm`,
    }),
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
