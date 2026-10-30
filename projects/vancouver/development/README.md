# Vancouver V0.6 research only

V0.5 remains the public and local default. The candidate failed manual acceptance;
see [the measured report](../../../docs/VANCOUVER_V06_RESEARCH_2026-10-30.md).

Run the normal Next development server, open `/labs/vancouver`, then expand
**Local handling comparison** or **Local Cambie research candidate** below the
scene. Select V0.6 explicitly and restart the same route before measuring it.
Model switching stops the car and clears run counters. Use normal UI steering;
Cruise and automated path tracking do not count as manual acceptance.

`handling-v06.ts` and `camera-v06.ts` retain candidate D for future diagnosis.
`driving-evidence.ts` stores bounded in-memory counters exposed on the canvas;
there is no persistence, upload or visitor tracking. `CambieLab.tsx` mounts and
disposes its own renderer on demand, with real alignment/raster-derived heights
and illustrative corridor widths. Its underpass camera is known to fail visibility.

The immutable research JSON and reproducible offline builder are documented in
[the elevation report](../../../docs/VANCOUVER_V06_ELEVATION_2026-10-30.md).
Production builds omit these imports/UI/data. Do not enable public bridge driving
or adopt the handling model merely because the automated tests pass.
