import { getFrameMetadata } from '@coinbase/onchainkit/frame';
import type { Metadata } from 'next';
import { NEXT_PUBLIC_URL } from './config';

const frameMetadata = getFrameMetadata({
  buttons: [
    {
      action: 'tx',
      label: 'Send to Cartesi dApp',
      target: `${NEXT_PUBLIC_URL}/api/tx`,
      postUrl: `${NEXT_PUBLIC_URL}/api/tx-success`,
    },
  ],
  image: {
    src: `${NEXT_PUBLIC_URL}/cartesi-machine.png`,
    aspectRatio: '1:1',
  },
  input: {
    text: 'What do you want to scream?',
  },
});

export const metadata: Metadata = {
  title: 'cartesi-frame',
  description: 'LFG',
  openGraph: {
    title: 'cartesi-frame',
    description: 'LFG',
    images: [`${NEXT_PUBLIC_URL}/cartesi-machine.png`],
  },
  other: {
    ...frameMetadata,
  },
};

export default function Page() {
  return (
    <>
      <h1>Send inputs to Cartesi dApp</h1>
    </>
  );
}
