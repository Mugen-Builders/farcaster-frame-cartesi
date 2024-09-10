// update with your ngrok server url or the deployed url
export const NEXT_PUBLIC_URL =
  process.env.NODE_ENV == 'development'
    ? 'https://bd55-183-83-54-24.ngrok-free.app'
    : 'https://cartesi-frame.vercel.app/';

// config for Cartesi to send inputs and read outputs
export const CARTESI_INPUT_BOX_ADDR = '0x59b22D57D4f067708AB0c00552767405926dc768'; // no need to change
export const CARTESI_DAPP_ADDRESS = '0xCf90dDE78F769c119E05D39441ce369Fd483CA0D'; // modify as per your dapp address
export const CARTESI_NODE_GRAPHQL_ENDPOINT = 'https://toupper.fly.dev/graphql'; // modify as per your node graphql endpoint
export const CARTESI_NODE_INSPECT_ENDPOINT = 'https://toupper.fly.dev/inspect'; // modify as per your node inspect endpoint

// get a neynar api key from https://neynar.com/
export const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY || 'YOUR_NEYNAR_API_KEY';
