import { type Channel, channelLabel } from "@/components/radar/sources";

/**
 * The row of places one source publishes.
 *
 * Quieter than <ProseLink />: no underline until hover, no preview card. These
 * sit under a name in groups of three or four, and at full amber-with-underline
 * they’d out-shout the name they belong to.
 */
export function SourceLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="text-[0.92rem] text-ink-muted underline decoration-transparent decoration-1 underline-offset-2 transition-colors hover:text-accent hover:decoration-accent focus-visible:text-accent"
    >
      {children}
    </a>
  );
}

/** Channels for one source, separated by the site’s middle dot. */
export function ChannelRow({ channels }: { channels: Channel[] }) {
  if (channels.length === 0) return null;
  return (
    <p className="mt-2 mb-0 flex flex-wrap items-baseline gap-x-2 gap-y-1">
      {channels.map((channel, i) => (
        <span key={channel.href} className="flex items-baseline gap-x-2">
          {i > 0 ? (
            <span className="text-rule select-none" aria-hidden>
              ·
            </span>
          ) : null}
          <SourceLink href={channel.href}>{channelLabel(channel)}</SourceLink>
        </span>
      ))}
    </p>
  );
}
