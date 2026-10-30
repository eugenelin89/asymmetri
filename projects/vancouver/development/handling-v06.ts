import type { CarState, stepCar } from "../physics";
import type { Point2 } from "../types";

export type Pace = "relaxed" | "normal";
export type DriverInput = { throttle: number; steering: number; brake: boolean };
const clamp = (value: number, low: number, high: number) => Math.max(low, Math.min(high, value));

/** Driver input shaping only. No route, road heading or destination is consulted. */
export function createManualDriver(integrate: typeof stepCar) {
  let direction = 0, heldSeconds = 0;
  return {
    clear() { direction = 0; heldSeconds = 0; },
    step(start: CarState, input: DriverInput, pace: Pace, delta: number, allowed: (point: Point2) => boolean) {
      const elapsed = clamp(delta, 0, .1), steps = Math.max(1, Math.ceil(elapsed * 120)), dt = elapsed / steps;
      let car = start;
      for (let i = 0; i < steps; i++) {
        const demand = clamp(input.steering, -1, 1), nextDirection = Math.sign(demand);
        if (nextDirection !== direction) heldSeconds = 0;
        direction = nextDirection; heldSeconds = direction ? heldSeconds + dt : 0;
        // Brief taps trim heading; a held key progressively reaches a useful
        // turning radius. Higher speeds get a wider radius, never lane following.
        const ramp = clamp(heldSeconds / .45, 0, 1);
        const progressive = .45 + .55 * ramp * ramp * (3 - 2 * ramp);
        // Limit heading change as well as wheel angle. V0.5 widened the turn
        // radius with speed, but still nearly doubled yaw rate from 6 to 19 m/s.
        // Preserve V0.5 exactly at Relaxed speeds. The stronger low-speed
        // candidate did not improve the paired North/Village manual tests.
        const speed = Math.abs(car.speed);
        const yawLimit = 1.12 - .27 * clamp((speed - 7) / 12, 0, 1);
        const wheelLimit = Math.atan2(2.65, Math.max(3.8 + speed * .35, speed / yawLimit));
        const steering = demand * progressive * wheelLimit * (1 + Math.abs(car.speed) / 22) / .72;
        // Release/counter-steer recentres promptly instead of carrying a turn
        // after the driver lets go. The shared collision integrator is unchanged.
        if (!direction || Math.sign(car.steer ?? 0) !== direction) car = { ...car, steer: (car.steer ?? 0) * Math.exp(-11 * dt) };
        const cap = pace === "relaxed" ? 6 : 19;
        const throttle = input.throttle > 0 && car.speed >= cap ? 0 : clamp(input.throttle, -1, 1) * (pace === "relaxed" ? .65 : .85);
        car = integrate(car, throttle, steering, input.brake || car.speed > cap + .5, dt, allowed);
      }
      return car;
    },
  };
}
