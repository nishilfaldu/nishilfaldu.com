"use client";

import {
  components,
  cssVar,
  disabled as disabledToken,
  fontStacks,
  type TypeName,
  typography,
} from "@nishilfaldu/sunny";
import { type CSSProperties, useId, useState } from "react";

type Spec = Record<string, string | number>;

/** Pull `button-14` out of `{typography.button-14}`. */
function typeNameOf(ref: string): TypeName {
  return ref.slice(1, -1).split(".")[1] as TypeName;
}

function typeStyle(ref: string): CSSProperties {
  const t = typography[typeNameOf(ref)];
  return {
    fontFamily: fontStacks[t.fontFamily],
    fontSize: t.fontSize,
    lineHeight: `${t.lineHeight}px`,
    fontWeight: t.fontWeight,
    letterSpacing:
      "letterSpacing" in t && t.letterSpacing !== undefined
        ? `${t.letterSpacing}px`
        : undefined,
  };
}

/**
 * Turns a component's contract into the style it describes. Colours go through
 * `cssVar` rather than `resolve` so the specimen flips with the reader's theme
 * instead of freezing whichever one the server happened to render.
 */
function styleOf(spec: Spec): CSSProperties {
  const s: CSSProperties = {};
  if (spec.backgroundColor)
    s.backgroundColor = cssVar(String(spec.backgroundColor));
  if (spec.textColor) s.color = cssVar(String(spec.textColor));
  if (spec.borderColor)
    s.border = `1px solid ${cssVar(String(spec.borderColor))}`;
  if (spec.rounded) s.borderRadius = cssVar(String(spec.rounded));
  if (spec.padding) s.padding = String(spec.padding);
  if (spec.height) s.height = Number(spec.height);
  if (spec.shadow) s.boxShadow = cssVar(String(spec.shadow));
  if (spec.typography) Object.assign(s, typeStyle(String(spec.typography)));
  return s;
}

/**
 * A button rendered from `components[variant]` and nothing else — no Tailwind
 * colour classes, no hand-written hex. If the contract is wrong, this looks
 * wrong, which is the only way a docs page can be evidence rather than a claim.
 */
export function Button({
  variant,
  size,
  state,
  children,
}: {
  variant: "primary" | "secondary" | "tertiary" | "accent" | "error";
  size?: "small" | "large";
  /** Forces a state on, for the specimens that have to show all of them at once. */
  state?: "hover" | "active" | "disabled" | "loading";
  children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const spec = components[`button-${variant}`] as Spec;
  const sizeSpec = size ? (components[`button-${size}`] as Spec) : undefined;
  const isDisabled = state === "disabled";
  const isLoading = state === "loading";

  const showActive = state === "active" || pressed;
  const showHover = state === "hover" || (hovered && !pressed);

  const style: CSSProperties = {
    ...styleOf(spec),
    ...(sizeSpec ? styleOf(sizeSpec) : {}),
  };

  if (isDisabled) {
    style.backgroundColor = cssVar(disabledToken.backgroundColor);
    style.color = cssVar(disabledToken.textColor);
    style.cursor = disabledToken.cursor;
    if (spec.borderColor)
      style.border = `1px solid ${cssVar(disabledToken.borderColor)}`;
  } else {
    if (showActive && spec.activeBackgroundColor)
      style.backgroundColor = cssVar(String(spec.activeBackgroundColor));
    else if (showHover && spec.hoverBackgroundColor)
      style.backgroundColor = cssVar(String(spec.hoverBackgroundColor));

    if (showActive && spec.activeBorderColor)
      style.border = `1px solid ${cssVar(String(spec.activeBorderColor))}`;
    else if (showHover && spec.hoverBorderColor)
      style.border = `1px solid ${cssVar(String(spec.hoverBorderColor))}`;
  }

  return (
    <button
      type="button"
      disabled={isDisabled || isLoading}
      aria-busy={isLoading || undefined}
      style={style}
      className="inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors duration-state"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setPressed(false);
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
    >
      {isLoading && <Spinner />}
      {children}
    </button>
  );
}

/**
 * `currentColor` so the spinner is whatever the label is, on every variant, for
 * free. `duration-overlay` is the motion token — 300ms reads as "working"
 * rather than "panicking".
 */
function Spinner() {
  return (
    <svg
      className="size-3.5 animate-spin motion-reduce:animate-none"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="8"
        cy="8"
        r="6.5"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.25"
      />
      <path
        d="M8 1.5a6.5 6.5 0 0 1 6.5 6.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Input({
  size,
  state,
  placeholder = "you@example.com",
  invalid,
}: {
  size?: "small" | "large";
  state?: "disabled";
  placeholder?: string;
  invalid?: boolean;
}) {
  const spec = components[invalid ? "input-error" : "input"] as Spec;
  const sizeSpec = size ? (components[`input-${size}`] as Spec) : undefined;
  const isDisabled = state === "disabled";

  const style: CSSProperties = {
    ...styleOf(spec),
    ...(sizeSpec ? styleOf(sizeSpec) : {}),
    width: "100%",
  };

  if (isDisabled) {
    style.backgroundColor = cssVar(disabledToken.backgroundColor);
    style.color = cssVar(disabledToken.textColor);
    style.cursor = disabledToken.cursor;
    style.border = `1px solid ${cssVar(disabledToken.borderColor)}`;
  }

  return (
    <input
      type="text"
      disabled={isDisabled}
      aria-invalid={invalid || undefined}
      placeholder={placeholder}
      style={style}
      className="placeholder:text-gray-700 disabled:placeholder:text-gray-700"
    />
  );
}

/**
 * The one specimen that can't be a picture: a real field with a real error,
 * because the thing worth learning is *when* the message appears, not what
 * colour it is. Blur-then-validate — never while they're still typing.
 */
export function ValidationDemo() {
  const id = useId();
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);

  const invalid = touched && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value);

  return (
    <div className="flex max-w-xs flex-col gap-2">
      <label htmlFor={id} className="text-label-13 text-gray-900">
        Email
      </label>
      <input
        id={id}
        type="email"
        value={value}
        placeholder="you@example.com"
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? `${id}-error` : undefined}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => setTouched(true)}
        style={{
          ...styleOf(components[invalid ? "input-error" : "input"] as Spec),
          width: "100%",
        }}
        className="placeholder:text-gray-700"
      />
      {invalid && (
        <p id={`${id}-error`} className="text-copy-14 text-error">
          Enter an email address, like you@example.com.
        </p>
      )}
    </div>
  );
}
