/**
 * The unlock page: one field, one button, no framework.
 *
 * It lives outside handlers.ts so the handler file stays about routing, and it
 * ships as a string rather than a React page because this route belongs to the
 * package, not to the app — it must render the same wherever the package is
 * wired up.
 */

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** `message` is shown above the field after a failed attempt. */
export function unlockFormHtml(message?: string): string {
  const notice = message ? `<p class="error">${escapeHtml(message)}</p>` : "";

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Unlock</title>
<style>
  :root { color-scheme: light dark; }
  body {
    margin: 0;
    min-height: 100vh;
    display: grid;
    place-items: center;
    font: 16px/1.5 ui-sans-serif, system-ui, sans-serif;
    background: Canvas;
    color: CanvasText;
  }
  form { width: min(22rem, 100% - 3rem); }
  h1 {
    margin: 0 0 1.5rem;
    font-size: 0.625rem;
    font-weight: 400;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    opacity: 0.6;
  }
  .error { margin: 0 0 1rem; font-size: 0.875rem; color: #b45309; }
  input, button {
    width: 100%;
    font: inherit;
    padding: 0.6rem 0;
    background: transparent;
    color: inherit;
  }
  input {
    border: 0;
    border-bottom: 1px solid currentColor;
    outline: none;
  }
  button {
    margin-top: 1.5rem;
    border: 1px solid currentColor;
    border-radius: 4px;
    padding: 0.6rem;
    cursor: pointer;
  }
</style>
</head>
<body>
<form method="post">
  <h1>Access code</h1>
  ${notice}
  <input
    type="password"
    name="code"
    autocomplete="one-time-code"
    autofocus
    aria-label="Access code"
  >
  <button type="submit">Unlock</button>
</form>
</body>
</html>`;
}
