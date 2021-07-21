export enum EStreamLabsEvent {
  LOAD = `streamlabs-load`,
  UNLOAD = `streamlabs-unload`,
  OPEN = `streamlabs-open`,
  CLOSE = `streamlabs-close`,
  ERROR = `streamlabs-error`,

  DONATION = `streamlabs-donation`,
  MERCH = `streamlabs-merch`,
  FACEMASK_DONATION = `streamlabs-facemaskdonation`,
  CLOUDBOT_REDEMPTION = `streamlabs-cloudbot-redemption`,
  PRIME_SUB_GIFT = `streamlabs-prime-sub-gift`,

  TWITCH_FOLLOW = `streamlabs-twitch-follow`,
  TWITCH_SUB = `streamlabs-twitch-sub`,
  TWITCH_RESUB = `streamlabs-twitch-resub`,
  TWITCH_HOST = `streamlabs-twitch-host`,
  TWITCH_BITS = `streamlabs-twitch-bits`,
  TWITCH_RAID = `streamlabs-twitch-raid`,

  YOUTUBE_FOLLOW = `streamlabs-youtube-follow`,
  YOUTUBE_SUB = `streamlabs-youtube-sub`,
  YOUTUBE_SUPERCHAT = `streamlabs-youtube-superchat`,
}
