export const labStepHtml = `<figure class="stepstrip">
    <svg viewBox="0 0 570 178" role="img" aria-label="Three phases of a normal step: heel lands, arch squashes and foot rolls inward, push off from the big toe">
      <g font-family="var(--font-geist-mono), ui-monospace, Menlo, monospace" font-size="10" letter-spacing="0.06em" fill="var(--color-ink)">
        <g class="step-panel" data-beat="1" tabindex="0" role="button" aria-label="Beat 1: heel lands">
          <rect class="hit" x="10" y="4" width="170" height="170" rx="6"/>
          <line x1="10" y1="120" x2="160" y2="120" stroke="var(--color-ink)" stroke-width="2"/>
          <g transform="rotate(-14 40 118)">
            <path class="foot-body" d="M 30 118 C 26 92 34 66 52 60 C 66 55 76 62 80 76 C 84 92 100 104 122 108 C 138 111 148 114 148 118 Z" fill="color-mix(in srgb, var(--color-ink) 10%, transparent)" stroke="var(--color-ink)" stroke-width="2.5" stroke-linejoin="round"/>
          </g>
          <g stroke="var(--color-accent)" fill="var(--color-accent)"><line x1="38" y1="66" x2="38" y2="92" stroke-width="2.5"/><path d="M 38 102 L 32 90 L 44 90 Z"/></g>
          <text x="85" y="142" text-anchor="middle">1 · HEEL LANDS</text>
          <text class="step-caption" x="85" y="158" text-anchor="middle" fill="var(--color-ink-muted)" font-size="9">slightly on its outer side</text>
        </g>
        <g class="step-panel" data-beat="2" tabindex="0" role="button" aria-label="Beat 2: arch squashes">
          <rect class="hit" x="200" y="4" width="170" height="170" rx="6"/>
          <line x1="10" y1="120" x2="160" y2="120" stroke="var(--color-ink)" stroke-width="2" transform="translate(200,0)"/>
          <path class="foot-body" transform="translate(200,0)" d="M 30 118 C 26 92 34 66 52 60 C 66 55 76 62 80 76 C 84 92 100 104 122 108 C 138 111 148 114 148 118 Z" fill="color-mix(in srgb, var(--color-ink) 10%, transparent)" stroke="var(--color-ink)" stroke-width="2.5" stroke-linejoin="round"/>
          <path transform="translate(200,0)" d="M 66 112 C 78 104 96 104 108 112" fill="none" stroke="var(--color-ink)" stroke-width="2" stroke-dasharray="3 4"/>
          <g stroke="var(--color-ink)" fill="var(--color-ink)" transform="translate(200,0)"><line x1="87" y1="86" x2="87" y2="102" stroke-width="2.5"/><path d="M 87 110 L 81 99 L 93 99 Z"/></g>
          <text x="285" y="142" text-anchor="middle">2 · ARCH SQUASHES</text>
          <text class="step-caption" x="285" y="158" text-anchor="middle" fill="var(--color-ink-muted)" font-size="9">foot rolls inward a little</text>
        </g>
        <g class="step-panel" data-beat="3" tabindex="0" role="button" aria-label="Beat 3: push off">
          <rect class="hit" x="390" y="4" width="170" height="170" rx="6"/>
          <line x1="10" y1="120" x2="160" y2="120" stroke="var(--color-ink)" stroke-width="2" transform="translate(390,0)"/>
          <g transform="translate(390,0) rotate(16 130 118)">
            <path class="foot-body" d="M 30 118 C 26 92 34 66 52 60 C 66 55 76 62 80 76 C 84 92 100 104 122 108 C 138 111 148 114 148 118 Z" fill="color-mix(in srgb, var(--color-ink) 10%, transparent)" stroke="var(--color-ink)" stroke-width="2.5" stroke-linejoin="round"/>
          </g>
          <g stroke="var(--color-accent)" fill="var(--color-accent)" transform="translate(390,0)"><line x1="120" y1="112" x2="146" y2="112" stroke-width="2.5"/><path d="M 156 112 L 144 106 L 144 118 Z"/></g>
          <text x="475" y="142" text-anchor="middle">3 · PUSH OFF</text>
          <text class="step-caption" x="475" y="158" text-anchor="middle" fill="var(--color-ink-muted)" font-size="9">from the big-toe side</text>
        </g>
      </g>
    </svg>
  </figure>`;
