const telemetryRows = [
  { label: "Transfer validation", value: "97.4%", status: "Nominal" },
  { label: "Observation drift", value: "1.8%", status: "Stable" },
  { label: "Active runtime nodes", value: "24", status: "Online" },
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

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.22fr_0.78fr]">
        <div className="muted-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="label">Simulation environment</span>
            <span className="text-xs text-slate-500">policy build 01842</span>
          </div>
          <div className="relative h-56 overflow-hidden rounded-[22px] border border-white/8 bg-[linear-gradient(180deg,rgba(4,9,22,0.7),rgba(2,6,18,1))]">
            <div className="absolute inset-0 bg-hero-grid bg-[size:26px_26px] opacity-[0.11]" />
            <div className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-white/[0.04] to-transparent" />
            <div className="absolute left-5 right-5 top-4 flex items-center justify-between text-[10px] uppercase tracking-[0.26em] text-slate-500">
              <span>Zone A / Sim</span>
              <span>Noise profile 04</span>
            </div>
            <div className="absolute left-10 top-16 h-24 w-32 rounded-[18px] border border-cyan/20 bg-cyan/10 shadow-[inset_0_0_0_1px_rgba(98,212,255,0.08)]" />
            <div className="absolute left-20 top-28 h-3 w-48 rounded-full bg-gradient-to-r from-cyan/0 via-cyan/80 to-cyan/0" />
            <div className="absolute right-8 top-14 h-28 w-28 rounded-full border border-white/10" />
            <div className="absolute right-14 top-20 h-16 w-16 rounded-full border border-cyan/20 bg-cyan/10" />
            <div className="absolute bottom-5 left-5 right-5 grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-white/8 bg-slate-950/70 px-3 py-2">
                <div className="text-[10px] uppercase tracking-[0.22em] text-slate-500">Sim fidelity</div>
                <div className="mt-1 text-sm text-white">0.92</div>
              </div>
              <div className="rounded-xl border border-white/8 bg-slate-950/70 px-3 py-2">
                <div className="text-[10px] uppercase tracking-[0.22em] text-slate-500">Actuation</div>
                <div className="mt-1 text-sm text-white">bounded</div>
              </div>
              <div className="rounded-xl border border-white/8 bg-slate-950/70 px-3 py-2">
                <div className="text-[10px] uppercase tracking-[0.22em] text-slate-500">Latency</div>
                <div className="mt-1 text-sm text-white">14 ms</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="muted-card p-4">
            <div className="label">Agent telemetry</div>
            <div className="mt-4 space-y-3">
              {telemetryRows.map((row) => (
                <div
                  key={row.label}
                  className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-slate-300">{row.label}</span>
                    <span className="text-sm font-medium text-cyan">{row.value}</span>
                  </div>
                  <div className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-500">
                    {row.status}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="muted-card p-4">
            <div className="flex items-center justify-between">
              <div className="label">Deployment graph</div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-slate-500">edge active</div>
            </div>
            <div className="mt-4 rounded-2xl border border-white/8 bg-white/[0.02] p-4">
              <div className="relative h-28">
                <div className="absolute left-0 top-10 h-8 w-8 rounded-full border border-cyan/30 bg-cyan/10 shadow-[0_0_12px_rgba(98,212,255,0.22)]" />
                <div className="absolute left-16 top-0 h-10 w-10 rounded-full border border-white/10 bg-white/[0.03]" />
                <div className="absolute left-20 top-[72px] h-8 w-8 rounded-full border border-cyan/30 bg-cyan/10 shadow-[0_0_12px_rgba(98,212,255,0.22)]" />
                <div className="absolute right-4 top-10 h-8 w-8 rounded-full border border-cyan/30 bg-cyan/10 shadow-[0_0_12px_rgba(98,212,255,0.22)]" />
                <div className="absolute left-8 top-[49px] h-px w-24 bg-gradient-to-r from-cyan/10 via-cyan/70 to-cyan/10" />
                <div className="absolute left-[84px] top-10 h-[52px] w-px bg-gradient-to-b from-cyan/10 via-cyan/70 to-cyan/10" />
                <div className="absolute left-[108px] top-[49px] h-px w-20 bg-gradient-to-r from-cyan/10 via-cyan/70 to-cyan/10" />
                <div className="absolute bottom-0 left-0 right-0 grid grid-cols-3 gap-2 text-[10px] uppercase tracking-[0.2em] text-slate-500">
                  <div>sim</div>
                  <div className="text-center">transfer</div>
                  <div className="text-right">field</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
