import type { Metadata } from "next";
import { myMusic } from "@/content/site";
import { MusicPlayer } from "./player";

export const metadata: Metadata = {
  title: myMusic.title,
  description: myMusic.description,
  alternates: { canonical: myMusic.path },
  robots: { index: false, follow: false },
};

export default function MyMusicPage() {
  return <MusicPlayer />;
}
