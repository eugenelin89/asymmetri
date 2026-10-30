// SPDX-License-Identifier: MIT — fictional clock, independent of real-world time/weather.
export type CityTime = { day: number; minutes: number; rate: 1 | 4 | 12 };
export const newTime = (): CityTime => ({ day: 1, minutes: 13 * 60, rate: 1 });
export function advanceTime(time: CityTime, seconds: number): CityTime {
  const total = time.minutes + Math.max(0, seconds) * time.rate;
  return { ...time, day: Math.min(1000000, time.day + Math.floor(total / 1440)), minutes: total % 1440 };
}
export function timePhase(minutes: number) {
  return minutes >= 360 && minutes < 720 ? "Morning" : minutes >= 720 && minutes < 1080 ? "Afternoon" : minutes >= 1080 && minutes < 1260 ? "Evening" : "Night";
}
export function clockLabel(time: CityTime) {
  return `Day ${time.day} · ${String(Math.floor(time.minutes / 60)).padStart(2, "0")}:${String(Math.floor(time.minutes % 60)).padStart(2, "0")} · ${timePhase(time.minutes)}`;
}
export function lightLevel(minutes: number, stable = false) {
  if (stable) return 1;
  // Smooth dusk/dawn; even the darkest night retains navigable fill light.
  return Math.max(0, Math.min(1, (Math.sin((minutes - 360) / 1440 * Math.PI * 2) + .15) / .45));
}
export const streetlightsOn = (minutes: number) => lightLevel(minutes) < .65;
