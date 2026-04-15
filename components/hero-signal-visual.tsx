const nodes = [
  { cx: 58, cy: 58, r: 5 },
  { cx: 178, cy: 86, r: 4 },
  { cx: 290, cy: 72, r: 5 },
  { cx: 354, cy: 142, r: 4 },
  { cx: 260, cy: 206, r: 6 },
  { cx: 128, cy: 214, r: 5 },
  { cx: 66, cy: 150, r: 4 },
  { cx: 190, cy: 146, r: 5 },
];

const links = [
  [58, 58, 178, 86],
  [178, 86, 290, 72],
  [290, 72, 354, 142],
  [178, 86, 190, 146],
  [190, 146, 260, 206],
  [190, 146, 128, 214],
  [128, 214, 66, 150],
  [66, 150, 58, 58],
  [66, 150, 190, 146],
  [128, 214, 260, 206],
];

export function HeroSignalVisual() {
  return (
    <div className="panel relative overflow-hidden p-6 sm:p-7">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <div className="label">Distributed Signal Field</div>
          <div className="mt-2 text-lg font-medium text-white">Abstract multi-agent topology</div>
        </div>
        <div className="rounded-full border border-cyan/20 bg-cyan/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.28em] text-cyan">
          Signal Map
        </div>
      </div>

      <div className="relative aspect-[1.24/1] overflow-hidden rounded-[30px] border border-white/10 bg-[radial-gradient(circle_at_50%_45%,rgba(56,151,255,0.22),transparent_38%),linear-gradient(180deg,rgba(7,11,25,0.88),rgba(2,6,18,0.98))]">
        <div className="absolute inset-0 bg-hero-grid bg-[size:48px_48px] opacity-[0.14]" />
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/[0.04] to-transparent" />
        <div className="absolute left-1/2 top-1/2 h-[72%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan/10 animate-orbit" />
        <div className="absolute left-[14%] top-[22%] h-28 w-28 rounded-full border border-white/8" />
        <div className="absolute right-[16%] top-[18%] h-16 w-16 rounded-full border border-cyan/10" />
        <div className="absolute bottom-[15%] left-[32%] h-24 w-24 rounded-full border border-white/8" />
        <svg viewBox="0 0 400 260" className="absolute inset-0 h-full w-full">
          <defs>
            <linearGradient id="flow" x1="0%" x2="100%">
              <stop offset="0%" stopColor="rgba(98,212,255,0.1)" />
              <stop offset="50%" stopColor="rgba(98,212,255,0.8)" />
              <stop offset="100%" stopColor="rgba(98,212,255,0.1)" />
            </linearGradient>
            <filter id="softGlow">
              <feGaussianBlur stdDeviation="4" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {links.map(([x1, y1, x2, y2], index) => (
            <line
              key={`${x1}-${x2}-${index}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="url(#flow)"
              strokeWidth="1.4"
              strokeLinecap="round"
              className="animate-pulseLine"
              style={{ animationDelay: `${index * 0.25}s` }}
            />
          ))}

          {nodes.map((node, index) => (
            <g key={`${node.cx}-${node.cy}`} filter="url(#softGlow)">
              <circle cx={node.cx} cy={node.cy} r={node.r * 2.2} fill="rgba(98,212,255,0.12)" />
              <circle cx={node.cx} cy={node.cy} r={node.r} fill="#7ee2ff" />
              {index % 2 === 0 ? (
                <circle
                  cx={node.cx}
                  cy={node.cy}
                  r={node.r + 10}
                  fill="none"
                  stroke="rgba(98,212,255,0.18)"
                  strokeWidth="1"
                />
              ) : null}
            </g>
          ))}
        </svg>
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl border border-white/8 bg-slate-950/50 px-4 py-3 backdrop-blur">
          <div>
            <div className="label">Environment signal</div>
            <div className="mt-1 text-sm text-slate-300">Stigmergic routing under transfer noise</div>
          </div>
          <div className="text-right">
            <div className="label">Integrity</div>
            <div className="mt-1 text-sm text-cyan">0.94 stable</div>
          </div>
        </div>
      </div>
    </div>
  );
}
