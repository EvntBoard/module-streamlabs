import process from 'process';
import { getEvntComClientFromChildProcess, getEvntComServerFromChildProcess } from "evntboard-communicate";
// @ts-ignore
import { default as io } from "socket.io-client";
import { EStreamLabsEvent } from './EStreamLabsEvent';

// parse params
const { name: NAME, customName: CUSTOM_NAME, config: { token: TOKEN } } = JSON.parse(process.argv[2]);
const EMITTER = CUSTOM_NAME || NAME;

const evntComClient = getEvntComClientFromChildProcess();
const evntComServer = getEvntComServerFromChildProcess();

let socket: any;
let attemps: number = 0;

const onNewEvent = (data: any): void => {
  if (data?.emitter !== EMITTER) return
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

const load = async () => {
  evntComClient.newEvent(EStreamLabsEvent.LOAD, null, { emitter: EMITTER });
  socket = io(`https://sockets.streamlabs.com?token=${TOKEN}`, {
    transports: ["websocket"],
  });

  // Socket connected
  socket.on("connect", () => {
    evntComClient.newEvent(EStreamLabsEvent.OPEN, null, { emitter: EMITTER });
  });

  // Socket got disconnected
  socket.on("disconnect", () => {
    evntComClient.newEvent(EStreamLabsEvent.CLOSE, null, { emitter: EMITTER });
  });

  socket.on(
    "event",
    ({ type, message, for: referrer, event_id }: any) => {
      switch (referrer) {
        case "streamlabs":
          switch (type) {
            case "merch":
              message.forEach((item: any) => {
                evntComClient.newEvent(EStreamLabsEvent.MERCH, {
                  event_id,
                  type,
                  for: referrer,
                  ...item,
                }, { emitter: EMITTER });
              });
              break;
            case "donation":
              message.forEach((item: any) => {
                evntComClient.newEvent(EStreamLabsEvent.DONATION, {
                  event_id,
                  type,
                  for: referrer,
                  ...item,
                }, { emitter: EMITTER });
              });
              break;
            case "facemaskdonation":
              message.forEach((item: any) => {
                evntComClient.newEvent(
                  EStreamLabsEvent.FACEMASK_DONATION,
                  {
                    event_id,
                    type,
                    for: referrer,
                    ...item,
                  },
                  { emitter: EMITTER }
                );
              });
              break;
            case "loyalty_store_redemption":
              message.forEach((item: any) => {
                evntComClient.newEvent(
                  EStreamLabsEvent.CLOUDBOT_REDEMPTION,
                  {
                    event_id,
                    type,
                    for: referrer,
                    ...item,
                  },
                  { emitter: EMITTER }
                );
              });
              break;
            case "prime_sub_gift":
              message.forEach((item: any) => {
                evntComClient.newEvent(
                  EStreamLabsEvent.PRIME_SUB_GIFT,
                  {
                    event_id,
                    type,
                    for: referrer,
                    ...item,
                  },
                  { emitter: EMITTER }
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
                evntComClient.newEvent(
                  EStreamLabsEvent.TWITCH_FOLLOW,
                  {
                    event_id,
                    type,
                    for: referrer,
                    ...item,
                  },
                  { emitter: EMITTER }
                );
              });
              break;
            case "subscription":
              message.forEach((item: any) => {
                evntComClient.newEvent(
                  EStreamLabsEvent.TWITCH_SUB,
                  {
                    event_id,
                    type,
                    for: referrer,
                    ...item,
                  }, { emitter: EMITTER }
                );
              });
              break;
            case "resub":
              message.forEach((item: any) => {
                evntComClient.newEvent(
                  EStreamLabsEvent.TWITCH_RESUB,
                  {
                    event_id,
                    type,
                    for: referrer,
                    ...item,
                  }, { emitter: EMITTER }
                );
              });
              break;
            case "host":
              message.forEach((item: any) => {
                evntComClient.newEvent(
                  EStreamLabsEvent.TWITCH_HOST,
                  {
                    event_id,
                    type,
                    for: referrer,
                    ...item,
                  }, { emitter: EMITTER }
                );
              });
              break;
            case "bits":
              message.forEach((item: any) => {
                evntComClient.newEvent(
                  EStreamLabsEvent.TWITCH_BITS,
                  {
                    event_id,
                    type,
                    for: referrer,
                    ...item,
                  }, { emitter: EMITTER }
                );
              });
              break;
            case "raid":
              message.forEach((item: any) => {
                evntComClient.newEvent(
                  EStreamLabsEvent.TWITCH_RAID,
                  {
                    event_id,
                    type,
                    for: referrer,
                    ...item,
                  }, { emitter: EMITTER }
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
                evntComClient.newEvent(
                  EStreamLabsEvent.YOUTUBE_FOLLOW,
                  {
                    event_id,
                    type,
                    for: referrer,
                    ...item,
                  }, { emitter: EMITTER }
                );
              });
              break;
            case "subscription":
              message.forEach((item: any) => {
                evntComClient.newEvent(
                  EStreamLabsEvent.YOUTUBE_SUB,
                  {
                    event_id,
                    type,
                    for: referrer,
                    ...item,
                  }, { emitter: EMITTER }
                );
              });
              break;
            case "superchat":
              message.forEach((item: any) => {
                evntComClient.newEvent(
                  EStreamLabsEvent.YOUTUBE_SUPERCHAT,
                  {
                    event_id,
                    type,
                    for: referrer,
                    ...item,
                  }, { emitter: EMITTER }
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
    socket.disconnect();
    evntComClient.newEvent(EStreamLabsEvent.UNLOAD, null, { emitter: EMITTER });
  } catch (e) {
    console.error(e.stack);
  }
}

const reload = async () => {
  await unload();
  await load();
}

const tryReconnect = () => {
  attemps += 1
  console.log(`Attempt to reconnect OBS for the ${attemps} time(s)`)
  const waintingTime = attemps * 5000
  setTimeout(async () => await load(), waintingTime)
}

evntComServer.expose('newEvent', onNewEvent)
evntComServer.expose('load', load)
evntComServer.expose('unload', unload)
evntComServer.expose('reload', reload)