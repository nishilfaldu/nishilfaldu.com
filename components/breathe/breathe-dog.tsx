/**
 * A small dog that peeks — quiet line work, site amber for the nose only.
 */
export function BreatheDog({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 72 56"
      width="72"
      height="56"
      aria-hidden
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Dog</title>
      <path
        d="M14 38c2-10 8-18 18-20 6-1 12 1 16 5 3 3 8 4 12 2 1 6-1 14-6 18H22c-4-1-7-3-8-5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M22 20c-4-6-1-12 4-11 3 1 4 5 3 9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M42 18c2-6 7-8 10-5 2 3 0 8-3 10"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="30" cy="30" r="1.4" fill="currentColor" />
      <circle cx="42" cy="30" r="1.4" fill="currentColor" />
      <circle cx="36" cy="35" r="2.2" className="fill-dot" />
      <path
        d="M33 39c2 2 4 2 6 0"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M18 44c4 4 10 6 18 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}
