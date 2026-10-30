import { useCallback, useEffect, useRef, useState } from "react";
import type { Input } from "./types";
import styles from "./vancouver.module.css";

const buttons = [
  { action: "left", label: "Steer left", text: "←" },
  { action: "right", label: "Steer right", text: "→" },
  { action: "back", label: "Brake and reverse", text: "↓" },
  { action: "forward", label: "Accelerate", text: "↑" },
  { action: "brake", label: "Brake", text: "■" },
] as const;

/** Pointer capture keeps each pedal/finger independent, including a steering slide. */
export function DriveControls({ onInput }: { onInput(action: Input, pressed: boolean, source: string): void }) {
  const host = useRef<HTMLDivElement>(null), held = useRef(new Map<string, Input>());
  const input = useRef(onInput);
  useEffect(() => { input.current = onInput; }, [onInput]);
  const [active, setActive] = useState<Input[]>([]);
  const release = useCallback((source: string) => {
    const action = held.current.get(source);
    if (action) { input.current(action, false, source); held.current.delete(source); setActive([...held.current.values()]); }
  }, []);
  function press(source: string, action: Input) {
    if (held.current.get(source) === action) return;
    held.current.set(source, action); input.current(action, true, source); setActive([...held.current.values()]);
  }
  useEffect(() => {
    const clear = () => { for (const source of [...held.current.keys()]) release(source); };
    window.addEventListener("blur", clear); document.addEventListener("visibilitychange", clear);
    return () => { clear(); window.removeEventListener("blur", clear); document.removeEventListener("visibilitychange", clear); };
  }, [release]);
  return <div className={styles.driveControls} aria-label="Driving controls" ref={host}>
    {buttons.map(({ action, label, text }) => <button type="button" key={action} aria-label={label} data-action={action} data-active={active.includes(action)}
      onPointerDown={(event) => { event.preventDefault(); event.currentTarget.setPointerCapture(event.pointerId); press(`pointer:${event.pointerId}`, action); }}
      onPointerMove={(event) => {
        if (action !== "left" && action !== "right") return;
        if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
        const source = `pointer:${event.pointerId}`;
        const target = [...(host.current?.querySelectorAll<HTMLButtonElement>('button[data-action="left"], button[data-action="right"]') ?? [])].find((button) => {
          const rect = button.getBoundingClientRect();
          return event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top - 12 && event.clientY <= rect.bottom + 12;
        });
        if (target) press(source, target.dataset.action as "left" | "right"); else release(source);
      }}
      onPointerUp={(event) => release(`pointer:${event.pointerId}`)} onPointerCancel={(event) => release(`pointer:${event.pointerId}`)} onLostPointerCapture={(event) => release(`pointer:${event.pointerId}`)}
      onKeyDown={(event) => { if (event.key === " " || event.key === "Enter") { event.preventDefault(); press(`button:${action}:${event.key}`, action); } }}
      onKeyUp={(event) => release(`button:${action}:${event.key}`)}
      onBlur={() => { release(`button:${action}: `); release(`button:${action}:Enter`); }}>{text}</button>)}
  </div>;
}
