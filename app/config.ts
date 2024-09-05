// use NODE_ENV to not have to change config based on where it's deployed
export const NEXT_PUBLIC_URL =
  process.env.NODE_ENV == 'development' ? 'http://localhost:3000' : 'https://zizzamia.xyz';
  //process.env.NODE_ENV == 'development' ? 'https://6549-2409-40d4-4009-4f15-4541-77f5-ffe0-500b.ngrok-free.app' : 'https://zizzamia.xyz';
export const CARTESI_INPUT_BOX_ADDR = '0x59b22D57D4f067708AB0c00552767405926dc768'
export const NEYNAR_ONCHAIN_KIT = 'YOUR_NEYNAR_API_KEY'
