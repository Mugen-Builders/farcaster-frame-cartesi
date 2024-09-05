import { FrameRequest, getFrameMessage } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { encodeFunctionData } from 'viem';
import { baseSepolia, foundry } from 'viem/chains';
import InputBoxABI from '../../_contracts/InputBoxABI';
import { CARTESI_INPUT_BOX_ADDR, NEYNAR_ONCHAIN_KIT } from '../../config';
import type { FrameTransactionResponse } from '@coinbase/onchainkit/frame';

async function getResponse(req: NextRequest): Promise<NextResponse | Response> {
  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, { neynarApiKey: '9ABF176D-C601-4B63-9CC4-6624427DB2FA' });

  if (!isValid) {
    return new NextResponse('Message not valid', { status: 500 });
  }

  const userInput = message.input || ''; // Extract user input from the message
  console.log("Input message: ", message.input)

  const data = encodeFunctionData({
    abi: InputBoxABI,
    functionName: 'addInput',
    args: [
      '0x11780dFA9c0B1F8C4889BdE71420725476d9e205', // _dapp address
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
