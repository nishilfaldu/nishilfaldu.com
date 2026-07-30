/**
 * Shared vocabulary for the three “keep an eye on it” pages — /people, /daily,
 * /watching. A source is a person or a site; a channel is one place that source
 * actually publishes.
 *
 * The channel list isn’t decoration. It’s the seam a feed reader plugs into
 * later: every kind here maps to something pollable (RSS, an Atom feed, a
 * YouTube channel feed, a Substack’s /feed).
 */
export type ChannelKind =
  | "site"
  | "rss"
  | "substack"
  | "newsletter"
  | "x"
  | "youtube"
  | "github"
  | "podcast";

export type Channel = {
  kind: ChannelKind;
  href: string;
  /** Overrides the default label — e.g. “essays” instead of “rss”. */
  label?: string;
};

export const CHANNEL_LABEL: Record<ChannelKind, string> = {
  site: "site",
  rss: "rss",
  substack: "substack",
  newsletter: "newsletter",
  x: "x",
  youtube: "youtube",
  github: "github",
  podcast: "podcast",
};

export function channelLabel(channel: Channel): string {
  return channel.label ?? CHANNEL_LABEL[channel.kind];
}
