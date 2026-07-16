export const shoeGuideBodyHtml = `<!-- shared defs: wet-paper filters -->
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <defs>
    <filter id="wet" x="-20%" y="-20%" width="140%" height="140%">
      <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="3" seed="2" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <filter id="wetlite" x="-20%" y="-20%" width="140%" height="140%">
      <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="5" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
  </defs>
</svg>

<div class="wrap">

<!-- ================= HERO ================= -->
<header class="hero">
  <p class="masthead"><b>Tinkerletter</b> · July 2026</p>
  <h1>The Shoe Buyer's <em>Field Guide</em></h1>
  <p class="hero-sub">Your shoes already know something about your body that you probably don't.<br>Let's see if you can read it.</p>
  </header>

<!-- ================= INTRO ================= -->
<!-- ================= ONE STEP ================= -->
<section class="scene reveal">
  <h2 class="section-title">A step, slowed down</h2>
  <p class="moment" style="margin-top:0">I went down this rabbit hole because I wanted to make a better buying decision. It starts with the most ordinary thing you do all day:</p>

  <figure class="stepstrip" style="margin:22px 0">
    <svg viewBox="0 0 570 170" role="img" aria-label="Three phases of a normal step: heel lands, arch squashes and foot rolls inward, push off from the big toe">
      <g font-family="ui-monospace,Menlo,monospace" font-size="10" letter-spacing="1" fill="#171717">
        <g class="step-panel" data-beat="1" tabindex="0" role="button" aria-label="Beat 1: heel lands">
          <rect class="hit" x="10" y="0" width="170" height="170" rx="4"/>
          <line x1="10" y1="120" x2="160" y2="120" stroke="#171717" stroke-width="2"/>
          <g transform="rotate(-14 40 118)">
            <path class="foot-body" d="M 30 118 C 26 92 34 66 52 60 C 66 55 76 62 80 76 C 84 92 100 104 122 108 C 138 111 148 114 148 118 Z" fill="rgba(23,23,23,0.08)" stroke="#171717" stroke-width="2.5" stroke-linejoin="round"/>
          </g>
          <g stroke="#aa4d00" fill="#aa4d00"><line x1="38" y1="66" x2="38" y2="92" stroke-width="2.5"/><path d="M 38 102 L 32 90 L 44 90 Z"/></g>
          <text x="85" y="142" text-anchor="middle">1 · HEEL LANDS</text>
          <text x="85" y="156" text-anchor="middle" fill="#4d4d4d" font-size="9">slightly on its outer side</text>
        </g>
        <g class="step-panel" data-beat="2" tabindex="0" role="button" aria-label="Beat 2: arch squashes">
          <rect class="hit" x="200" y="0" width="170" height="170" rx="4"/>
          <line x1="10" y1="120" x2="160" y2="120" stroke="#171717" stroke-width="2" transform="translate(200,0)"/>
          <path class="foot-body" transform="translate(200,0)" d="M 30 118 C 26 92 34 66 52 60 C 66 55 76 62 80 76 C 84 92 100 104 122 108 C 138 111 148 114 148 118 Z" fill="rgba(23,23,23,0.08)" stroke="#171717" stroke-width="2.5" stroke-linejoin="round"/>
          <path transform="translate(200,0)" d="M 66 112 C 78 104 96 104 108 112" fill="none" stroke="#171717" stroke-width="2" stroke-dasharray="3 4"/>
          <g stroke="#171717" fill="#171717" transform="translate(200,0)"><line x1="87" y1="86" x2="87" y2="102" stroke-width="2.5"/><path d="M 87 110 L 81 99 L 93 99 Z"/></g>
          <text x="285" y="142" text-anchor="middle">2 · ARCH SQUASHES</text>
          <text x="285" y="156" text-anchor="middle" fill="#171717" font-size="9">foot rolls inward a little</text>
        </g>
        <g class="step-panel" data-beat="3" tabindex="0" role="button" aria-label="Beat 3: push off">
          <rect class="hit" x="390" y="0" width="170" height="170" rx="4"/>
          <line x1="10" y1="120" x2="160" y2="120" stroke="#171717" stroke-width="2" transform="translate(390,0)"/>
          <g transform="translate(390,0) rotate(16 130 118)">
            <path class="foot-body" d="M 30 118 C 26 92 34 66 52 60 C 66 55 76 62 80 76 C 84 92 100 104 122 108 C 138 111 148 114 148 118 Z" fill="rgba(23,23,23,0.08)" stroke="#171717" stroke-width="2.5" stroke-linejoin="round"/>
          </g>
          <g stroke="#aa4d00" fill="#aa4d00" transform="translate(390,0)"><line x1="120" y1="112" x2="146" y2="112" stroke-width="2.5"/><path d="M 156 112 L 144 106 L 144 118 Z"/></g>
          <text x="475" y="142" text-anchor="middle">3 · PUSH OFF</text>
          <text x="475" y="156" text-anchor="middle" fill="#4d4d4d" font-size="9">from the big-toe side</text>
        </g>
      </g>
    </svg>
  </figure>

  </section>

<!-- ================= YOUR ARCH ================= -->
<section class="scene reveal" id="sec-arch" data-skill="arch">
  <h2 class="section-title">Your arch</h2>

  <div class="moment">
    <p>Wet your foot, step on a paper bag with your full weight. Where the foot pressed down, the paper is wet. The dry patch on the inside is your arch — the part that stayed lifted.</p>
    <p>Drag the slider — then try it on real paper if you want.</p>
  </div>

  <div class="archlab">
    <figure class="plate archlab-print">
      <svg id="lab-print" viewBox="0 0 120 260" role="img" aria-label="Interactive wet footprint whose arch band changes with the slider"></svg>
      <figcaption class="plate-label">the print — drag the slider</figcaption>
    </figure>
    <div>
      <div class="arch-reading" id="arch-reading" aria-live="polite"></div>
      <div class="arch-sub" id="arch-sub"></div>
      <div class="slider-block">
        <label for="arch-slider">Arch height</label>
        <input type="range" id="arch-slider" min="0" max="100" value="50" aria-describedby="arch-reading">
        <div class="slider-scale"><span>Flat</span><span>Neutral</span><span>High</span></div>
        <div class="slider-marks">
          <span class="mark" style="left:50%">most people land here</span>
        </div>
      </div>
      </div>
  </div>

  </section>

<!-- ================= YOUR OLD SOLES ================= -->
<section class="scene reveal" id="sec-soles" data-skill="wear">
  <h2 class="section-title">Your old soles</h2>

  <div class="moment">
    <p>Here’s a common pattern: a running shoe worn for court sports. Tap a zone.</p>
  </div>

  <div class="wearlab">
    <figure class="plate">
      <svg id="sole-map" viewBox="0 0 150 320" role="group" aria-label="Outsole wear map of the old shoe, five inspectable zones"></svg>
      <figcaption class="plate-label">example wear map · tap each zone</figcaption>
    </figure>
    <div class="wear-detail" id="wear-detail" aria-live="polite"></div>
  </div>

  <figure class="exhibit case-panel">
    <svg viewBox="0 0 560 240" role="img" aria-label="Diagram of a lightweight running shoe with heavy toe wear but clean side edges">
      <g font-family="ui-monospace,Menlo,monospace" font-size="9" fill="#4d4d4d" letter-spacing="1">
        <text x="280" y="18" text-anchor="middle" fill="#171717" font-size="10">CASE STUDY · RUNNING SHOE · COURT-SPORT WEEK</text>
      </g>
      <g stroke="#171717" stroke-width="2.5" fill="none" stroke-linejoin="round">
        <path d="M 60 170 C 60 158 80 152 120 152 L 400 152 C 430 152 445 158 448 168 C 450 176 440 180 400 180 L 120 180 C 85 180 60 176 60 170 Z" fill="rgba(28,40,47,0.05)"/>
        <path d="M 95 152 C 100 110 130 82 175 74 C 220 66 255 82 285 108 C 315 132 355 145 395 148"/>
        <path d="M 175 74 C 195 88 205 112 208 138"/>
        <path d="M 395 148 C 420 150 440 156 445 166"/>
      </g>
      <g fill="rgba(23,23,23,0.45)" stroke="#aa4d00" stroke-width="1.5">
        <path d="M 200 74 C 230 70 270 78 295 95 C 310 108 318 125 320 140 L 195 140 C 192 118 190 92 200 74 Z"/>
      </g>
      <g font-family="ui-monospace,Menlo,monospace" font-size="8" fill="#aa4d00" letter-spacing="1">
        <text x="258" y="112" text-anchor="middle">TOE BUMPER + MESH</text>
        <text x="258" y="124" text-anchor="middle">dragged-toe wear</text>
      </g>
      <rect x="48" y="188" width="120" height="36" rx="2" fill="#fff" stroke="#171717" stroke-width="1.5"/>
      <text x="108" y="204" text-anchor="middle" font-family="ui-monospace,Menlo,monospace" font-size="8" fill="#171717">INNER EDGE</text>
      <text x="108" y="216" text-anchor="middle" font-family="ui-monospace,Menlo,monospace" font-size="8" fill="#4d4d4d">relatively clean</text>
      <rect x="392" y="188" width="120" height="36" rx="2" fill="#fff" stroke="#171717" stroke-width="1.5"/>
      <text x="452" y="204" text-anchor="middle" font-family="ui-monospace,Menlo,monospace" font-size="8" fill="#171717">OUTER EDGE</text>
      <text x="452" y="216" text-anchor="middle" font-family="ui-monospace,Menlo,monospace" font-size="8" fill="#4d4d4d">relatively clean</text>
      <rect x="220" y="188" width="120" height="36" rx="2" fill="#fff" stroke="#4d4d4d" stroke-width="1.5"/>
      <text x="280" y="204" text-anchor="middle" font-family="ui-monospace,Menlo,monospace" font-size="8" fill="#4d4d4d">HEEL</text>
      <text x="280" y="216" text-anchor="middle" font-family="ui-monospace,Menlo,monospace" font-size="8" fill="#4d4d4d">even, neutral</text>
    </svg>
    <figcaption><b>Wrong shoe for the sport.</b> Heavy damage up front from lunges and stops. Edges and heel stay clean — a neutral stride in a shoe built for straight-ahead miles.</figcaption>
  </figure>

  <p style="margin-top:26px">Now read yours: inner edge worn at toe and heel → inward roll. Outer edge, front to back → outer-edge loading. Even forefoot, balanced heel → neutral. Front wrecked but edges clean → your gait is probably fine; the sport ate the shoe.</p>

  </section>

<!-- ================= PRONATION ================= -->
<section class="scene reveal" id="sec-roll" data-skill="stride">
  <h2 class="section-title">The inward roll</h2>

  <div class="moment">
    <p>Flip between the three tilts until one matches your wear:</p>
  </div>

  <div class="pronlab">
    <div class="pron-tabs" role="tablist" aria-label="Ankle tilt after landing">
      <button role="tab" id="ptab-sup" aria-selected="false">Tips outward</button>
      <button role="tab" id="ptab-neu" aria-selected="true">Stays level</button>
      <button role="tab" id="ptab-over" aria-selected="false">Tips inward</button>
    </div>
    <div class="pron-body">
      <div class="pron-cell">
        <h5>Left heel, seen from behind</h5>
        <svg id="pron-leg" viewBox="0 0 200 220" aria-hidden="true"></svg>
      </div>
      <div class="pron-cell">
        <h5>Same foot's sole, after years</h5>
        <svg id="pron-sole" viewBox="0 0 150 320" aria-hidden="true"></svg>
      </div>
      <div class="pron-cell txt" id="pron-text" aria-live="polite"></div>
    </div>
  </div>

  <div class="moment">
    <p>That little inward roll after landing has a name: <strong>pronation</strong>. It's supposed to happen — it's your arch absorbing the landing. Rolls too far → <strong>overpronation</strong>. Barely rolls → <strong>supination</strong>. The entire corrective-shoe aisle is built around those two words — and you can now tell from your own soles whether either one applies to you.</p>
  </div>

  </section>

<!-- ================= THE STAKES ================= -->
<section class="scene reveal" id="sec-fascia" data-skill="fascia">
  <h2 class="section-title">There's a cable under your foot</h2>

  <div class="moment">
    <p>Cross one ankle over the other knee, pull your toes back toward your shin, and press the sole just in front of the heel — that tight band is the plantar fascia, holding the arch up like a bowstring holds a bow.</p>
  </div>

  <div class="moment">
    <p>Every step stretches it:</p>
  </div>

  <div class="fascia">
    <svg viewBox="0 0 560 260" role="img" aria-label="Cutaway diagram of a foot showing the plantar fascia as a bowstring from heel to toes, with the arch above it">
      <line x1="20" y1="230" x2="540" y2="230" stroke="#4d4d4d" stroke-width="1.5" stroke-dasharray="6 5"/>
      <path d="M 80 228 C 66 210 62 178 84 130 C 100 96 128 72 170 66 C 200 62 224 74 240 100 C 258 128 290 160 340 180 C 390 198 448 204 490 208 C 512 210 520 218 518 224 C 516 230 500 230 480 230 L 100 230 C 88 230 84 230 80 228 Z"
        fill="rgba(23,23,23,0.06)" stroke="#171717" stroke-width="2.5"/>
      <ellipse cx="108" cy="196" rx="26" ry="22" fill="rgba(23,23,23,0.1)" stroke="#171717" stroke-width="1.5"/>
      <ellipse cx="440" cy="212" rx="30" ry="12" fill="rgba(23,23,23,0.1)" stroke="#171717" stroke-width="1.5"/>
      <path d="M 130 214 C 200 168 300 168 420 206" fill="none" stroke="#171717" stroke-width="2" stroke-dasharray="4 5"/>
      <path d="M 112 218 L 452 220" stroke="#aa4d00" stroke-width="5" stroke-linecap="round"/>
      <g stroke="#171717" stroke-width="2" fill="#171717">
        <line x1="240" y1="40" x2="240" y2="86"/>
        <path d="M 240 96 L 233 82 L 247 82 Z"/>
      </g>
      <g font-family="ui-monospace,Menlo,monospace" font-size="11" letter-spacing="1">
        <text x="240" y="30" text-anchor="middle" fill="#171717">BODY WEIGHT, EVERY STEP</text>
        <text x="108" y="160" text-anchor="middle" fill="#171717">HEEL BONE</text>
        <text x="108" y="173" text-anchor="middle" fill="#4d4d4d" font-size="9">(where it hurts)</text>
        <text x="270" y="150" text-anchor="middle" fill="#171717">THE ARCH — THE BOW</text>
        <text x="282" y="250" text-anchor="middle" fill="#aa4d00">PLANTAR FASCIA — THE BOWSTRING</text>
        <text x="440" y="190" text-anchor="middle" fill="#171717">BALL</text>
      </g>
    </svg>
    <div class="fascia-facts">
      <div class="ffact"><b>The morning tell</b>Sharp heel pain on first steps after waking, easing as you move.</div>
      <div class="ffact"><b>Who it hunts</b>Arch extremes, worn-out shoes, high-impact sports, all-day standing.</div>
      <div class="ffact"><b>The lever you control</b>Shoes matched to your foot and sport — replaced before the foam dies.</div>
    </div>
  </div>

  <div class="moment">
    <p>When that bowstring gets overworked — arch extremes, dead foam, the wrong shoe for the job — it complains loudest on your first steps out of bed. That injury has a name you've probably heard: <strong>plantar fasciitis</strong>. Fresh, well-matched shoes and a break from impact are the first-line fix; if sharp morning heel pain persists for weeks, that's a podiatrist visit, not a shoe purchase.</p>
  </div>

  </section>

<!-- ================= THE MATCH ================= -->
<section class="scene reveal" id="sec-week" data-skill="week">
  <h2 class="section-title">One shoe, two jobs</h2>

  <div class="moment">
    <p>Here’s the part that actually decided my buy. Court sports ask a shoe to survive sideways force — cuts, stops, lunges. Running asks it to survive straight-down force, thousands of times in a row. Those briefs fight each other. Soft and tall for miles tips over on a hard cut. Low and braced for the court is stiff and heavy on a run.</p>
    <p>So everyday sneakers aren’t court shoes. A running shoe isn’t a squash or tennis shoe. Standing all day is closer to the running problem than the court problem. And a “do-everything” pair usually isn’t a compromise — it’s mediocre at both.</p>
    <p>That was the whole rabbit hole: match the shoe to your foot <em>and</em> to your week. Not the wall of boxes.</p>
  </div>
</section>

<footer>
  <span class="sig">Tinkerletter</span> · The Shoe Buyer’s Field Guide
</footer>`;
