"use client";

import { semantic } from "@nishilfaldu/sunny";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { allEntries, type Entry, isFile } from "@/lib/design-index";

type Destination = Entry & { href: string };

/** Only somewhere you can actually go belongs in a menu for going places. */
const DESTINATIONS = allEntries.filter(
  (e): e is Destination => e.href !== null,
);

function matches(entry: Entry, query: string): boolean {
  const haystack = [
    entry.title,
    entry.blurb,
    entry.group,
    ...(entry.keywords ?? []),
  ]
    .join(" ")
    .toLowerCase();
  // every word must appear, so a second word narrows the results rather than widening them
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word));
}

export function CommandMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listId = useId();
  const activeRef = useRef<HTMLLIElement>(null);
  const restoreFocusTo = useRef<HTMLElement | null>(null);

  const results = useMemo(
    () =>
      query ? DESTINATIONS.filter((e) => matches(e, query)) : DESTINATIONS,
    [query],
  );

  const openMenu = useCallback(() => {
    restoreFocusTo.current = document.activeElement as HTMLElement | null;
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
    restoreFocusTo.current?.focus();
  }, []);

  const go = useCallback(
    (entry: Destination) => {
      close();
      // markdown routes are files from a route handler, not app pages the router can push
      if (isFile(entry.href)) window.location.href = entry.href;
      else router.push(entry.href);
    },
    [close, router],
  );

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) close();
        else openMenu();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, openMenu, close]);

  // arrowing past the fold would otherwise leave the active row out of view
  // biome-ignore lint/correctness/useExhaustiveDependencies: `active` is what changed; the ref it moves is invisible to the rule
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const clamp = (i: number) =>
    results.length === 0 ? 0 : (i + results.length) % results.length;

  function onInputKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => clamp(i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => clamp(i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const entry = results[active];
      if (entry) go(entry);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={openMenu}
        className="flex h-8 items-center gap-2 rounded-sm border border-gray-alpha-400 pr-1.5 pl-2.5 text-gray-900 hover:text-gray-1000"
      >
        <span className="text-label-14">Search</span>
        <kbd className="rounded-[4px] bg-background-200 px-1.5 py-0.5 text-label-12-mono text-gray-900">
          ⌘K
        </kbd>
      </button>

      {/*
        Portaled to the body on purpose. The header sets `backdrop-blur`, and
        backdrop-filter makes an element a containing block for fixed-position
        descendants — so rendering the overlay in place pins `fixed inset-0` to
        the 56px header instead of the viewport, and only the header dims.
      */}
      {open &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]">
            {/* a real button, so dismissing works from the keyboard and needs no click-through trickery */}
            {/*
              scrim is theme-independent by design — see the token. Using
              gray-alpha here would flip to white in dark mode and wash the page
              out instead of dimming it.
            */}
            <button
              type="button"
              aria-label="Close search"
              onClick={close}
              className="fixed inset-0 backdrop-blur-[2px]"
              style={{ backgroundColor: semantic.light.scrim }}
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Search design"
              className="relative w-full max-w-xl overflow-hidden rounded-md border border-gray-alpha-400 bg-background-100 text-gray-1000 shadow-lg"
            >
              <input
                // biome-ignore lint/a11y/noAutofocus: a command menu that doesn't focus its own input is broken
                autoFocus
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                onKeyDown={onInputKeyDown}
                placeholder="Search design…"
                aria-label="Search design"
                role="combobox"
                aria-expanded="true"
                aria-controls={listId}
                aria-activedescendant={
                  results[active]
                    ? `${listId}-${results[active].id}`
                    : undefined
                }
                // the global focus ring is suppressed here on purpose: the input is
                // the only focusable thing in the menu, and the dialog's
                // overflow-hidden clips the ring into a stray blue underline
                className="w-full border-gray-alpha-400 border-b bg-transparent px-4 py-4 text-copy-16 text-gray-1000 outline-none placeholder:text-gray-700 focus-visible:shadow-none"
              />

              {results.length === 0 ? (
                <p className="px-4 py-8 text-center text-copy-14 text-gray-900">
                  Nothing matches “{query}”.
                </p>
              ) : (
                <ul
                  id={listId}
                  // biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: a ul with role=listbox is the ARIA combobox pattern this menu implements
                  role="listbox"
                  aria-label="Design pages"
                  className="max-h-80 overflow-y-auto p-2"
                >
                  {results.map((entry, i) => (
                    // biome-ignore lint/a11y/useKeyWithClickEvents: keyboard control lives on the input and moves aria-activedescendant, per the combobox pattern
                    // biome-ignore lint/a11y/useFocusableInteractive: options must not take focus — the pattern requires focus stay in the input
                    <li
                      key={entry.id}
                      ref={i === active ? activeRef : null}
                      id={`${listId}-${entry.id}`}
                      // biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: an li with role=option is what a listbox is made of
                      role="option"
                      aria-selected={i === active}
                      className={`flex cursor-pointer items-center gap-3 rounded-sm px-3 py-2.5 ${
                        i === active ? "bg-gray-200" : ""
                      }`}
                      onMouseMove={() => setActive(i)}
                      onClick={() => go(entry)}
                    >
                      <span className="shrink-0 text-label-14 text-gray-1000">
                        {entry.title}
                      </span>
                      <span className="truncate text-label-13 text-gray-900">
                        {entry.blurb}
                      </span>
                      <span className="ml-auto shrink-0 text-label-12-mono text-gray-700">
                        {entry.group}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
