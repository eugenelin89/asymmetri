"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { myMusic, openMP3 } from "@/content/site";
import { collectMusic, parseFolderUrl, type DriveEntry, type MusicTrack } from "@/lib/mymusic";
import { adjacentTrack, playOrder, type RepeatMode } from "@/lib/mymusic-playback";
import styles from "./player.module.css";

export function MusicPlayer() {
  const [url, setUrl] = useState("");
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [current, setCurrent] = useState<number | null>(null);
  const [order, setOrder] = useState<number[]>([]);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<RepeatMode>("off");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const audio = useRef<HTMLAudioElement>(null);
  const scan = useRef<AbortController | null>(null);
  const unavailable = useRef(new Set<number>());
  const startAudio = useCallback((track: MusicTrack) => {
    const player = audio.current;
    if (!player) return;
    const params = new URLSearchParams({ id: track.id });
    if (track.resourceKey) params.set("resourcekey", track.resourceKey);
    player.src = `/mymusic/audio?${params}`;
    void player.play().catch((cause: unknown) => {
      if (cause instanceof DOMException && cause.name === "NotAllowedError") setStatus("Press Play on the audio controls to continue.");
    });
  }, []);

  const loadFolder = useCallback(async (folderUrl: string, shuffled = false, autoplay = false) => {
    try { parseFolderUrl(folderUrl); } catch (cause) { setError((cause as Error).message); return; }
    scan.current?.abort();
    const controller = new AbortController();
    scan.current = controller;
    audio.current?.pause();
    audio.current?.removeAttribute("src");
    audio.current?.load();
    unavailable.current.clear();
    setTracks([]); setOrder([]); setCurrent(null); setError(""); setLoading(true); setStatus("Reading folders…");
    try {
      const result = await collectMusic(folderUrl, async (folderUrl) => {
        const response = await fetch("/mymusic/folder", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: folderUrl }), signal: controller.signal, cache: "no-store",
        });
        const data: { entries?: DriveEntry[]; error?: string } = await response.json();
        if (!response.ok || !data.entries) throw new Error(data.error || "Could not read this folder.");
        return data.entries;
      }, (folders, count) => setStatus(`Reading folders… ${folders} checked, ${count} tracks found.`), controller.signal);
      controller.signal.throwIfAborted();
      const pageUrl = new URL(window.location.href);
      pageUrl.searchParams.set("folder", folderUrl.trim());
      window.history.replaceState(window.history.state, "", pageUrl);
      setTracks(result.tracks);
      const nextOrder = playOrder(result.tracks.length, shuffled);
      setOrder(nextOrder);
      setStatus(result.tracks.length ? `${result.tracks.length} tracks ready. Press Play to start.` : "No audio files found in this folder or its subfolders.");
      if (result.skipped || result.limited) setError([
        result.skipped ? `${result.skipped} subfolder(s) could not be read. Check their sharing settings and reload to retry.` : "",
        result.limited ? "Folder limit reached. This queue is incomplete; load a smaller subfolder for the rest." : "",
      ].filter(Boolean).join(" "));
      if (autoplay && result.tracks.length) {
        const first = nextOrder[0];
        setCurrent(first);
        setStatus(`Track 1 of ${result.tracks.length}`);
        startAudio(result.tracks[first]);
      }
    } catch (cause) {
      if (!controller.signal.aborted) { setError(cause instanceof Error ? cause.message : "Could not load this folder."); setStatus(""); }
    } finally { if (scan.current === controller) setLoading(false); }
  }, [startAudio]);

  useEffect(() => {
    const folderUrl = new URLSearchParams(window.location.search).get("folder");
    // Defer until hydration finishes; cleanup also cancels Strict Mode's first setup.
    const start = window.setTimeout(() => {
      if (folderUrl?.trim()) {
        setUrl(folderUrl);
        void loadFolder(folderUrl, false, true);
      }
    }, 0);
    return () => { window.clearTimeout(start); scan.current?.abort(); };
  }, [loadFolder]);

  function load(event: FormEvent) {
    event.preventDefault();
    void loadFolder(url, shuffle);
  }

  function play(index: number, automatic = false) {
    const player = audio.current;
    const track = tracks[index];
    if (!player || !track) return;
    if (!automatic) unavailable.current.delete(index);
    setCurrent(index);
    setStatus(`Track ${order.indexOf(index) + 1} of ${tracks.length}`);
    startAudio(track);
  }

  function advance() {
    const next = adjacentTrack(order, current, 1, repeat === "all", unavailable.current);
    if (next !== null) play(next, true);
    else setStatus("Finished playing this folder.");
  }

  function toggleShuffle() {
    const enabled = !shuffle;
    const nextOrder = playOrder(tracks.length, enabled, current);
    setShuffle(enabled);
    setOrder(nextOrder);
    if (current !== null) setStatus(`Track ${nextOrder.indexOf(current) + 1} of ${tracks.length}`);
  }

  const previous = adjacentTrack(order, current, -1, repeat === "all");
  const next = adjacentTrack(order, current, 1, repeat === "all");

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
        <audio ref={audio} controls hidden={current === null} preload="none" loop={repeat === "one"} onEnded={advance} onError={() => {
          if (current === null) return;
          unavailable.current.add(current);
          const hasNext = adjacentTrack(order, current, 1, repeat === "all", unavailable.current) !== null;
          setError(`Could not play “${tracks[current].name}”. Google may limit downloads, or this format may not play in your browser. ${hasNext ? "Skipping to the next track." : "Try another track or reload the folder."}`);
          advance();
        }} />
        <div className={styles.controls}>
          <button type="button" disabled={previous === null} onClick={() => { if (previous !== null) play(previous); }}>Previous</button>
          {current === null && <button type="button" onClick={() => play(order[0])}>Play</button>}
          <button type="button" disabled={next === null} onClick={() => { if (next !== null) play(next); }}>Next</button>
          <button type="button" aria-pressed={shuffle} onClick={toggleShuffle}>Shuffle: {shuffle ? "On" : "Off"}</button>
          <button type="button" aria-label={`Repeat: ${repeat === "off" ? "Off. Turn on Repeat 1" : repeat === "one" ? "1. Turn on Repeat All" : "All. Turn repeat off"}`} aria-pressed={repeat !== "off"} onClick={() => setRepeat(repeat === "off" ? "one" : repeat === "one" ? "all" : "off")}>
            Repeat: {repeat === "off" ? "Off" : repeat === "one" ? "1" : "All"}
          </button>
        </div>
      </section>
      {!!tracks.length && <ol className={styles.queue} aria-label="Play queue">
        {order.map((index, position) => { const track = tracks[index]; return <li key={track.id}>
          <button type="button" aria-current={current === index ? "true" : undefined} onClick={() => play(index)}>
            <span className={styles.number}>{position + 1}</span>
            <span><span className={styles.trackName}>{track.name}</span>{track.path && <small>{track.path}</small>}</span>
            {current === index && <span className={styles.selected}>Selected</span>}
          </button>
        </li>; })}
      </ol>}
      <p className={styles.help}>Prefer a native iPhone player? <Link href={openMP3.path}>Meet OpenMP3 — free, with background playback.</Link></p>
    </main>
  );
}
