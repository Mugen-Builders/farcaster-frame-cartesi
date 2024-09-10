## Frames for Cartesi rollup dApps

Frames are tiny meta-apps within Farcaster client(like Warpcast). You can literally turn your post(aka cast) into an interactive app. Frames can work as UI for triggereing advance request on your Cartesi backend.

This project is a fork of https://github.com/Zizzamia/a-frame-in-100-lines


### How does it work?
[todo: add architecture diagram]

### Steps to run

> **Note:** Frames with transactions are best tested when deployed on a live server. Full fledged local debugging is currently not supported.

1. Clone this repo in your local machine
```
git clone https://github.com/Mugen-Builders/farcaster-frame-cartesi
```
2. Modify `config.ts` as per instructions in the file.

3. Create a `.env.local` file inside root directory with the following variable:
```
NEYNAR_API_KEY=<YOUR_NEYNAR_API_KEY>
```
4. Run the project
```
npm run dev
```
5. Create a ngrok server to test the frame on your local machine. Install ngrok from [here](https://ngrok.com/download).
```
ngrok http http://localhost:3000 
```
6. Add the ngrok generated server url to config.ts file.

7. Test the frame on [Warpcast frames validator](https://warpcast.com/~/developers/frames). Enter the ngrok url and you'll see the frame in action.

8. The frame is interacting with [to-upper](https://github.com/Mugen-Builders/to-upper-js) Cartesi backend example. If you want to interact with a different Cartesi dApp, make sure it is deployed on a testnet/mainnet and update variables in `config.ts` file accordingly.