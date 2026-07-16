import { Mark } from "@/components/mark";
import { ProseLink } from "@/components/prose-link";
import { Toc } from "@/components/toc";

/**
 * The site.
 *
 * It's an essay, not a grid of project cards, and the projects are links inside
 * the sentences that explain why they exist. That's the argument: the work only
 * means anything in the order it happened.
 *
 * Ported from the hand-written index.html. The prose is Nishil's and unchanged
 * — every id below is a real anchor that <Toc /> and old deep links point at.
 */

export default function Home() {
  return (
    <>
      <Toc />

      <main className="mx-auto max-w-measure px-6 pt-22 pb-28 sm:px-8 sm:pt-32 sm:pb-36 [&_p]:mb-[1.6rem] [&_p]:[hanging-punctuation:first]">
        {/* The mark, once, quiet, above the greeting that already says the
            name. It's the only amber on the page not carrying a link. */}
        <Mark className="mb-10" />

        <h1 className="mb-[1.6rem] font-medium tracking-[0.01em]">
          Hi, I’m Nishil Faldu.
        </h1>

        <p>
          A friend of mine says I’m a slightly different person every year, and
          she’s right. So this is less a list of things I’ve built and more the
          story of how I got here.
        </p>

        <p>
          I grew up barely touching computers. I used them to watch movies and
          play games that was about it. I’d never written a line of code. So
          when I got to the University of Cincinnati I picked math as my major,
          because it was the only thing I really liked and I wasn’t willing to
          fake interest in something I didn’t. I took a couple of programming
          courses on the side, Python and C++, just to keep the engineering
          doors open.
        </p>

        <p>
          Python didn’t click at all. I passed with an A by basically memorizing
          my way through it. I couldn’t have told you what a for loop did. Then
          around week seven of C++ we got to structs, and for some reason that
          was the lesson where everything fell into place. The next week was
          classes and objects and I just got it. I ended up building{" "}
          <ProseLink
            id="p-save-the-roadster"
            href="https://github.com/nishilfaldu/save-the-roadster"
          >
            a game in C++
          </ProseLink>{" "}
          for my final project. It was a pair project but I did most of it,
          because for the first time I actually wanted to.
        </p>

        <p>
          That summer I felt behind. A lot of my friends had been coding since
          the eleventh grade and I’d done none of it, so I spent the months on
          Coursera, some Java, more C++. Then I found machine learning, this
          perfect mix of code and math, and fell hard for it. I was handwriting
          notes in a notebook to understand it, working through{" "}
          <ProseLink
            id="p-ml-deep-learning-courses"
            href="https://github.com/nishilfaldu/ml-deep-learning-courses"
          >
            all the Andrew Ng courses
          </ProseLink>
          . Around then I trained{" "}
          <ProseLink
            id="p-bert-sentiment-pytorch"
            href="https://github.com/nishilfaldu/bert-sentiment-pytorch"
          >
            my first real model
          </ProseLink>
          , a small thing that learned to read the mood of a review, and
          watching it work felt like proof I was in the right place. So I
          switched my major to computer science for real.
        </p>

        <p>
          My first job came from one cold email. I wrote to the Digital
          Scholarship Center saying I’d taken these ML courses and wanted to
          work with them, and they hired me. I stayed a few years. (I still find
          work the same way, which is funny.)
        </p>

        <p>
          Those years I made things constantly, most of them just for the fun of
          it. There was a{" "}
          <ProseLink
            id="p-insite-factcheck"
            href="https://github.com/nishilfaldu/insite-factcheck"
          >
            fact checker
          </ProseLink>{" "}
          to catch COVID misinformation at a hackathon I was competing in, and a{" "}
          <ProseLink
            id="p-hackathon-stats-dashboard"
            href="https://github.com/nishilfaldu/hackathon-stats-dashboard"
          >
            stats dashboard
          </ProseLink>{" "}
          for another one I was helping run. I made three{" "}
          <ProseLink
            id="p-campaign-websites"
            href="https://github.com/nishilfaldu/campaign-websites"
          >
            campaign sites
          </ProseLink>{" "}
          for friends running for student government, one a year. My senior
          project was an{" "}
          <ProseLink
            id="p-eventure"
            href="https://github.com/nishilfaldu/eventure"
          >
            app for planning events
          </ProseLink>
          , built with a partner while the two of us figured out video calls for
          the first time. A class assignment turned into a{" "}
          <ProseLink
            id="p-alterna-canvas"
            href="https://github.com/nishilfaldu/alterna-canvas"
          >
            take on Canvas
          </ProseLink>{" "}
          where keeping up with coursework grew a small garden. Even my old{" "}
          <ProseLink
            id="p-coursework"
            href="https://github.com/nishilfaldu/coursework"
          >
            coursework
          </ProseLink>{" "}
          is still up, kept because I liked it. None of it was meant to be
          important, and somehow all of it taught me the most.
        </p>

        <p>
          After that came internships, then startups. I was the founding
          engineer at 7WEST, where I shipped a campus social app to 500+
          students across more than fifteen universities, and a K-12 learning
          platform used by around 6,000 accounts, mostly as the only engineer.
          Before AI could do it for me, I wrote{" "}
          <ProseLink
            id="p-cedar-lang"
            href="https://github.com/nishilfaldu/cedar-lang"
          >
            a small compiler in Go
          </ProseLink>{" "}
          from scratch, just to see if I could.
        </p>

        <p>
          Machine learning kept pulling me back the whole time. I trained a
          model to surface{" "}
          <ProseLink
            id="p-lda-models"
            href="https://github.com/nishilfaldu/lda-models"
          >
            the hidden themes
          </ProseLink>{" "}
          in a million news headlines. I built a{" "}
          <ProseLink
            id="p-easy-rag"
            href="https://github.com/nishilfaldu/easy-rag"
          >
            way to spin up chatbots
          </ProseLink>{" "}
          that actually know your own documents. At Tembo, working as a software
          engineer, I built a store where{" "}
          <ProseLink
            id="p-vector-search-ecommerce"
            href="https://github.com/nishilfaldu/vector-search-ecommerce"
          >
            search lives entirely inside the database
          </ProseLink>
          , the demo for a deep dive I was writing on their blog. One company’s
          take-home was a little{" "}
          <ProseLink
            id="p-smart-reviewer"
            href="https://github.com/nishilfaldu/smart-reviewer"
          >
            news reviewer
          </ProseLink>
          ; another’s had me send an{" "}
          <ProseLink
            id="p-neon-nerdsnipe"
            href="https://github.com/nishilfaldu/neon-nerdsnipe"
          >
            agent
          </ProseLink>{" "}
          to crack a login puzzle.
        </p>

        <p>
          These days I build a lot, and faster than I used to. Mostly I build to
          get rid of noise, because there are always too many threads in my head
          and I like quieting them.{" "}
          <ProseLink id="p-atlas" href="https://github.com/nishilfaldu/atlas">
            A tool
          </ProseLink>{" "}
          to catch the mistakes an AI makes in code, which taught me the better
          fix is to guide the design while it writes instead of checking after.{" "}
          <ProseLink
            id="p-sediment"
            href="https://github.com/nishilfaldu/sediment"
          >
            One place
          </ProseLink>{" "}
          to throw every bit of inspiration I find instead of leaving it
          scattered across five apps.{" "}
          <ProseLink
            id="p-mcp-servers"
            href="https://github.com/nishilfaldu/mcp-servers"
          >
            A few small servers
          </ProseLink>{" "}
          so an agent can reach into my calendar and inbox instead of me doing
          it by hand.{" "}
          <ProseLink
            id="p-reachcast"
            href="https://github.com/nishilfaldu/reachcast"
          >
            A Raycast extension
          </ProseLink>{" "}
          for the cold emails. Small things that take a mess and make it sit
          still.
        </p>

        <p>
          Plenty of it never shipped, and I’ve made peace with that. A{" "}
          <ProseLink id="p-pulse" href="https://github.com/nishilfaldu/pulse">
            game
          </ProseLink>{" "}
          where everyone gets the same single quest each day. A{" "}
          <ProseLink id="p-belle" href="https://github.com/nishilfaldu/belle">
            storefront
          </ProseLink>{" "}
          for a patisserie. Half-finished, most of them, and I built them to
          find out whether I could. That was enough.
        </p>

        <p>
          Outside of all this: I love stories, any kind, books, shows, short
          films, or someone just telling me about their day. And music gets me
          the most, whenever I put something on, I feel it all the way down. I
          write poetry sometimes. I’d play sports every single day if I could,
          any sport, I’m not picky. I think most plans should just be a
          spontaneous hang instead of a calendar invite. And I love love.
        </p>

        <p>If any of that resonates, say hi.</p>

        <p className="mt-14">
          <ProseLink nowrap href="/projects">
            Projects
          </ProseLink>{" "}
          ·{" "}
          <ProseLink nowrap href="https://x.com/FalduNishil">
            <span className="line-through decoration-1">Twitter</span> X
          </ProseLink>{" "}
          ·{" "}
          <ProseLink nowrap href="https://github.com/nishilfaldu">
            GitHub
          </ProseLink>{" "}
          ·{" "}
          <ProseLink nowrap href="https://www.linkedin.com/in/nishilfaldu">
            LinkedIn
          </ProseLink>
        </p>
      </main>
    </>
  );
}
