import { EvntCom } from "@evntboard/evntcom-node";
// @ts-ignore
import { default as io } from "socket.io-client";
import { IConfigItem } from "./ConfigLoader";
import { EStreamLabsEvent } from "./EStreamLabsEvent";

export class StreamLabsConnexion {
  private evntCom: EvntCom;
  private config: IConfigItem;

  private socket: any;
  private attemps: number = 0;

  constructor(
    evntBoardHost: string,
    evntBoardPort: number,
    config: IConfigItem
  ) {
    this.config = config;
    this.evntCom = new EvntCom({
      name: config.name,
      port: evntBoardPort,
      host: evntBoardHost,
      events: [EStreamLabsEvent.OPEN, EStreamLabsEvent.CLOSE],
    });

    this.evntCom.on("open", this.load);

    this.evntCom.on("event", (data: any): void => {
      if (data?.emitter !== config.name) return;
      switch (data?.event) {
        case EStreamLabsEvent.OPEN:
          this.attemps = 0;
          break;
        case EStreamLabsEvent.CLOSE:
          this.tryReconnect();
          break;
        default:
          break;
      }
    });

    this.evntCom.connect();
  }

  load = async () => {
    await this.evntCom.notify("newEvent", [
      EStreamLabsEvent.LOAD,
      null,
      { emitter: this.config.name },
    ]);
    this.socket = io(
      `https://sockets.streamlabs.com?token=${this.config.token}`,
      {
        transports: ["websocket"],
      }
    );

    // Socket connected
    this.socket.on("connect", () => {
      console.log("connect");
      this.evntCom.notify("newEvent", [
        EStreamLabsEvent.OPEN,
        null,
        { emitter: this.config.name },
      ]);
    });

    this.socket.on("connection", () => {
      console.log("connection");
    });

    this.socket.on("connect_error", (e: any) => {
      console.log("connect_error", e);
    });

    this.socket.on("connect_timeout", () => {
      console.log("connect_timeout");
    });

    this.socket.on("error", () => {
      console.log("error");
    });

    this.socket.on("disconnect", () => {
      console.log("disconnect");
    });

    this.socket.on("disconnecting", () => {
      console.log("disconnecting");
    });

    this.socket.on("newListener", () => {
      console.log("newListener");
    });

    this.socket.on("reconnect_attempt", () => {
      console.log("reconnect_attempt");
    });

    this.socket.on("reconnecting", () => {
      console.log("reconnecting");
    });

    this.socket.on("reconnect_error", () => {
      console.log("reconnect_error");
    });

    this.socket.on("reconnect_failed", () => {
      console.log("reconnect_failed");
    });
    this.socket.on("removeListener", () => {
      console.log("removeListener");
    });
    this.socket.on("ping", () => {
      console.log("ping");
    });
    this.socket.on("pong", () => {
      console.log("pong");
    });

    // Socket got disconnected
    this.socket.on("disconnect", () => {
      this.evntCom.notify("newEvent", [
        EStreamLabsEvent.CLOSE,
        null,
        { emitter: this.config.name },
      ]);
    });

    this.socket.on(
      "event",
      ({ type, message, for: referrer, event_id }: any) => {
        switch (referrer) {
          case "streamlabs":
            switch (type) {
              case "merch":
                message.forEach((item: any) => {
                  this.evntCom.notify("newEvent", [
                    EStreamLabsEvent.MERCH,
                    {
                      event_id,
                      type,
                      for: referrer,
                      ...item,
                    },
                    { emitter: this.config.name },
                  ]);
                });
                break;
              case "donation":
                message.forEach((item: any) => {
                  this.evntCom.notify("newEvent", [
                    EStreamLabsEvent.DONATION,
                    {
                      event_id,
                      type,
                      for: referrer,
                      ...item,
                    },
                    { emitter: this.config.name },
                  ]);
                });
                break;
              case "facemaskdonation":
                message.forEach((item: any) => {
                  this.evntCom.notify("newEvent", [
                    EStreamLabsEvent.FACEMASK_DONATION,
                    {
                      event_id,
                      type,
                      for: referrer,
                      ...item,
                    },
                    { emitter: this.config.name },
                  ]);
                });
                break;
              case "loyalty_store_redemption":
                message.forEach((item: any) => {
                  this.evntCom.notify("newEvent", [
                    EStreamLabsEvent.CLOUDBOT_REDEMPTION,
                    {
                      event_id,
                      type,
                      for: referrer,
                      ...item,
                    },
                    { emitter: this.config.name },
                  ]);
                });
                break;
              case "prime_sub_gift":
                message.forEach((item: any) => {
                  this.evntCom.notify("newEvent", [
                    EStreamLabsEvent.PRIME_SUB_GIFT,
                    {
                      event_id,
                      type,
                      for: referrer,
                      ...item,
                    },
                    { emitter: this.config.name },
                  ]);
                });
                break;
              default:
                console.warn(`Unknow streamlabs ${referrer} - ${type} ...`);
                break;
            }
            break;
          case "twitch_account":
            switch (type) {
              case "follow":
                message.forEach((item: any) => {
                  this.evntCom.notify("newEvent", [
                    EStreamLabsEvent.TWITCH_FOLLOW,
                    {
                      event_id,
                      type,
                      for: referrer,
                      ...item,
                    },
                    { emitter: this.config.name },
                  ]);
                });
                break;
              case "subscription":
                message.forEach((item: any) => {
                  this.evntCom.notify("newEvent", [
                    EStreamLabsEvent.TWITCH_SUB,
                    {
                      event_id,
                      type,
                      for: referrer,
                      ...item,
                    },
                    { emitter: this.config.name },
                  ]);
                });
                break;
              case "resub":
                message.forEach((item: any) => {
                  this.evntCom.notify("newEvent", [
                    EStreamLabsEvent.TWITCH_RESUB,
                    {
                      event_id,
                      type,
                      for: referrer,
                      ...item,
                    },
                    { emitter: this.config.name },
                  ]);
                });
                break;
              case "host":
                message.forEach((item: any) => {
                  this.evntCom.notify("newEvent", [
                    EStreamLabsEvent.TWITCH_HOST,
                    {
                      event_id,
                      type,
                      for: referrer,
                      ...item,
                    },
                    { emitter: this.config.name },
                  ]);
                });
                break;
              case "bits":
                message.forEach((item: any) => {
                  this.evntCom.notify("newEvent", [
                    EStreamLabsEvent.TWITCH_BITS,
                    {
                      event_id,
                      type,
                      for: referrer,
                      ...item,
                    },
                    { emitter: this.config.name },
                  ]);
                });
                break;
              case "raid":
                message.forEach((item: any) => {
                  this.evntCom.notify("newEvent", [
                    EStreamLabsEvent.TWITCH_RAID,
                    {
                      event_id,
                      type,
                      for: referrer,
                      ...item,
                    },
                    { emitter: this.config.name },
                  ]);
                });
                break;
              default:
                console.warn(`Unknow streamlabs ${referrer} - ${type} ...`);
                break;
            }
            break;
          case "youtube_account":
            switch (type) {
              case "follow":
                message.forEach((item: any) => {
                  this.evntCom.notify("newEvent", [
                    EStreamLabsEvent.YOUTUBE_FOLLOW,
                    {
                      event_id,
                      type,
                      for: referrer,
                      ...item,
                    },
                    { emitter: this.config.name },
                  ]);
                });
                break;
              case "subscription":
                message.forEach((item: any) => {
                  this.evntCom.notify("newEvent", [
                    EStreamLabsEvent.YOUTUBE_SUB,
                    {
                      event_id,
                      type,
                      for: referrer,
                      ...item,
                    },
                    { emitter: this.config.name },
                  ]);
                });
                break;
              case "superchat":
                message.forEach((item: any) => {
                  this.evntCom.notify("newEvent", [
                    EStreamLabsEvent.YOUTUBE_SUPERCHAT,
                    {
                      event_id,
                      type,
                      for: referrer,
                      ...item,
                    },
                    { emitter: this.config.name },
                  ]);
                });
                break;
              default:
                console.warn(`Unknow streamlabs ${referrer} - ${type} ...`);
                break;
            }
            break;
          default:
            console.warn(`Unknow streamlabs ${referrer} - ${type} ...`);
            break;
        }
      }
    );
  };

  tryReconnect = () => {
    this.attemps += 1;
    console.log(
      `Attempt to reconnect streamlabs for the ${this.attemps} time(s)`
    );
    const waintingTime = this.attemps * 5000;
    setTimeout(async () => await this.load(), waintingTime);
  };
}
