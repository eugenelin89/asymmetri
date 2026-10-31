import * as THREE from "three";
export function label(text: string, w = 768, h = 160) {
  if (typeof document === "undefined")
    return new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({ color: 0x173438, side: THREE.DoubleSide }),
    );
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#173438";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#e9eee4";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const lines = text.split("\n");
  ctx.font = `500 ${h / (lines.length * 2.4)}px sans-serif`;
  lines.forEach((line, i) =>
    ctx.fillText(line, w / 2, (h / (lines.length + 1)) * (i + 1), w - 32),
  );
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({ map: t, side: THREE.DoubleSide }),
  );
}
