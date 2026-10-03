/** Responsive chart container heights for dashboard panels. */
export const dashboardChartHeight = {
  tall: 'h-[220px] sm:h-[280px] lg:h-[340px]',
  standard: 'h-[200px] sm:h-[240px] lg:h-[280px]',
  wide: 'h-[220px] sm:h-[280px] lg:h-[330px]',
  compact: 'h-[140px] sm:h-[170px] lg:h-[190px]',
  small: 'h-[160px] sm:h-[180px] lg:h-[200px]',
} as const;

export const dashboardPanelBodyClass = 'p-4 sm:p-5';
export const dashboardPanelHeaderClass =
  'border-b border-[color:var(--dash-divider)] px-4 py-3 sm:px-5 sm:py-4';
export const dashboardRankedPanelMinHeight = 'min-h-[260px] sm:min-h-[310px]';
export const dashboardLoadingPanelHeight = 'h-[320px] sm:h-[420px] lg:h-[520px]';

/** Three summary metrics — CSS + Tailwind utilities (utilities avoid purge gaps on JS class strings). */
export const dashboardMetricGridThreeClass =
  'dashboard-metric-grid-three grid w-full grid-cols-2 gap-4 sm:grid-cols-3';

/** Four summary metrics — CSS + Tailwind utilities (utilities avoid purge gaps on JS class strings). */
export const dashboardMetricGridFourClass =
  'dashboard-metric-grid-four grid w-full grid-cols-2 gap-4 sm:grid-cols-4';

/** Five summary metrics — CSS + Tailwind utilities (utilities avoid purge gaps on JS class strings). */
export const dashboardMetricGridFiveClass =
  'dashboard-metric-grid-five grid w-full grid-cols-2 gap-4 sm:grid-cols-5';
