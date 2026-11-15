"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { myMusic } from "@/content/site";
import { collectMusic, parseFolderUrl, type DriveEntry, type MusicTrack } from "@/lib/mymusic";
import styles from "./player.module.css";

export function MusicPlayer() {
  const [url, setUrl] = useState("");
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [current, setCurrent] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const audio = useRef<HTMLAudioElement>(null);
  const scan = useRef<AbortController | null>(null);
  useEffect(() => () => { scan.current?.abort(); }, []);

  async function load(event: FormEvent) {
    event.preventDefault();
    try { parseFolderUrl(url); } catch (cause) { setError((cause as Error).message); return; }
    scan.current?.abort();
    const controller = new AbortController();
    scan.current = controller;
    audio.current?.pause();
    audio.current?.removeAttribute("src");
    audio.current?.load();
    setTracks([]); setCurrent(null); setError(""); setLoading(true); setStatus("Reading folders…");
    try {
      const result = await collectMusic(url, async (folderUrl) => {
        const response = await fetch("/mymusic/folder", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: folderUrl }), signal: controller.signal, cache: "no-store",
        });
        const data: { entries?: DriveEntry[]; error?: string } = await response.json();
        if (!response.ok || !data.entries) throw new Error(data.error || "Could not read this folder.");
        return data.entries;
      }, (folders, count) => setStatus(`Reading folders… ${folders} checked, ${count} tracks found.`), controller.signal);
      setTracks(result.tracks);
      setStatus(result.tracks.length ? `${result.tracks.length} tracks ready. Press Play to start.` : "No audio files found in this folder or its subfolders.");
      if (result.skipped || result.limited) setError([
        result.skipped ? `${result.skipped} subfolder(s) could not be read. Check their sharing settings and reload to retry.` : "",
        result.limited ? "Folder limit reached. This queue is incomplete; load a smaller subfolder for the rest." : "",
      ].filter(Boolean).join(" "));
    } catch (cause) {
      if (!controller.signal.aborted) { setError(cause instanceof Error ? cause.message : "Could not load this folder."); setStatus(""); }
    } finally { if (scan.current === controller) setLoading(false); }
  }

  function play(index: number) {
    const player = audio.current;
    const track = tracks[index];
    if (!player || !track) return;
    setCurrent(index);
    setStatus(`Track ${index + 1} of ${tracks.length}`);
    const params = new URLSearchParams({ id: track.id });
    if (track.resourceKey) params.set("resourcekey", track.resourceKey);
    player.src = `/mymusic/audio?${params}`;
    void player.play().catch((cause: unknown) => {
      if (cause instanceof DOMException && cause.name === "NotAllowedError") setStatus("Press Play on the audio controls to continue.");
    });
  }

  function advance() {
    if (current !== null && current + 1 < tracks.length) play(current + 1);
    else setStatus("Finished playing this folder.");
  }

  return (
    <main className={styles.main}>
      <h1>{myMusic.title}</h1>
      <p className={styles.intro}>{myMusic.description}</p>
      <form onSubmit={load} className={styles.form}>
        <label htmlFor="folder-url">Google Drive folder URL</label>
        <div className={styles.inputRow}>
          <input id="folder-url" type="url" required value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://drive.google.com/drive/folders/…" autoComplete="off" spellCheck={false} aria-describedby="folder-help" />
          <button type="submit" disabled={loading}>{loading ? "Loading…" : "Load folder"}</button>
          {loading && <button type="button" onClick={() => { scan.current?.abort(); setStatus("Loading cancelled."); }}>Cancel</button>}
        </div>
        <p id="folder-help" className={styles.help}>{myMusic.help}</p>
      </form>
      <p role="status" aria-live="polite">{status}</p>
      {error && <p role="alert" className={styles.notice}>{error}</p>}
      <section aria-label="Audio player" className={styles.player} hidden={!tracks.length}>
        <p className={styles.now}>{current === null ? "Ready when you are." : tracks[current]?.name}</p>
        <audio ref={audio} controls hidden={current === null} preload="none" onEnded={advance} onError={() => {
          if (current === null) return;
          setError(`Could not play “${tracks[current].name}”. Google may limit downloads, or this format may not play in your browser. ${current + 1 < tracks.length ? "Skipping to the next track." : "Try another track or reload the folder."}`);
          advance();
        }} />
        <div className={styles.controls}>
          <button type="button" disabled={current === null || current === 0} onClick={() => play((current ?? 1) - 1)}>Previous</button>
          {current === null && <button type="button" onClick={() => play(0)}>Play</button>}
          <button type="button" disabled={current === null || current >= tracks.length - 1} onClick={() => play((current ?? 0) + 1)}>Next</button>
        </div>
      </section>
      {!!tracks.length && <ol className={styles.queue} aria-label="Play queue">
        {tracks.map((track, index) => <li key={track.id}>
          <button type="button" aria-current={current === index ? "true" : undefined} onClick={() => play(index)}>
            <span className={styles.number}>{index + 1}</span>
            <span><span className={styles.trackName}>{track.name}</span>{track.path && <small>{track.path}</small>}</span>
            {current === index && <span className={styles.selected}>Selected</span>}
          </button>
        </li>)}
      </ol>}
      <p className={styles.help}>{myMusic.privacy}</p>
    </main>
  );
}
