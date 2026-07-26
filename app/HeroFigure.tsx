import {
  MARK_BAR,
  MARK_LEFT,
  MARK_ROWS,
  MARK_VIEW_HEIGHT,
  MARK_VIEW_WIDTH,
} from "./heroMark";

/**
 * The hero graphic: the KCF symbol drawn as horizontal scan lines that break
 * up into thin scattered rules on the left.
 *
 * Left to right it is the proposition — uneven, scattered signals resolving
 * into the one form the company puts its name to. The symbol's silhouette is
 * sampled from public/kcf-logo.png by scripts/generate-hero-mark.mjs, so it is
 * the real artwork at a coarser resolution, not a redrawing. The wordmark is
 * deliberately left to the header lockup.
 *
 * The debris is computed here and is fully deterministic: the same markup
 * renders on the server and the client.
 */

/** Weight is the whole trick: the symbol is set solid, the debris is hairline. */
const DEBRIS_BAR = 3;

type Bar = { x: number; y: number; width: number; height: number };

/** Leftmost ink per row, or null where the symbol does not reach. */
const LEFT_EDGES = MARK_ROWS.map((row) =>
  row.runs.length > 0 ? row.runs[0][0] : null,
);

function anchorFor(index: number): number {
  const edge = LEFT_EDGES[index];
  if (edge !== null) return edge;

  // Above and below the symbol the rules keep going but retreat from it, so
  // the figure reads as a body with a wake rather than as a hard-edged block.
  let nearest = 0;
  let distance = Infinity;
  LEFT_EDGES.forEach((candidate, candidateIndex) => {
    if (candidate === null) return;
    const gap = Math.abs(candidateIndex - index);
    if (gap < distance) {
      distance = gap;
      nearest = candidateIndex;
    }
  });

  return (LEFT_EDGES[nearest] ?? MARK_LEFT) - 24 - distance * 17;
}

function buildBars(): Bar[] {
  const bars: Bar[] = [];

  function push(x: number, centre: number, width: number, height: number) {
    if (width <= 3 || x + width <= 0) return;
    const left = Math.max(0, x);
    bars.push({
      x: left,
      y: centre - height / 2,
      width: x + width - left,
      height,
    });
  }

  MARK_ROWS.forEach((row, index) => {
    for (const [x, width] of row.runs) push(x, row.y, width, MARK_BAR);

    const anchor = anchorFor(index);

    // A fixed, irregular-looking lead per row. Multiplying by a prime and
    // wrapping gives variety without a random source.
    const lead = 34 + ((index * 47) % 13) * 19;
    push(anchor - lead, row.y, lead, DEBRIS_BAR);

    // Every third row throws a detached rule further out, which is what keeps
    // the left side reading as scattered rather than as a soft fade.
    if (index % 3 === 0) {
      const width = 18 + ((index * 17) % 5) * 14;
      const gap = 44 + ((index * 29) % 7) * 16;
      push(anchor - lead - gap - width, row.y, width, DEBRIS_BAR);
    }
  });

  return bars;
}

const BARS = buildBars();

export function HeroFigure() {
  return (
    <svg
      className="hero-figure-svg"
      viewBox={`0 0 ${MARK_VIEW_WIDTH} ${MARK_VIEW_HEIGHT}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient
          id="kcf-scan"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2={MARK_VIEW_WIDTH}
          y2="0"
        >
          <stop offset="0" stopColor="#0b6ccb" stopOpacity="0" />
          <stop offset="0.1" stopColor="#0b6ccb" stopOpacity="0.07" />
          <stop offset="0.24" stopColor="#0b6ccb" stopOpacity="0.3" />
          <stop offset="0.37" stopColor="#0b6ccb" stopOpacity="0.58" />
          <stop offset="0.52" stopColor="#0b6ccb" stopOpacity="0.82" />
          <stop offset="0.68" stopColor="#0b6ccb" stopOpacity="1" />
          <stop offset="1" stopColor="#0756a5" stopOpacity="1" />
        </linearGradient>
      </defs>

      <g fill="url(#kcf-scan)">
        {BARS.map((bar) => (
          <rect
            key={`${bar.x}-${bar.y}-${bar.width}`}
            x={bar.x}
            y={bar.y}
            width={bar.width}
            height={bar.height}
          />
        ))}
      </g>
    </svg>
  );
}
