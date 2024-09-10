import { FrameRequest, getFrameMessage } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { encodeFunctionData } from 'viem';
import { baseSepolia, foundry } from 'viem/chains';
import InputBoxABI from '../../_contracts/InputBoxABI';
import { CARTESI_INPUT_BOX_ADDR, CARTESI_DAPP_ADDRESS, NEYNAR_API_KEY } from '../../config';
import type { FrameTransactionResponse } from '@coinbase/onchainkit/frame';

async function getResponse(req: NextRequest): Promise<NextResponse | Response> {
  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, { neynarApiKey: NEYNAR_API_KEY });

  if (!isValid) {
    return new NextResponse('Message not valid', { status: 500 });
  }

  const userInput = message.input || ''; // Extract user input from the message
  console.log("Input message: ", message.input)

  const data = encodeFunctionData({
    abi: InputBoxABI,
    functionName: 'addInput',
    args: [
      CARTESI_DAPP_ADDRESS, // _dapp address fetched from config file
      `0x${Buffer.from(userInput).toString('hex')}`, // _input as bytes
    ],
  });

  const txData: FrameTransactionResponse = {
    chainId: `eip155:${baseSepolia.id}`,
    method: 'eth_sendTransaction',
    params: {
      abi: [],
      data,
      to: CARTESI_INPUT_BOX_ADDR,
      value: '0', // No ETH value is sent with this transaction
    },
  };
  console.log("Tx data: ", txData)
  return NextResponse.json(txData);
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
