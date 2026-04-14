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
    <div className="panel relative overflow-hidden p-6 sm:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="label">Distributed Signal Field</div>
          <div className="mt-2 text-lg font-medium text-white">Abstract multi-agent topology</div>
        </div>
        <div className="rounded-full border border-cyan/20 bg-cyan/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.28em] text-cyan">
          Live Model
        </div>
      </div>

      <div className="relative aspect-[1.2/1] overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_center,rgba(56,151,255,0.16),transparent_52%),linear-gradient(180deg,rgba(15,23,42,0.9),rgba(2,6,23,0.96))]">
        <div className="absolute inset-0 bg-hero-grid bg-[size:40px_40px] opacity-20" />
        <div className="absolute left-1/2 top-1/2 h-[72%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan/10 animate-orbit" />
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
      </div>
    </div>
  );
}
