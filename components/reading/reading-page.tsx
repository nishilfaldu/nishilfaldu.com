import { hasAgentGateCookie } from "@nishilfaldu/site-agent/gate";
import { Mark } from "@/components/mark";
import { ProseLink } from "@/components/prose-link";
import { RadarNav } from "@/components/radar/radar-nav";
import { AddLink } from "@/components/reading/add-link";
import { Archive } from "@/components/reading/archive";
import { fetchKeeps } from "@/components/reading/keeps";
import { PeopleSection } from "@/components/reading/people-section";

/**
 * /reading — everything I read and kept, filed under the day I found it.
 *
 * The day grouping is the whole idea: a day is a workspace, and what's on it is
 * whatever I was chasing that day. Reading the archive backwards is closer to
 * reading a log than a bookmark folder.
 */
export async function ReadingPage() {
  const [keeps, isOwner] = await Promise.all([
    fetchKeeps(),
    hasAgentGateCookie(),
  ]);

  return (
    <main className="mx-auto max-w-measure px-6 pt-22 pb-28 sm:px-8 sm:pt-32 sm:pb-36">
      <a href="/" aria-label="Home" className="inline-block no-underline">
        <Mark className="mb-10" />
      </a>

      <h1 className="mb-[1.2rem] font-medium tracking-[0.01em]">Reading</h1>
      <p className="mb-12 text-ink-muted">
        Things I read and kept, filed under the day I found them. Nothing here
        is a to-read pile — anything I didn't want gets deleted, so what's left
        is the whole answer to what I was thinking about that week.
      </p>

      {isOwner ? <AddLink /> : null}

      <Archive keeps={keeps} canEdit={isOwner} />

      <PeopleSection />

      <p className="mt-14 text-ink-muted">
        This used to be an app called{" "}
        <ProseLink href="/projects/sediment">Sediment</ProseLink>, which is
        still yours to use. I moved my own copy here because the links were the
        part I wanted in public.
      </p>

      <RadarNav current="reading" />
    </main>
  );
}
