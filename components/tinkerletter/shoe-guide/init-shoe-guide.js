/**
 * Wire shoe-guide interactives inside a lab root.
 * Each block no-ops when its DOM isn't present — labs mount one toy at a time.
 */
export function initShoeGuide(root) {
  if (!root || root.dataset.shoeGuideReady === "1") return;
  root.dataset.shoeGuideReady = "1";

  function ink() {
    return (
      getComputedStyle(root).getPropertyValue("--color-ink").trim() || "#171717"
    );
  }
  function muted() {
    return (
      getComputedStyle(root).getPropertyValue("--color-ink-muted").trim() ||
      "#4d4d4d"
    );
  }
  function accent() {
    return (
      getComputedStyle(root).getPropertyValue("--color-accent").trim() ||
      "#aa4d00"
    );
  }

  function el(id) {
    return root.querySelector("#" + CSS.escape(id));
  }

  /* t: 0 = flat (full midfoot band) … 1 = high (band nearly gone) */
  function footprintSVG(t, opts) {
    opts = opts || {};
    var color = opts.color || ink();
    var filt = opts.lite ? "url(#wetlite)" : "url(#wet)";
    var mirror = opts.mirror
      ? '<g transform="translate(120,0) scale(-1,1)">'
      : "<g>";
    var inset = 4 + t * 50;
    var mx = 82 - inset;
    var band =
      "M 40 112 C 34 140 35 166 42 194 L 78 197 " +
      "C " +
      mx +
      " 172 " +
      mx +
      " 140 80 116 Z";
    var toes =
      '<ellipse cx="86" cy="34" rx="11" ry="13"/>' +
      '<circle cx="66" cy="30" r="7.5"/><circle cx="50" cy="33" r="6.5"/>' +
      '<circle cx="37" cy="39" r="6"/><circle cx="27" cy="48" r="5.5"/>';
    var forefoot =
      '<path d="M 28 78 C 26 56 40 48 60 47 C 82 46 96 56 95 78 C 94 102 82 116 60 117 C 42 118 30 100 28 78 Z"/>';
    var heel = '<ellipse cx="61" cy="222" rx="24" ry="31"/>';
    return (
      mirror +
      '<g fill="' +
      color +
      '" opacity="0.88" filter="' +
      filt +
      '">' +
      toes +
      forefoot +
      '<path d="' +
      band +
      '"/>' +
      heel +
      "</g></g>"
    );
  }

  /* Optional trail / fieldguide prints (only in full-page markup) */
  ["trail-1", "trail-3", "trail-5"].forEach(function (id) {
    var node = el(id);
    if (node) node.innerHTML = footprintSVG(0.62, { lite: true });
  });
  ["trail-2", "trail-4"].forEach(function (id) {
    var node = el(id);
    if (node)
      node.innerHTML = footprintSVG(0.5, { lite: true, mirror: true });
  });
  var miniLeft = el("mini-left");
  var miniRight = el("mini-right");
  if (miniLeft) miniLeft.innerHTML = footprintSVG(0.62, { lite: true });
  if (miniRight)
    miniRight.innerHTML = footprintSVG(0.5, { lite: true, mirror: true });
  var fgFlat = el("fg-flat");
  var fgMed = el("fg-med");
  var fgHigh = el("fg-high");
  if (fgFlat) fgFlat.innerHTML = footprintSVG(0.04, { lite: true, color: muted() });
  if (fgMed) fgMed.innerHTML = footprintSVG(0.5, { lite: true });
  if (fgHigh)
    fgHigh.innerHTML = footprintSVG(0.94, { lite: true, color: muted() });

  /* ============ wet-print slider ============ */
  var labPrint = el("lab-print");
  var reading = el("arch-reading");
  var archSub = el("arch-sub");
  var slider = el("arch-slider");
  if (labPrint && reading && archSub && slider) {
    function labels(t) {
      if (t < 0.22)
        return [
          "Flat / low arch",
          "wet edge to edge — the arch presses flat on the ground",
        ];
      if (t < 0.42)
        return [
          "Medium-low arch",
          "a dry patch appears — the arch is starting to lift",
        ];
      if (t < 0.6)
        return [
          "Medium arch",
          "the half print — a lifted arch that still squashes a little on each step",
        ];
      if (t < 0.8)
        return [
          "Medium-high arch",
          "a bigger dry patch — less of the foot touches down",
        ];
      return [
        "High arch",
        "heel and ball, barely connected — an arch too stiff to press down",
      ];
    }
    function renderLab() {
      var t = slider.value / 100;
      labPrint.innerHTML = footprintSVG(t);
      var l = labels(t);
      reading.textContent = l[0];
      archSub.textContent = l[1];
    }
    slider.addEventListener("input", renderLab);
    renderLab();
  }

  var wetGood = el("wet-good");
  var wetBad = el("wet-bad");
  if (wetGood) wetGood.innerHTML = footprintSVG(0.52, { lite: true });
  if (wetBad)
    wetBad.innerHTML = footprintSVG(0.08, { lite: true, color: muted() });

  /* ============ outsole wear map ============ */
  var ZONES = [
    {
      id: "toe",
      name: "Toe bumper & mesh",
      wear: 5,
      hot: true,
      verdict: "wear 5/5 — heavy",
      text: "Nobody wears a toe out by walking or running in straight lines — this is dragged-toe wear: lunges, serves, kicking. It means your sport is eating the shoe, not that your gait is off.",
      shape:
        '<path d="M 38 12 C 60 2 92 2 112 14 C 118 20 120 30 119 40 L 31 42 C 30 30 32 18 38 12 Z"/>',
    },
    {
      id: "forefoot",
      name: "Forefoot tread",
      wear: 3,
      hot: false,
      verdict: "wear 3/5 — worked hard, worked evenly",
      text: "Even wear across the whole ball of the foot is the healthy default — push-offs in every direction, none favored. Wear piled up on the inner half instead is an overpronation hint.",
      shape:
        '<path d="M 31 46 L 119 44 C 121 70 118 96 112 116 L 40 118 C 33 96 30 70 31 46 Z"/>',
    },
    {
      id: "medial",
      name: "Inner (medial) edge",
      wear: 1,
      hot: false,
      verdict: "wear 1/5 — clean",
      text: "The overpronation stripe. A foot rolling too far inward grinds this edge down, at toe and heel. Clean edges mean the inward roll stops where it should.",
      shape:
        '<path d="M 112 120 C 118 150 118 185 113 215 L 96 214 C 100 184 101 150 98 122 Z"/>',
    },
    {
      id: "lateral",
      name: "Outer (lateral) edge",
      wear: 2,
      hot: false,
      verdict: "wear 2/5 — light, explainable",
      text: "A little scuffing here is normal — every heel lands slightly to the outside before rolling in. Heavy wear along this whole edge, front to back, is the supination signature.",
      shape:
        '<path d="M 40 122 C 36 150 36 185 42 215 L 58 214 C 54 184 53 150 55 122 Z"/>',
    },
    {
      id: "heel",
      name: "Heel strike zone",
      wear: 2,
      hot: false,
      verdict: "wear 2/5 — flat, even, boring",
      text: "A heel worn level across its whole width is the single cleanest sign of a neutral landing. Worn to one side — or foam collapsed sideways above it — means your ankle is tipping.",
      shape:
        '<path d="M 43 219 L 111 219 C 114 245 108 275 94 292 C 86 300 66 300 58 292 C 45 276 40 245 43 219 Z"/>',
    },
  ];
  var WEAR_FILL = {
    5: "color-mix(in srgb, var(--color-ink) 72%, transparent)",
    3: "color-mix(in srgb, var(--color-ink) 45%, transparent)",
    2: "color-mix(in srgb, var(--color-ink) 28%, transparent)",
    1: "color-mix(in srgb, var(--color-ink) 12%, transparent)",
  };
  function soleOutline() {
    return (
      '<path d="M 36 10 C 60 -2 94 -2 114 12 C 124 26 124 60 118 118 C 116 150 120 185 115 217 C 118 246 110 278 95 294 C 86 303 66 303 57 294 C 42 279 34 246 38 217 C 33 185 36 150 34 118 C 28 60 28 26 36 10 Z" fill="' +
      getComputedStyle(root).getPropertyValue("--color-paper").trim() +
      '" stroke="' +
      ink() +
      '" stroke-width="2.5"/>' +
      '<g font-family="ui-monospace,Menlo,monospace" font-size="8" fill="' +
      muted() +
      '" letter-spacing="1.5">' +
      '<text transform="rotate(-90 12 210)" x="12" y="210">OUTER EDGE</text>' +
      '<text transform="rotate(90 140 130)" x="140" y="130">INNER EDGE · BIG TOE</text>' +
      '<text x="76" y="316" text-anchor="middle" font-size="7.5">LEFT FOOT · TOES UP</text>' +
      "</g>"
    );
  }

  var soleMap = el("sole-map");
  var detail = el("wear-detail");
  if (soleMap && detail) {
    soleMap.innerHTML =
      soleOutline() +
      ZONES.map(function (z) {
        return (
          '<g class="zone" tabindex="0" role="button" data-zone="' +
          z.id +
          '" aria-label="' +
          z.name +
          ", " +
          z.verdict +
          '" opacity="0.8">' +
          z.shape.replace(
            "/>",
            ' fill="' + WEAR_FILL[z.wear] + '" stroke="transparent" stroke-width="2"/>',
          ) +
          "</g>"
        );
      }).join("");
    function showZone(id) {
      var z = ZONES.filter(function (x) {
        return x.id === id;
      })[0];
      if (!z) return;
      var meter = "";
      for (var i = 1; i <= 5; i++)
        meter +=
          '<i class="' +
          (i <= z.wear ? "on" + (z.hot ? " hot" : "") : "") +
          '"></i>';
      detail.innerHTML =
        '<div class="zone-name">' +
        z.name +
        "</div>" +
        '<div class="wear-meter" aria-hidden="true">' +
        meter +
        "</div>" +
        '<div class="verdict">' +
        z.verdict +
        "</div><p>" +
        z.text +
        "</p>";
      soleMap.querySelectorAll(".zone").forEach(function (g) {
        g.classList.toggle("active", g.dataset.zone === id);
      });
    }
    soleMap.addEventListener("click", function (e) {
      var g = e.target.closest(".zone");
      if (g) showZone(g.dataset.zone);
    });
    soleMap.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        var g = e.target.closest(".zone");
        if (g) {
          e.preventDefault();
          showZone(g.dataset.zone);
        }
      }
    });
    showZone("toe");
  }

  /* ============ pronation viewer ============ */
  function legSVG(tilt, color, press) {
    var px = press === "in" ? 128 : press === "out" ? 72 : 100;
    var pressLabel =
      press === "in"
        ? "inner edge presses"
        : press === "out"
          ? "outer edge presses"
          : "weight through the middle";
    var marks = "";
    [-10, 0, 10].forEach(function (dx) {
      marks +=
        '<line x1="' +
        (px + dx) +
        '" y1="204" x2="' +
        (px + dx * 1.6) +
        '" y2="211" stroke="' +
        color +
        '" stroke-width="2"/>';
    });
    return (
      "" +
      '<line x1="100" y1="10" x2="100" y2="205" stroke="' +
      muted() +
      '" stroke-width="1" stroke-dasharray="4 5"/>' +
      '<g font-family="ui-monospace,Menlo,monospace" font-size="8" fill="' +
      muted() +
      '" letter-spacing="1">' +
      '<text x="2" y="180">OUTER EDGE</text><text x="198" y="180" text-anchor="end">INNER EDGE</text>' +
      '<text x="2" y="190" font-size="7">little-toe side</text><text x="198" y="190" text-anchor="end" font-size="7">big-toe side</text>' +
      "</g>" +
      '<g transform="rotate(' +
      tilt +
      ' 100 185)">' +
      '<path d="M 88 15 C 86 60 86 110 90 150 L 110 150 C 114 110 114 60 112 15 Z" fill="rgba(28,40,47,0.08)" stroke="' +
      ink() +
      '" stroke-width="2.5" stroke-linejoin="round"/>' +
      '<path d="M 90 150 C 88 166 82 172 72 178 C 62 184 62 196 74 200 L 126 200 C 138 196 138 184 128 178 C 118 172 112 166 110 150 Z" fill="rgba(28,40,47,0.08)" stroke="' +
      ink() +
      '" stroke-width="2.5" stroke-linejoin="round"/>' +
      "</g>" +
      '<line x1="20" y1="201" x2="180" y2="201" stroke="' +
      ink() +
      '" stroke-width="2"/>' +
      marks +
      '<text x="' +
      px +
      '" y="219" text-anchor="middle" font-family="ui-monospace,Menlo,monospace" font-size="8" fill="' +
      color +
      '" letter-spacing="1">' +
      pressLabel +
      "</text>" +
      '<g transform="rotate(' +
      tilt +
      ' 100 185)" stroke="' +
      color +
      '" fill="' +
      color +
      '">' +
      '<line x1="100" y1="70" x2="100" y2="130" stroke-width="3"/>' +
      '<path d="M 100 142 L 92 126 L 108 126 Z"/>' +
      "</g>"
    );
  }
  function wearMini(zones) {
    return (
      soleOutline() +
      zones
        .map(function (z) {
          return z[0].replace(
            "/>",
            ' fill="color-mix(in srgb, var(--color-ink) ' +
              Math.round(z[1] * 100) +
              '%, transparent)"/>',
          );
        })
        .join("")
    );
  }
  var Z_TOE_IN =
    '<path d="M 75 44 L 119 42 C 121 70 118 96 112 116 L 78 117 Z"/>';
  var Z_TOE_OUT =
    '<path d="M 31 46 L 75 44 L 78 117 L 40 118 C 33 96 30 70 31 46 Z"/>';
  var Z_HEEL_IN =
    '<path d="M 77 219 L 111 219 C 114 245 108 275 94 292 C 90 296 84 298 77 298 Z"/>';
  var Z_HEEL_OUT =
    '<path d="M 43 219 L 77 219 L 77 298 C 70 298 62 296 58 292 C 45 276 40 245 43 219 Z"/>';
  var Z_EDGE_OUT =
    '<path d="M 40 122 C 36 150 36 185 42 215 L 58 214 C 54 184 53 150 55 122 Z"/>';
  var Z_EDGE_IN =
    '<path d="M 112 120 C 118 150 118 185 113 215 L 96 214 C 100 184 101 150 98 122 Z"/>';

  var PRON = {
    sup: {
      tilt: -9,
      color: accent(),
      press: "out",
      sole: [
        [Z_TOE_OUT, 0.55],
        [Z_EDGE_OUT, 0.6],
        [Z_HEEL_OUT, 0.55],
      ],
      html:
        "<p><strong>Supination.</strong> The boat stays tipped toward the little-toe side — the whole step happens on the outer edge, and the inward roll never comes. Usual cause: an arch too high and stiff to squash.</p>" +
        "<p>The outer edge carries all the weight, so the outer edge is what grinds away — heel to toe. And with no squash softening anything, the shock rides straight up into ankle and knee.</p>" +
        '<p class="pron-verdictline" style="color:' +
        accent() +
        '">tell-tale wear: outer edge, front to back</p>',
    },
    neu: {
      tilt: 0,
      color: ink(),
      press: "mid",
      sole: [
        [Z_HEEL_OUT, 0.25],
        [Z_TOE_IN, 0.3],
        [Z_TOE_OUT, 0.3],
      ],
      html:
        "<p><strong>Neutral.</strong> The heel touches down tipped slightly toward the outer edge — everyone lands like that — then the arch squashes, the foot rocks over to level, and push-off leaves near the big toe.</p>" +
        "<p>Weight ends up traveling down the dotted line. No edge carries it for long, so no edge wears out first — just a lightly kissed outer heel and an evenly worn forefoot.</p>" +
        '<p class="pron-verdictline" style="color:' +
        ink() +
        '">tell-tale wear: even forefoot, balanced heel</p>',
    },
    over: {
      tilt: 10,
      color: accent(),
      press: "in",
      sole: [
        [Z_TOE_IN, 0.65],
        [Z_EDGE_IN, 0.5],
        [Z_HEEL_IN, 0.55],
      ],
      html:
        "<p><strong>Overpronation.</strong> The normal inward rock doesn't stop at level — the arch keeps flattening, the ankle tips in, and the boat ends up heeled over toward the big-toe side.</p>" +
        "<p>Now the inner edge carries the weight, so the inner edge is what grinds away — at heel and toe. The twist doesn't stay in the foot either; it works its way up into knees and hips.</p>" +
        '<p class="pron-verdictline" style="color:' +
        accent() +
        '">tell-tale wear: inner edge, at toe and heel</p>',
    },
  };

  var pronLeg = el("pron-leg");
  var pronSole = el("pron-sole");
  var pronText = el("pron-text");
  var ptabSup = el("ptab-sup");
  var ptabNeu = el("ptab-neu");
  var ptabOver = el("ptab-over");
  if (pronLeg && pronSole && pronText && ptabSup && ptabNeu && ptabOver) {
    var pronTabs = { sup: ptabSup, neu: ptabNeu, over: ptabOver };
    function showPron(key) {
      var p = PRON[key];
      pronLeg.innerHTML = legSVG(p.tilt, p.color, p.press);
      pronSole.innerHTML = wearMini(p.sole);
      pronText.innerHTML = p.html;
      Object.keys(pronTabs).forEach(function (k) {
        pronTabs[k].setAttribute("aria-selected", String(k === key));
      });
    }
    Object.keys(pronTabs).forEach(function (k) {
      pronTabs[k].addEventListener("click", function () {
        showPron(k);
      });
    });
    showPron("neu");
  }

  /* ============ scroll reveal ============ */
  var reveals = root.querySelectorAll(".reveal");
  if (reveals.length) {
    if (
      "IntersectionObserver" in globalThis &&
      !globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (en) {
            if (en.isIntersecting) {
              en.target.classList.add("in");
              io.unobserve(en.target);
            }
          });
        },
        { threshold: 0.06 },
      );
      reveals.forEach(function (node) {
        io.observe(node);
      });
    } else {
      reveals.forEach(function (node) {
        node.classList.add("in");
      });
    }
  }

  /* ============ step strip panels ============ */
  root.querySelectorAll(".stepstrip .step-panel").forEach(function (panel) {
    function pickPanel() {
      root.querySelectorAll(".stepstrip .step-panel").forEach(function (p) {
        p.classList.remove("active", "wrong-pick", "right-pick");
      });
      panel.classList.add("active");
    }
    panel.addEventListener("click", pickPanel);
    panel.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        pickPanel();
      }
    });
  });

  /* ============ mini challenges (legacy full-page) ============ */
  function wireChallenge(rootId) {
    var challenge = el(rootId);
    if (!challenge) return;
    var buttons = challenge.querySelectorAll("button.guess");
    var revealBox = challenge.querySelector(".reveal-box");

    function select(btn) {
      var pick = btn.getAttribute("data-answer");
      var detailText = btn.getAttribute("data-detail");

      buttons.forEach(function (b) {
        b.classList.remove("wrong", "right", "chosen");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("chosen");
      btn.setAttribute("aria-pressed", "true");
      if (pick === "right") btn.classList.add("right");
      else btn.classList.add("wrong");

      if (revealBox && detailText) {
        revealBox.innerHTML = detailText;
      }
      challenge.classList.add("open");
      if (rootId === "step-challenge") {
        var beat = btn.getAttribute("data-beat");
        root.querySelectorAll(".stepstrip .step-panel").forEach(function (panel) {
          panel.classList.remove("active", "wrong-pick", "right-pick");
          if (panel.getAttribute("data-beat") === beat) {
            panel.classList.add("active");
            panel.classList.add(
              pick === "right" ? "right-pick" : "wrong-pick",
            );
          }
        });
      }
    }

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        select(btn);
      });
    });
  }
  wireChallenge("step-challenge");
  wireChallenge("arch-challenge");
  wireChallenge("wear-challenge");
  wireChallenge("pron-challenge");

  /* ============ progress rail (legacy full-page) ============ */
  var links = root.querySelectorAll(".progress-rail a[data-skill]");
  if (links.length) {
    var sections = {};
    root.querySelectorAll("section[data-skill]").forEach(function (s) {
      sections[s.getAttribute("data-skill")] = s;
    });
    var ticking = false;
    function update() {
      ticking = false;
      var line = globalThis.innerHeight * 0.55;
      links.forEach(function (a) {
        var sec = sections[a.getAttribute("data-skill")];
        if (!sec) return;
        a.classList.toggle("done", sec.getBoundingClientRect().bottom < line);
      });
    }
    globalThis.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      },
      { passive: true },
    );
    update();
  }
}
