export interface HeatmapClick {
  /** Document position on 0–10000 grid, or viewport pixels when x ≤ vw and y ≤ vh */
  x: number;
  y: number;
  vw: number;
  vh: number;
  path: string;
  ts: number;
}

export interface NormalizedHeatmapPoint {
  x: number;
  y: number;
  value: number;
}

export interface GridClickRow {
  x: number;
  y: number;
  viewport_width: number | null;
  viewport_height: number | null;
  path: string;
  occurred_at: string | Date;
}

const GRID_MAX = 10000;
const DEFAULT_VW = 1440;
const DEFAULT_VH = 900;
const INTENSITY_CELL_SIZE = 30;

export function clampPercent(n: number): number {
  return Math.min(100, Math.max(0, n));
}

/** Route tracker + analytics_clicks always store document position on 0–10000 grid. */
export function clickToDocumentPercent(click: HeatmapClick): { percentX: number; percentY: number } {
  if (click.x >= 0 && click.y >= 0 && click.x <= GRID_MAX && click.y <= GRID_MAX) {
    return {
      percentX: clampPercent((click.x / GRID_MAX) * 100),
      percentY: clampPercent((click.y / GRID_MAX) * 100),
    };
  }

  const vw = click.vw > 0 ? click.vw : DEFAULT_VW;
  const vh = click.vh > 0 ? click.vh : DEFAULT_VH;

  return {
    percentX: clampPercent((click.x / vw) * 100),
    percentY: clampPercent((click.y / vh) * 100),
  };
}

export function normalizePoints(
  clicks: HeatmapClick[],
  containerWidth: number,
  containerHeight: number,
): NormalizedHeatmapPoint[] {
  if (containerWidth <= 0 || containerHeight <= 0 || !clicks.length) return [];

  return clicks.map((click) => {
    const { percentX, percentY } = clickToDocumentPercent(click);

    return {
      x: (percentX / 100) * containerWidth,
      y: (percentY / 100) * containerHeight,
      value: 1,
    };
  });
}

export function computeMaxIntensity(points: NormalizedHeatmapPoint[]): number {
  if (!points.length) return 1;

  const bins = new Map<string, number>();
  let max = 1;

  for (const point of points) {
    const col = Math.floor(point.x / INTENSITY_CELL_SIZE);
    const row = Math.floor(point.y / INTENSITY_CELL_SIZE);
    const key = `${col}:${row}`;
    const count = (bins.get(key) ?? 0) + point.value;
    bins.set(key, count);
    if (count > max) max = count;
  }

  return max;
}

export function gridClickRowToHeatmapClick(row: GridClickRow): HeatmapClick {
  const vw =
    row.viewport_width && row.viewport_width > 0 ? row.viewport_width : DEFAULT_VW;
  const vh =
    row.viewport_height && row.viewport_height > 0 ? row.viewport_height : DEFAULT_VH;
  const ts =
    row.occurred_at instanceof Date
      ? row.occurred_at.getTime()
      : new Date(row.occurred_at).getTime();

  return {
    x: row.x,
    y: row.y,
    vw,
    vh,
    path: row.path,
    ts: Number.isFinite(ts) ? ts : 0,
  };
}

export const HOT_GRADIENT = [
  { color: [0, 0, 255, 1.0] as [number, number, number, number], offset: 0 },
  { color: [0, 0, 255, 1.0] as [number, number, number, number], offset: 0.2 },
  { color: [0, 255, 0, 1.0] as [number, number, number, number], offset: 0.45 },
  { color: [255, 255, 0, 1.0] as [number, number, number, number], offset: 0.85 },
  { color: [255, 0, 0, 1.0] as [number, number, number, number], offset: 1.0 },
];
