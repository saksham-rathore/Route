export type WorldHeatmapData = Record<string, number>;

export type WorldGeometry = {
  type: string;
  coordinates: unknown;
};

export type WorldFeature<TProperties> = {
  type: "Feature";
  id?: string | number;
  geometry: WorldGeometry | null;
  properties: TProperties;
};

export type WorldFeatureCollection<TProperties> = {
  type: "FeatureCollection";
  features: WorldFeature<TProperties>[];
};

export type WorldHeatmapMetric = {
  countryCode: string;
  countryName: string;
  visitors: number;
  percentage: number;
};

export type WorldTooltipState = {
  x: number;
  y: number;
  metric: WorldHeatmapMetric;
};

export type WorldCountryProperties = {
  name?: string;
  country_code?: string | null;
};

export type WorldCountryFeature = WorldFeature<WorldCountryProperties>;

export type WorldCountryFeatureCollection = WorldFeatureCollection<WorldCountryProperties>;

export interface WorldHeatmapProps {
  data?: WorldHeatmapData | null;
  title?: string;
  description?: string;
  className?: string;
  isLoading?: boolean;
  emptyLabel?: string;
  emptyDescription?: string;
  mapPath?: string;
  selectedCountryCode?: string | null;
  selectedCountryName?: string | null;
  valueLabel?: string;
  valueFormatter?: (value: number) => string;
  secondaryLabel?: string;
  secondaryFormatter?: (countryCode: string) => string | null;
  onCountrySelect?: (countryCode: string, countryName: string) => void;
  onClearSelection?: () => void;
}

export type GeographyRange = "24h" | "7d" | "30d";

export type CountryAggregate = {
  countryCode: string;
  countryName: string;
  pageviews: number;
  uniqueVisitors: number;
  cityCount: number;
};
