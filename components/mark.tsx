/**
 * The nishilfaldu.com mark: the monogram, and an amber dot.
 *
 * Not a placeholder any more — Nishil chose it. Lives here rather than inside a
 * docs page because a mark that only exists on the page documenting it isn't a
 * mark, it's an illustration.
 *
 * The dot is the only amber on the mark, which is the whole idea: Sunny's
 * warmth shows up as one deliberate spot of colour against a neutral, rather
 * than as a yellow interface. It sits on the baseline and tight to the `f` —
 * close enough to read as part of the word, like a full stop.
 */
export function Mark({
  size = 48,
  className,
}: {
  /** Cap height of the monogram in px. The dot scales with it. */
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-baseline text-gray-1000 ${className ?? ""}`}
      // The gap is optical, not gridded. A logo is one of the few places where
      // the 4px scale loses to the eye: the `f`'s terminal already carries
      // right-side bearing, so a true 4px gap reads as 6 or 7.
      style={{ gap: size * 0.04 }}
    >
      <span
        style={{
          fontSize: size,
          lineHeight: 1,
          fontWeight: 600,
          // Same negative tracking the heading roles use at this size — a
          // two-letter monogram is the most extreme case of "big text needs
          // less air between letters".
          letterSpacing: size * -0.04,
        }}
      >
        nf
      </span>
      <span
        aria-hidden="true"
        className="shrink-0 rounded-full bg-amber-700"
        style={{ width: size * 0.17, height: size * 0.17 }}
      />
    </span>
  );
}
