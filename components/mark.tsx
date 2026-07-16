/**
 * The mark: the monogram, and an amber dot.
 *
 * Nishil's call, and settled. The dot is the only amber on the page, which is
 * the whole point: warmth as one deliberate spot against a neutral, rather than
 * a yellow interface.
 *
 * The dot sits on the baseline, tight to the `f`, close enough to read as part
 * of the word — like a full stop.
 */
export function Mark({
  size = 20,
  className,
}: {
  /** Cap height of the monogram in px. The dot scales with it. */
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-baseline text-ink ${className ?? ""}`}
      // Optical, not gridded. The `f`'s terminal already carries right-side
      // bearing, so a measured gap reads wider than it is.
      style={{ gap: size * 0.04 }}
    >
      <span
        style={{
          fontSize: size,
          lineHeight: 1,
          fontWeight: 500,
          // Two letters set large is the most extreme case of "big text needs
          // less air between the letters".
          letterSpacing: size * -0.04,
        }}
      >
        nf
      </span>
      <span
        aria-hidden="true"
        className="shrink-0 rounded-full bg-dot"
        style={{ width: size * 0.17, height: size * 0.17 }}
      />
    </span>
  );
}
