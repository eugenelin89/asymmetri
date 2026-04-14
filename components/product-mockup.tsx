const telemetryRows = [
  { label: "Transfer validation", value: "97.4%", status: "Nominal" },
  { label: "Sensor contract drift", value: "1.8%", status: "Stable" },
  { label: "Deployment sync", value: "24 agents", status: "Online" },
];

export function ProductMockup() {
  return (
    <div className="panel relative overflow-hidden p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="label">Control Center for Physical AI Systems</div>
          <div className="mt-2 text-lg font-medium text-white">Training to deployment surface</div>
        </div>
        <div className="rounded-full border border-white/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.28em] text-slate-400">
          Runtime
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[24px] border border-white/10 bg-slate-950/70 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="label">Simulation environment</span>
            <span className="text-xs text-slate-500">episode 1842</span>
          </div>
          <div className="relative h-48 overflow-hidden rounded-2xl border border-white/8 bg-[radial-gradient(circle_at_20%_20%,rgba(98,212,255,0.14),transparent_28%),linear-gradient(180deg,rgba(5,8,22,0.7),rgba(2,6,23,0.98))]">
            <div className="absolute inset-0 bg-hero-grid bg-[size:28px_28px] opacity-15" />
            <div className="absolute left-8 top-10 h-20 w-28 rounded-2xl border border-cyan/20 bg-cyan/10" />
            <div className="absolute bottom-10 left-16 h-3 w-40 rounded-full bg-gradient-to-r from-cyan/10 via-cyan/80 to-cyan/10 blur-[1px]" />
            <div className="absolute right-10 top-12 h-24 w-24 rounded-full border border-cyan/20" />
            <div className="absolute right-16 top-20 h-12 w-12 rounded-full bg-cyan/10" />
            <div className="absolute bottom-8 right-8 h-16 w-24 rounded-2xl border border-white/8 bg-white/[0.03]" />
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-[24px] border border-white/10 bg-slate-950/70 p-4">
            <div className="label">Agent telemetry</div>
            <div className="mt-4 space-y-3">
              {telemetryRows.map((row) => (
                <div
                  key={row.label}
                  className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-slate-300">{row.label}</span>
                    <span className="text-sm text-cyan">{row.value}</span>
                  </div>
                  <div className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-500">
                    {row.status}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-slate-950/70 p-4">
            <div className="label">System graph</div>
            <div className="mt-4 flex h-32 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.02]">
              <div className="relative h-24 w-40">
                <div className="absolute left-0 top-8 h-8 w-8 rounded-full border border-cyan/30 bg-cyan/10" />
                <div className="absolute left-14 top-0 h-10 w-10 rounded-full border border-white/10 bg-white/[0.03]" />
                <div className="absolute left-16 top-16 h-8 w-8 rounded-full border border-cyan/30 bg-cyan/10" />
                <div className="absolute right-0 top-8 h-8 w-8 rounded-full border border-cyan/30 bg-cyan/10" />
                <div className="absolute left-8 top-11 h-px w-20 bg-gradient-to-r from-cyan/10 via-cyan/70 to-cyan/10" />
                <div className="absolute left-[68px] top-10 h-14 w-px bg-gradient-to-b from-cyan/10 via-cyan/70 to-cyan/10" />
                <div className="absolute left-[92px] top-11 h-px w-16 bg-gradient-to-r from-cyan/10 via-cyan/70 to-cyan/10" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
