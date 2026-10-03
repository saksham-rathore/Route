import type {
  WorldCountryFeature,
  WorldHeatmapData,
  WorldHeatmapMetric,
} from "./world-map-types";

export const MAP_FILE = "/datamaps.world.json";

export const ISO_COUNTRIES: Record<string, string> = {
  ABW: "AW", AFG: "AF", AGO: "AO", AIA: "AI", ALA: "AX", ALB: "AL",
  AND: "AD", ANT: "AN", ARE: "AE", ARG: "AR", ARM: "AM", ASM: "AS",
  ATF: "TF", ATG: "AG", AUS: "AU", AUT: "AT", AZE: "AZ", BDI: "BI",
  BEL: "BE", BEN: "BJ", BFA: "BF", BGD: "BD", BGR: "BG", BHR: "BH",
  BHS: "BS", BIH: "BA", BLR: "BY", BLZ: "BZ", BLM: "BL", BMU: "BM",
  BOL: "BO", BRA: "BR", BRB: "BB", BRN: "BN", BTN: "BT", BVT: "BV",
  BWA: "BW", CAF: "CF", CAN: "CA", CCK: "CC", CHE: "CH", CHL: "CL",
  CHN: "CN", CIV: "CI", CMR: "CM", COD: "CD", COG: "CG", COK: "CK",
  COL: "CO", COM: "KM", CPV: "CV", CRI: "CR", CUB: "CU", CXR: "CX",
  CYM: "KY", CYP: "CY", CZE: "CZ", DEU: "DE", DJI: "DJ", DMA: "DM",
  DNK: "DK", DOM: "DO", DZA: "DZ", ECU: "EC", EGY: "EG", ERI: "ER",
  ESH: "EH", ESP: "ES", EST: "EE", ETH: "ET", FIN: "FI", FJI: "FJ",
  FLK: "FK", FRA: "FR", FRO: "FO", FSM: "FM", GAB: "GA", GBR: "GB",
  GEO: "GE", GGY: "GG", GHA: "GH", GIB: "GI", GIN: "GN", GLP: "GP",
  GMB: "GM", GNB: "GW", GNQ: "GQ", GRC: "GR", GRD: "GD", GRL: "GL",
  GTM: "GT", GUF: "GF", GUM: "GU", GUY: "GY", HKG: "HK", HMD: "HM",
  HND: "HN", HRV: "HR", HTI: "HT", HUN: "HU", IDN: "ID", IMN: "IM",
  IND: "IN", IOT: "IO", IRL: "IE", IRN: "IR", IRQ: "IQ", ISL: "IS",
  ISR: "IL", ITA: "IT", JAM: "JM", JEY: "JE", JOR: "JO", JPN: "JP",
  KAZ: "KZ", KEN: "KE", KGZ: "KG", KHM: "KH", KIR: "KI", KNA: "KN",
  KOR: "KR", KWT: "KW", LAO: "LA", LBN: "LB", LBR: "LR", LBY: "LY",
  LCA: "LC", LIE: "LI", LKA: "LK", LSO: "LS", LTU: "LT", LUX: "LU",
  LVA: "LV", MAF: "MF", MAR: "MA", MCO: "MC", MDA: "MD", MDG: "MG",
  MDV: "MV", MEX: "MX", MHL: "MH", MKD: "MK", MLI: "ML", MLT: "MT",
  MMR: "MM", MNE: "ME", MNG: "MN", MNP: "MP", MOZ: "MZ", MRT: "MR",
  MSR: "MS", MTQ: "MQ", MUS: "MU", MWI: "MW", MYS: "MY", MYT: "YT",
  NAM: "NA", NCL: "NC", NER: "NE", NFK: "NF", NGA: "NG", NIC: "NI",
  NIU: "NU", NLD: "NL", NOR: "NO", NPL: "NP", NRU: "NR", NZL: "NZ",
  OMN: "OM", PAK: "PK", PAN: "PA", PCN: "PN", PER: "PE", PHL: "PH",
  PLW: "PW", PNG: "PG", POL: "PL", PRI: "PR", PRK: "KP", PRT: "PT",
  PRY: "PY", PSE: "PS", PYF: "PF", QAT: "QA", REU: "RE", ROU: "RO",
  RUS: "RU", RWA: "RW", SAU: "SA", SDN: "SD", SEN: "SN", SGP: "SG",
  SGS: "GS", SHN: "SH", SJM: "SJ", SLB: "SB", SLE: "SL", SLV: "SV",
  SMR: "SM", SOM: "SO", SPM: "PM", SRB: "RS", SUR: "SR", STP: "ST",
  SVK: "SK", SVN: "SI", SWE: "SE", SWZ: "SZ", SYC: "SC", SYR: "SY",
  TCA: "TC", TCD: "TD", TGO: "TG", THA: "TH", TJK: "TJ", TKL: "TK",
  TKM: "TM", TLS: "TL", TON: "TO", TTO: "TT", TUN: "TN", TUR: "TR",
  TUV: "TV", TWN: "TW", TZA: "TZ", UGA: "UG", UKR: "UA", UMI: "UM",
  URY: "UY", USA: "US", UZB: "UZ", VAT: "VA", VCT: "VC", VEN: "VE",
  VGB: "VG", VIR: "VI", VNM: "VN", VUT: "VU", WLF: "WF", WSM: "WS",
  XKX: "XK", YEM: "YE", ZAF: "ZA", ZMB: "ZM", ZWE: "ZW",
};

function mixHex(color: string, target: string, weight: number) {
  const normalize = (hex: string) => {
    const value = hex.replace("#", "");
    return value.length === 3
      ? value.split("").map(char => char + char).join("")
      : value;
  };

  const from = normalize(color);
  const to = normalize(target);
  const amount = Math.max(0, Math.min(1, weight));

  const channels = [0, 2, 4].map(index => {
    const start = Number.parseInt(from.slice(index, index + 2), 16);
    const end = Number.parseInt(to.slice(index, index + 2), 16);
    return Math.round(start + (end - start) * amount)
      .toString(16)
      .padStart(2, "0");
  });

  return `#${channels.join("")}`;
}

export function formatVisitors(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function normalizeCountryCode(value: string | null | undefined) {
  return value?.trim().toUpperCase() ?? "";
}

export function normalizeMetrics(data: WorldHeatmapData) {
  const entries = Object.entries(data)
    .map(([countryCode, visitors]) => ({
      countryCode: normalizeCountryCode(countryCode),
      visitors: Number(visitors) || 0,
    }))
    .filter(({ countryCode, visitors }) => Boolean(countryCode) && visitors >= 0);

  const total = entries.reduce((sum, entry) => sum + entry.visitors, 0);

  return entries.map(entry => ({
    ...entry,
    percentage: total > 0 ? (entry.visitors / total) * 100 : 0,
  }));
}

export function resolveMapCountryCode(feature: WorldCountryFeature) {
  return ISO_COUNTRIES[String(feature.id)] ?? "";
}

export function getCountryName(code: string) {
  if (!code) return "Unknown";
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) || code;
  } catch {
    return code;
  }
}

export function getCountryMetric(
  feature: WorldCountryFeature,
  data: WorldHeatmapData
): WorldHeatmapMetric | null {
  const countryCode = resolveMapCountryCode(feature);

  if (!countryCode || countryCode === "AQ") return null;

  const metrics = normalizeMetrics(data);
  const country = metrics.find(entry => entry.countryCode === countryCode);

  return {
    countryCode,
    countryName: getCountryName(countryCode),
    visitors: country?.visitors || 0,
    percentage: country?.percentage || 0,
  };
}

export function getMapColors(isLightTheme: boolean) {
  return {
    baseColor: isLightTheme ? "#1d4ed8" : "#3b82f6",
    fillColor: isLightTheme ? "#ffffff" : "#171717",
    strokeColor: isLightTheme ? "#9db8ee" : "#2f6fda",
    hoverColor: isLightTheme ? "#1d4ed8" : "#7eb2ff",
  };
}

/**
 * --- Heatmap ramp knobs --------------------------------------------------
 *
 * Two numbers control how strong the country shading is. Tweak these.
 *
 *  HEATMAP_RAMP_GAMMA — curve shape (default 0.55)
 *    < 1   smaller numbers push mid-traffic countries TOWARDS strong blue
 *          (more countries look "popular"). 0.4 = very punchy, 0.55 = balanced.
 *    = 1   linear — fill is exactly proportional to share of top country.
 *    > 1   flatter — even mid countries stay pale, only the top stands out.
 *
 *  HEATMAP_RAMP_FLOOR — minimum tint for any country with traffic > 0
 *    0    smallest countries are almost invisible (blends with background).
 *    0.1  faint hint (current).
 *    0.2  every "has data" country is clearly visible from zero-data ones.
 *
 * Hover, stroke and background are in `getMapColors` above. The top blue is
 * `--dash-blue` (from globals.css) in light mode, else the dark-mode default.
 */
const HEATMAP_RAMP_GAMMA = 0.55;
const HEATMAP_RAMP_FLOOR = 0.18;

export function getCountryTrafficColor(
  countryCode: string,
  data: WorldHeatmapData,
  isLightTheme: boolean,
  colors = getMapColors(isLightTheme)
) {
  if (!countryCode || countryCode === "AQ") {
    return "transparent";
  }

  const metrics = normalizeMetrics(data);
  const country = metrics.find(entry => entry.countryCode === countryCode);

  if (!country || country.visitors <= 0) {
    return colors.fillColor;
  }

  const maxVisitors = metrics.reduce(
    (max, entry) => Math.max(max, entry.visitors),
    0,
  );
  const rawRatio = maxVisitors > 0 ? country.visitors / maxVisitors : 0;
  const t = Math.max(
    HEATMAP_RAMP_FLOOR,
    Math.min(1, Math.pow(rawRatio, HEATMAP_RAMP_GAMMA)),
  );

  return mixHex(colors.fillColor, colors.baseColor, t);
}
