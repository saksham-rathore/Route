import type { NormalizedHeatmapPoint } from './normalizePoints';
import { computeMaxIntensity } from './normalizePoints';

const PALETTE_STOPS: [number, [number, number, number]][] = [
  [0, [0, 0, 255]],
  [0.25, [0, 255, 255]],
  [0.5, [0, 255, 0]],
  [0.75, [255, 255, 0]],
  [1, [255, 0, 0]],
];

function paletteColor(t: number): [number, number, number] {
  let lo = PALETTE_STOPS[0]!;
  let hi = PALETTE_STOPS[PALETTE_STOPS.length - 1]!;
  for (let i = 0; i < PALETTE_STOPS.length - 1; i++) {
    if (t >= PALETTE_STOPS[i]![0] && t <= PALETTE_STOPS[i + 1]![0]) {
      lo = PALETTE_STOPS[i]!;
      hi = PALETTE_STOPS[i + 1]!;
      break;
    }
  }
  const span = hi[0] - lo[0];
  const f = span === 0 ? 0 : (t - lo[0]) / span;
  return [
    Math.round(lo[1][0] + (hi[1][0] - lo[1][0]) * f),
    Math.round(lo[1][1] + (hi[1][1] - lo[1][1]) * f),
    Math.round(lo[1][2] + (hi[1][2] - lo[1][2]) * f),
  ];
}

/**
 * Canvas 2D heatmap overlay — reliable fallback that works in all browsers
 * and Next.js client bundles (visual-heatmap WebGL2 can fail silently).
 */
export function drawHeatmapOverlay(
  canvas: HTMLCanvasElement,
  points: NormalizedHeatmapPoint[],
  width: number,
  height: number,
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = Math.max(1, Math.round(width));
  const h = Math.max(1, Math.round(height));
  canvas.width = w;
  canvas.height = h;
  ctx.clearRect(0, 0, w, h);

  if (!points.length) return;

  const maxWeight = Math.max(1, computeMaxIntensity(points));
  const radius = Math.max(20, Math.min(45, w * 0.035));
  const blur = radius * 0.65;

  const shadow = document.createElement('canvas');
  shadow.width = w;
  shadow.height = h;
  const sCtx = shadow.getContext('2d');
  if (!sCtx) return;

  for (const p of points) {
    const alpha = Math.min(1, p.value / maxWeight);
    const grad = sCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius + blur);
    grad.addColorStop(0, `rgba(0,0,0,${alpha})`);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    sCtx.fillStyle = grad;
    sCtx.beginPath();
    sCtx.arc(p.x, p.y, radius + blur, 0, Math.PI * 2);
    sCtx.fill();
  }

  const imageData = sCtx.getImageData(0, 0, w, h);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3]!;
    if (a === 0) continue;
    const t = a / 255;
    const [r, g, b] = paletteColor(t);
    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
    data[i + 3] = Math.round(a * 0.78);
  }

  ctx.putImageData(imageData, 0, 0);
}
