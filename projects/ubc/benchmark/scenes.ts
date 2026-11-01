import type { Anchors, Pose, Settings } from "../types";
import { defaults, normalizeSettings } from "../environment";
import { initialGatewayPose } from "../gateway-layout";
import { orchardAnchor } from "../residence-layout";
import { global } from "../spatial";

/** Pose feet in metres; camera adds the same 1.68 m eye height as walking. */
export function benchmarkScenes(anchors: Anchors) {
  const at = (id: string, x: number, z: number, y = 0, yaw = 0, pitch = 0): Pose => {
    const a = id === "orchard" ? orchardAnchor : anchors[id];
    const p = global([x, z], a);
    return { x: p[0], z: p[1], y, yaw: a.yaw + yaw, pitch };
  };
  return [
    { id: "stadium", name: "Tourmaline West · grandstand", pose: at("stadium", 10, 25, 3.62, 0, -0.08) },
    { id: "rose", name: "Rose Centre · training hall", pose: at("rose", 0, 16, 0) },
    { id: "orchard", name: "Orchard · demonstration corridor", pose: at("orchard", 12, 0, 3.4, Math.PI / 2) },
    { id: "nest", name: "AMS Nest · atrium", pose: at("nest", 0, 16, 0, 0, 0.12) },
    { id: "irving", name: "IKB · Chapman approach", pose: at("irving", -11.6, 3, 10) },
    { id: "main-mall", name: "Main Mall · busy outdoor core", pose: at("irving", -11.6, -55, 0, Math.PI, 0.08) },
    { id: "koerner", name: "Koerner · GIS exterior baseline", pose: at("koerner", 0, 45, 0, 0, 0.1) },
    { id: "gateway", name: "UBC entrance letters", pose: initialGatewayPose() },
    { id: "halloween", name: "Halloween · gateway crowd", pose: initialGatewayPose(), halloween: true },
  ];
}
export function benchmarkSettings(quality: "high" | "medium" | "low", halloween: boolean, frozen: boolean, population = true): Settings {
  return normalizeSettings({
    ...defaults, quality, season: "autumn", weather: "clear", hour: 15,
    markers: false, population, reducedMotion: frozen,
    halloween, halloweenChase: false, halloweenAudio: false,
  });
}
