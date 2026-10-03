/** Visible Safari screen viewport height (px). */
export const HEATMAP_VIEWER_HEIGHT = 920;

/** Scale factor for the embedded page (< 1 zooms out). */
export const HEATMAP_EMBED_ZOOM = 0.82;

export function getHeatmapEmbedLayoutWidth(
  viewportWidth: number,
  zoom: number = HEATMAP_EMBED_ZOOM,
): number {
  if (viewportWidth <= 0) return 0;
  return Math.round(viewportWidth / zoom);
}

export function getHeatmapEmbedDisplaySize(
  layoutWidth: number,
  layoutHeight: number,
  zoom: number = HEATMAP_EMBED_ZOOM,
): { displayWidth: number; displayHeight: number } {
  return {
    displayWidth: layoutWidth * zoom,
    displayHeight: layoutHeight * zoom,
  };
}
