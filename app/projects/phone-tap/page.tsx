import type { Metadata } from "next";
import { Mark } from "@/components/mark";
import { pageMetadata } from "@/components/page-metadata";
import { ProseLink } from "@/components/prose-link";

/**
 * Phone Tap's story — tap phones, exchange a job packet, keep it somewhere
 * that isn’t Notes.
 */

export const metadata: Metadata = pageMetadata({
  title: "Phone Tap",
  description:
    "Tap two phones and hand over a job packet — resume, LinkedIn, the professional stuff — into a place that keeps it on purpose.",
  path: "/projects/phone-tap",
  ogType: "article",
});

export default function PhoneTapPage() {
  return (
    <main className="mx-auto max-w-measure px-6 pt-22 pb-28 sm:px-8 sm:pt-32 sm:pb-36 [&_p]:mb-[1.6rem]">
      <a
        href="/projects"
        aria-label="Projects"
        className="inline-block no-underline"
      >
        <Mark className="mb-10" />
      </a>

      <p className="mb-3 text-[0.92rem] text-ink-muted">
        <ProseLink href="/projects">Projects</ProseLink>
        {" · "}
        Phone Tap
      </p>

      <h1 className="mb-[1.6rem] font-medium tracking-[0.01em]">Phone Tap</h1>

      <p>Hey — Nishil here.</p>

      <p>
        Apple already has the gesture: two iPhones meet, contacts hop over.
        Phone Tap is the same kind of tap — but for a job packet. Resume,
        LinkedIn, whatever I need to put forward when I meet someone. Not
        passwords. The professional stuff.
      </p>

      <p>
        Meet someone at a conference, a coffee, a hallway. Tap phones. They get
        my packet. I get theirs if they have one. Both sides keep a clean record
        of the exchange — in an app or vault that stores it on purpose, not
        another pile crowding Notes.
      </p>

      <p>
        NameDrop covers the contact-card gesture. Digital business cards cover
        richer profiles and NFC or QR. What’s still interesting is the job
        packet plus a dedicated home for the receiver: resume and links in, not
        just name and number.
      </p>

      <p>
        That’s the product I’m building. Tap to share credentials that matter
        for work. Tap to receive them into a place meant for that. Still early —
        the write-up is here so the idea has a door on the projects list, not
        only on the{" "}
        <ProseLink href="/ideas?idea=tap-to-share-credentials">ideas</ProseLink>{" "}
        tray.
      </p>

      <p>
        If you’ve felt the same gap after a NameDrop — contact saved, nothing
        useful attached —{" "}
        <ProseLink href="https://www.linkedin.com/in/nishilfaldu">
          say hi on LinkedIn
        </ProseLink>
        . I’m shaping this one in the open.
      </p>
    </main>
  );
}
