import { components, disabled, focusRing } from "@nishilfaldu/sunny";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Button, Input, ValidationDemo } from "./specimens";

export const metadata: Metadata = {
  title: "Components — Sunny",
  description:
    "Buttons and inputs, rendered live from the component contract. Every state is a token, and every state is contrast-checked.",
};

const VARIANTS = [
  ["primary", "The one thing this screen is for. At most one per view."],
  ["secondary", "Everything else that's a real action."],
  ["tertiary", "Low-stakes actions that shouldn't compete for attention."],
  ["accent", "Amber, and rarer than you'd like. See below."],
  ["error", "Destructive, and only when it's genuinely destructive."],
] as const;

const STATES = [
  ["Default", "Resting.", undefined],
  ["Hover", "The pointer is over it. Confirms it's a target.", "hover"],
  ["Active", "It's being pressed right now.", "active"],
  ["Disabled", "Present, explained, not usable.", "disabled"],
  ["Loading", "You pressed it and it's working.", "loading"],
] as const;

function Section({
  title,
  children,
  prose,
}: {
  title: string;
  prose: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section>
      <div className="max-w-measure">
        <h2 className="text-heading-24 text-gray-1000">{title}</h2>
        {prose}
      </div>
      {children}
    </section>
  );
}

export default function ComponentsPage() {
  return (
    <div className="flex flex-col gap-16">
      <section className="max-w-measure">
        <Link
          href="/design/system"
          className="text-label-13 text-gray-900 hover:text-gray-1000"
        >
          ← Sunny
        </Link>
        <h1 className="mt-4 text-heading-48 text-gray-1000">Components</h1>
        <p className="mt-4 text-copy-20 text-gray-900">
          Where the tokens stop being numbers and start being things you can
          press. Every button and field below is rendered from the component
          contract in{" "}
          <code className="text-label-13-mono text-gray-1000">
            tokens/components.ts
          </code>{" "}
          — no colour classes, no hand-written hex. If the contract were wrong,
          this page would look wrong.
        </p>
        <p className="mt-4 text-copy-16 text-gray-900">
          Hover them. Press them. Tab through them. States are the whole subject
          here, and a picture of a hover teaches nothing.
        </p>
      </section>

      <Section
        title="States"
        prose={
          <>
            <p className="mt-2 text-copy-16 text-gray-900">
              A control has five things to say, and it says them without words:
              I am here, you’re pointing at me, you’re pressing me, you can’t
              use me, I’m working. Miss one and the interface feels broken in a
              way people rarely report — they just click twice.
            </p>
            <p className="mt-4 text-copy-16 text-gray-900">
              Each state is a token, so each state is contrast-checked.{" "}
              <code className="text-label-13-mono text-gray-1000">
                pnpm contrast
              </code>{" "}
              holds hover and active to the same 4.5:1 bar as the resting state
              — a button that goes unreadable exactly when you’re about to press
              it is worse than one that never moved.
            </p>
          </>
        }
      >
        <div className="mt-6 border-gray-alpha-400 border-t">
          {STATES.map(([name, what, state]) => (
            <div
              key={name}
              className="flex flex-col gap-3 border-gray-alpha-400 border-b py-5 sm:flex-row sm:items-center sm:gap-6"
            >
              <div className="sm:w-44 sm:shrink-0">
                <div className="text-heading-16 text-gray-1000">{name}</div>
                <p className="text-copy-14 text-gray-900">{what}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary" state={state}>
                  Deploy
                </Button>
                <Button variant="secondary" state={state}>
                  Cancel
                </Button>
                <Button variant="accent" state={state}>
                  Star
                </Button>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 max-w-measure text-copy-14 text-gray-900">
          The rows above force each state on so you can compare them. The
          buttons still respond to your pointer, so the forced state and the
          real one can disagree — that’s the demo being honest, not a bug.
        </p>
      </Section>

      <Section
        title="Focus"
        prose={
          <>
            <p className="mt-2 text-copy-16 text-gray-900">
              Focus is the state most likely to get deleted, because whoever
              deletes it is using a mouse. Tab into the buttons below and you’ll
              see the ring; that ring is the entire interface for someone
              navigating by keyboard.
            </p>
            <p className="mt-4 text-copy-16 text-gray-900">
              It’s two layers: a 2px gap in the surface colour, then 2px of{" "}
              <code className="text-label-13-mono text-gray-1000">
                semantic.focus
              </code>
              . The gap is what keeps the ring legible when the control is
              itself a solid fill — without it, a blue ring on a blue button is
              just a slightly bigger blue button.
            </p>
            <p className="mt-4 text-copy-16 text-gray-900">
              It’s{" "}
              <code className="text-label-13-mono text-gray-1000">
                :focus-visible
              </code>
              , not{" "}
              <code className="text-label-13-mono text-gray-1000">:focus</code>,
              so it appears for the keyboard and stays out of the way of the
              mouse.
            </p>
          </>
        }
      >
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button variant="primary">Tab to me</Button>
          <Button variant="secondary">Then me</Button>
          <Button variant="accent">And me</Button>
          <Button variant="error">Finally me</Button>
        </div>
        <code className="mt-6 block max-w-measure break-all text-label-12-mono text-gray-900">
          {focusRing.light}
        </code>
      </Section>

      <Section
        title="Variants"
        prose={
          <>
            <p className="mt-2 text-copy-16 text-gray-900">
              Five, and the constraint is the feature: a variant answers “how
              important is this?”, so if everything is primary then nothing is.
              The honest test for a screen is whether a stranger can find the
              one button that matters in a second.
            </p>
            <p className="mt-4 text-copy-16 text-gray-900">
              Note that <span className="text-gray-1000">accent</span> is amber
              and <span className="text-gray-1000">primary</span> is near-black.
              Amber is the brand colour but it can’t be the default action —
              yellow at the saturation that makes it amber can’t also be dark
              enough to carry white text, so it leads with fills and lets the
              neutral do the work. Sunny is warm; it isn’t yellow.
            </p>
          </>
        }
      >
        <div className="mt-6 border-gray-alpha-400 border-t">
          {VARIANTS.map(([variant, what]) => (
            <div
              key={variant}
              className="flex flex-col gap-3 border-gray-alpha-400 border-b py-5 sm:flex-row sm:items-center sm:gap-6"
            >
              <code className="text-label-12-mono text-gray-900 sm:w-28 sm:shrink-0">
                {variant}
              </code>
              <div className="sm:w-24 sm:shrink-0">
                <Button variant={variant}>Action</Button>
              </div>
              <p className="text-copy-14 text-gray-900">{what}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Sizes"
        prose={
          <p className="mt-2 text-copy-16 text-gray-900">
            Three heights — 32, 40, 48 — and 40 is the default because it’s the
            one that’s comfortable to hit without dominating a form. Size is
            about density, not importance; a small button is not a lesser
            action, it’s a button in a tighter space.
          </p>
        }
      >
        <div className="mt-6 flex flex-wrap items-end gap-3">
          <Button variant="secondary" size="small">
            Small · 32
          </Button>
          <Button variant="secondary">Medium · 40</Button>
          <Button variant="secondary" size="large">
            Large · 48
          </Button>
        </div>
      </Section>

      <Section
        title="Input"
        prose={
          <p className="mt-2 text-copy-16 text-gray-900">
            The same heights as buttons, so the two line up when they sit side
            by side — which is most of the time. Placeholder text is{" "}
            <code className="text-label-13-mono text-gray-1000">gray-700</code>{" "}
            and is never a substitute for a label: it disappears the moment
            someone types, and a form you can’t re-read is a form you can’t
            check.
          </p>
        }
      >
        <div className="mt-6 flex max-w-sm flex-col gap-4">
          <Input size="small" placeholder="Small · 32" />
          <Input placeholder="Medium · 40" />
          <Input size="large" placeholder="Large · 48" />
          <Input state="disabled" placeholder="Disabled" />
        </div>
      </Section>

      <Section
        title="Validation"
        prose={
          <>
            <p className="mt-2 text-copy-16 text-gray-900">
              Type something that isn’t an email address and click away. The
              error appears on blur, not on the third keystroke — telling
              someone their half-typed address is invalid while they’re still
              typing it is technically true and completely useless.
            </p>
            <p className="mt-4 text-copy-16 text-gray-900">
              The message says what to do rather than what went wrong, and the
              field carries{" "}
              <code className="text-label-13-mono text-gray-1000">
                aria-invalid
              </code>{" "}
              plus{" "}
              <code className="text-label-13-mono text-gray-1000">
                aria-describedby
              </code>
              , so a screen reader gets the same explanation the red border is
              giving everyone else. Colour is never the only carrier.
            </p>
          </>
        }
      >
        <div className="mt-6">
          <ValidationDemo />
        </div>
      </Section>

      <Section
        title="Disabled"
        prose={
          <>
            <p className="mt-2 text-copy-16 text-gray-900">
              One disabled look for every control, because “you can’t use this”
              is one message and shouldn’t arrive in five different colours.
            </p>
            <p className="mt-4 text-copy-16 text-gray-900">
              It’s{" "}
              <code className="text-label-13-mono text-gray-1000">
                {disabled.textColor}
              </code>{" "}
              on{" "}
              <code className="text-label-13-mono text-gray-1000">
                {disabled.backgroundColor}
              </code>{" "}
              — deliberately the weakest pairing in Sunny that still clears the
              3:1 UI bar. Disabled text is exempt from the 4.5:1 minimum, and
              this is the one place where being harder to read is the message.
            </p>
            <p className="mt-4 text-copy-16 text-gray-900">
              The real rule isn’t about colour: a disabled control has to be
              explainable. If someone can’t tell why it’s dead, don’t disable it
              — leave it live and say what’s missing when they press it.
            </p>
          </>
        }
      >
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button variant="primary" state="disabled">
            Deploy
          </Button>
          <Button variant="secondary" state="disabled">
            Cancel
          </Button>
          <div className="w-48">
            <Input state="disabled" placeholder="Disabled" />
          </div>
        </div>
      </Section>

      <Section
        title="The contract"
        prose={
          <>
            <p className="mt-2 text-copy-16 text-gray-900">
              One component, as the tokens actually store it. References rather
              than literals, so you can trace where a colour came from — and so
              this page, the contrast audit and{" "}
              <code className="text-label-13-mono text-gray-1000">
                design.md
              </code>{" "}
              read the same source instead of three copies of it.
            </p>
            <p className="mt-4 text-copy-16 text-gray-900">
              The specimens above are rendered by handing exactly this object to
              a function that turns each reference into a CSS variable. There is
              no second definition of what a primary button looks like — which
              is why a wrong value here would show up as a wrong button rather
              than as a stale doc.
            </p>
          </>
        }
      >
        <div className="mt-6 max-w-measure overflow-x-auto">
          <table className="w-full border-gray-alpha-400 border-t text-left">
            <caption className="sr-only">
              The button-primary component contract
            </caption>
            <thead>
              <tr className="border-gray-alpha-400 border-b">
                <th className="py-3 pr-6 font-normal text-gray-900 text-label-12">
                  Property
                </th>
                <th className="py-3 font-normal text-gray-900 text-label-12">
                  Value
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(components["button-primary"]).map(
                ([prop, value]) => (
                  <tr key={prop} className="border-gray-alpha-400 border-b">
                    <td className="whitespace-nowrap py-2 pr-6 text-gray-1000 text-label-12-mono">
                      {prop}
                    </td>
                    <td className="py-2 text-gray-900 text-label-12-mono">
                      {String(value)}
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
        <p className="mt-4 max-w-measure text-copy-14 text-gray-900">
          The other {Object.keys(components).length - 1} components are in{" "}
          <a href="/design.md" className="text-link hover:text-link-hover">
            design.md
          </a>
          , generated from the same file.
        </p>
      </Section>
    </div>
  );
}
