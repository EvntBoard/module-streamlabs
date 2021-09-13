require("dotenv").config();
import { EvntComNode } from "evntcom-js/dist/node";
// @ts-ignore
import { default as io } from "socket.io-client";
import { EStreamLabsEvent } from './EStreamLabsEvent';

const NAME: string = process.env.EVNTBOARD_NAME || "streamlabs";
const HOST: string = process.env.EVNTBOARD_HOST || "localhost";
const PORT: number = process.env.EVNTBOARD_PORT ? parseInt(process.env.EVNTBOARD_PORT) : 5001;
const TOKEN: string = process.env.EVNTBOARD_CONFIG_TOKEN;

const evntCom = new EvntComNode({
    name: NAME,
    port: PORT,
    host: HOST,
});

let socket: any;
let attemps: number = 0;

evntCom.onEvent = (data: any): void => {
  if (data?.emitter !== NAME) return
  switch (data?.event) {
    case EStreamLabsEvent.OPEN:
      attemps = 0
      break
    case EStreamLabsEvent.CLOSE:
      tryReconnect()
      break
    default:
      break
  }
}

const load = evntCom.onOpen =  async () => {
  await unload();
  await evntCom.callMethod("newEvent", [EStreamLabsEvent.LOAD, null, { emitter: NAME }]);
  socket = io(`https://sockets.streamlabs.com?token=${TOKEN}`, {
    transports: ["websocket"],
  });

  // Socket connected
  socket.on("connect", () => {
     evntCom.callMethod("newEvent", [EStreamLabsEvent.OPEN, null, { emitter: NAME }]);
  });

  // Socket got disconnected
  socket.on("disconnect", () => {
     evntCom.callMethod("newEvent", [EStreamLabsEvent.CLOSE, null, { emitter: NAME }]);
  });

  socket.on(
    "event",
    ({ type, message, for: referrer, event_id }: any) => {
      switch (referrer) {
        case "streamlabs":
          switch (type) {
            case "merch":
              message.forEach((item: any) => {
                 evntCom.callMethod("newEvent", [EStreamLabsEvent.MERCH, {
                  event_id,
                  type,
                  for: referrer,
                  ...item,
                }, { emitter: NAME }]);
              });
              break;
            case "donation":
              message.forEach((item: any) => {
                 evntCom.callMethod("newEvent", [EStreamLabsEvent.DONATION, {
                  event_id,
                  type,
                  for: referrer,
                  ...item,
                }, { emitter: NAME }]);
              });
              break;
            case "facemaskdonation":
              message.forEach((item: any) => {
                 evntCom.callMethod("newEvent", [
                  EStreamLabsEvent.FACEMASK_DONATION,
                  {
                    event_id,
                    type,
                    for: referrer,
                    ...item,
                  },
                  { emitter: NAME }]
                );
              });
              break;
            case "loyalty_store_redemption":
              message.forEach((item: any) => {
                 evntCom.callMethod("newEvent", [
                  EStreamLabsEvent.CLOUDBOT_REDEMPTION,
                  {
                    event_id,
                    type,
                    for: referrer,
                    ...item,
                  },
                  { emitter: NAME }]
                );
              });
              break;
            case "prime_sub_gift":
              message.forEach((item: any) => {
                 evntCom.callMethod("newEvent", [
                  EStreamLabsEvent.PRIME_SUB_GIFT,
                  {
                    event_id,
                    type,
                    for: referrer,
                    ...item,
                  },
                  { emitter: NAME }]
                );
              });
              break;
            default:
              console.warn(
                `Unknow streamlabs ${referrer} - ${type} ...`
              );
              break;
          }
          break;
        case "twitch_account":
          switch (type) {
            case "follow":
              message.forEach((item: any) => {
                 evntCom.callMethod("newEvent", [
                  EStreamLabsEvent.TWITCH_FOLLOW,
                  {
                    event_id,
                    type,
                    for: referrer,
                    ...item,
                  },
                  { emitter: NAME }]
                );
              });
              break;
            case "subscription":
              message.forEach((item: any) => {
                 evntCom.callMethod("newEvent", [
                  EStreamLabsEvent.TWITCH_SUB,
                  {
                    event_id,
                    type,
                    for: referrer,
                    ...item,
                  }, { emitter: NAME }]
                );
              });
              break;
            case "resub":
              message.forEach((item: any) => {
                 evntCom.callMethod("newEvent", [
                  EStreamLabsEvent.TWITCH_RESUB,
                  {
                    event_id,
                    type,
                    for: referrer,
                    ...item,
                  }, { emitter: NAME }]
                );
              });
              break;
            case "host":
              message.forEach((item: any) => {
                 evntCom.callMethod("newEvent", [
                  EStreamLabsEvent.TWITCH_HOST,
                  {
                    event_id,
                    type,
                    for: referrer,
                    ...item,
                  }, { emitter: NAME }]
                );
              });
              break;
            case "bits":
              message.forEach((item: any) => {
                 evntCom.callMethod("newEvent", [
                  EStreamLabsEvent.TWITCH_BITS,
                  {
                    event_id,
                    type,
                    for: referrer,
                    ...item,
                  }, { emitter: NAME }]
                );
              });
              break;
            case "raid":
              message.forEach((item: any) => {
                 evntCom.callMethod("newEvent", [
                  EStreamLabsEvent.TWITCH_RAID,
                  {
                    event_id,
                    type,
                    for: referrer,
                    ...item,
                  }, { emitter: NAME }]
                );
              });
              break;
            default:
              console.warn(
                `Unknow streamlabs ${referrer} - ${type} ...`
              );
              break;
          }
          break;
        case "youtube_account":
          switch (type) {
            case "follow":
              message.forEach((item: any) => {
                 evntCom.callMethod("newEvent", [
                  EStreamLabsEvent.YOUTUBE_FOLLOW,
                  {
                    event_id,
                    type,
                    for: referrer,
                    ...item,
                  }, { emitter: NAME }]
                );
              });
              break;
            case "subscription":
              message.forEach((item: any) => {
                 evntCom.callMethod("newEvent", [
                  EStreamLabsEvent.YOUTUBE_SUB,
                  {
                    event_id,
                    type,
                    for: referrer,
                    ...item,
                  }, { emitter: NAME }]
                );
              });
              break;
            case "superchat":
              message.forEach((item: any) => {
                 evntCom.callMethod("newEvent", [
                  EStreamLabsEvent.YOUTUBE_SUPERCHAT,
                  {
                    event_id,
                    type,
                    for: referrer,
                    ...item,
                  }, { emitter: NAME }]
                );
              });
              break;
            default:
              console.warn(
                `Unknow streamlabs ${referrer} - ${type} ...`
              );
              break;
          }
          break;
        default:
          console.warn(
            `Unknow streamlabs ${referrer} - ${type} ...`
          );
          break;
      }
    }
  );
}


const unload = async () => {
  try {
    socket?.disconnect();
  } catch (e) {
    console.error(e.stack);
  }
}

const tryReconnect = () => {
  attemps += 1
  console.log(`Attempt to reconnect StreamLabs for the ${attemps} time(s)`)
  const waintingTime = attemps * 5000
  setTimeout(async () => await load(), waintingTime)
}