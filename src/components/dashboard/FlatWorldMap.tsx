"use client";

/**
 * Flat vector world map for the observability geography section.
 *
 * Renders a solid-black land mass on a dark surface (no tiles/roads/labels)
 * with latency-colored glowing city markers and hover tooltips. Built on
 * react-simple-maps so it reuses the world geojson already shipped in /public
 * and needs no Mapbox token.
 *
 * A zoom-adaptive capsule layer sits on top of the dots: at world view nearby
 * countries aggregate into a single pill ("37 | 12 countries"), zooming in
 * progressively splits clusters into per-country pills ("76 | Brazil") and,
 * past CITY_CAPSULE_ZOOM, per-city pills ("12 | Mumbai"). Clustering runs in
 * projected screen space on discrete zoom buckets only (never per frame) and
 * the layer is memoized so pan/zoom gestures just transform existing SVG.
 */

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as ReactSimpleMaps from "react-simple-maps";
import { Maximize, ZoomIn, ZoomOut } from "lucide-react";
import type { CityDataPoint } from "@/lib/redux";
import { MAP_FILE } from "@/components/analytics/map-utils";
import {
    getCountryFlagSrc,
    normalizeCountryDisplayName,
} from "./country-flags";

const { ComposableMap, Geographies, Geography, Marker } = ReactSimpleMaps;
const ZoomableGroup = (ReactSimpleMaps as typeof ReactSimpleMaps & {
    ZoomableGroup?: import("react").ComponentType<Record<string, unknown>>;
}).ZoomableGroup;

const MAP_WIDTH = 980;
const MAP_HEIGHT = 520;
const PROJECTION_SCALE = 150;
const PROJECTION_CENTER: [number, number] = [0, 22];

const MIN_ZOOM = 1;
const MAX_ZOOM = 8;

/** Screen-space radius (in base SVG units) within which markers merge. */
const CLUSTER_RADIUS_PX = 88;
/** At and beyond this zoom, capsules switch from country to city granularity. */
const CITY_CAPSULE_ZOOM = 5;
/** Hard cap so pathological datasets can't flood the SVG with pills. */
const MAX_CAPSULES = 80;
const CAPSULE_HEIGHT = 20;

function getLatencyColor(p95: number): string {
    if (p95 <= 100) return "#22c55e";
    if (p95 <= 250) return "#f59e0b";
    return "#ef4444";
}

function formatNumber(num: number): string {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}k`;
    return num.toString();
}

type ThemeColors = {
    background: string;
    land: string;
    landStroke: string;
    landStrokeWidth: number;
    capsuleBg: string;
    capsuleBorder: string;
    capsuleText: string;
    capsuleMuted: string;
    capsuleDivider: string;
};

function getThemeColors(isLight: boolean): ThemeColors {
    if (isLight) {
        return {
            background: "#f4f4f5",
            land: "#ffffff",
            landStroke: "#cfcfd6",
            landStrokeWidth: 0.6,
            capsuleBg: "rgba(255,255,255,0.95)",
            capsuleBorder: "#d4d4d8",
            capsuleText: "#18181b",
            capsuleMuted: "#71717a",
            capsuleDivider: "rgba(0,0,0,0.14)",
        };
    }
    return {
        background: "#171717",
        land: "#000000",
        landStroke: "#2a2a2a",
        landStrokeWidth: 0.5,
        capsuleBg: "rgba(36,36,39,0.92)",
        capsuleBorder: "rgba(255,255,255,0.14)",
        capsuleText: "#f4f4f5",
        capsuleMuted: "#a1a1aa",
        capsuleDivider: "rgba(255,255,255,0.16)",
    };
}

const RAD = Math.PI / 180;

/**
 * Mercator projection matching the ComposableMap config above. Translation is
 * irrelevant here — clustering only needs relative distances, and centroids
 * round-trip through the matching inverse before rendering via <Marker>.
 */
function projectMercator(lon: number, lat: number): [number, number] {
    const clampedLat = Math.max(-85, Math.min(85, lat));
    return [
        PROJECTION_SCALE * lon * RAD,
        -PROJECTION_SCALE *
            Math.log(Math.tan(Math.PI / 4 + (clampedLat * RAD) / 2)),
    ];
}

function unprojectMercator(x: number, y: number): [number, number] {
    return [
        x / (PROJECTION_SCALE * RAD),
        (2 * Math.atan(Math.exp(-y / PROJECTION_SCALE)) - Math.PI / 2) / RAD,
    ];
}

/** Half-octave zoom buckets so clustering reruns on coarse steps only. */
const getZoomBucket = (zoom: number): number =>
    Math.round(Math.log2(Math.max(zoom, MIN_ZOOM)) * 2);
const zoomForBucket = (bucket: number): number => 2 ** (bucket / 2);

type CapsuleDatum = {
    key: string;
    coordinates: [number, number];
    requests: number;
    p95: number;
    label: string;
    /** Set when every member belongs to one country (click selects it). */
    country: string | null;
    memberCount: number;
};

type ClusterItem = {
    name: string;
    country: string;
    requests: number;
    p95Weighted: number;
    x: number;
    y: number;
};

function buildCapsules(cities: CityDataPoint[], zoom: number): CapsuleDatum[] {
    if (!cities.length) return [];
    const useCityLevel = zoom >= CITY_CAPSULE_ZOOM;

    const items: ClusterItem[] = [];
    if (useCityLevel) {
        for (const city of cities) {
            const [lon, lat] = city.coordinates ?? [];
            if (!Number.isFinite(lon) || !Number.isFinite(lat)) continue;
            const [x, y] = projectMercator(lon, lat);
            items.push({
                name: city.city,
                country: city.country,
                requests: city.requests,
                p95Weighted: city.p95 * city.requests,
                x,
                y,
            });
        }
    } else {
        const byCountry = new Map<string, ClusterItem>();
        for (const city of cities) {
            const [lon, lat] = city.coordinates ?? [];
            if (!Number.isFinite(lon) || !Number.isFinite(lat)) continue;
            const [x, y] = projectMercator(lon, lat);
            const existing = byCountry.get(city.country);
            if (existing) {
                // Request-weighted running centroid keeps the pill anchored
                // near the country's traffic center of mass.
                const total = existing.requests + city.requests;
                existing.x =
                    (existing.x * existing.requests + x * city.requests) /
                    (total || 1);
                existing.y =
                    (existing.y * existing.requests + y * city.requests) /
                    (total || 1);
                existing.requests = total;
                existing.p95Weighted += city.p95 * city.requests;
            } else {
                byCountry.set(city.country, {
                    name: city.country,
                    country: city.country,
                    requests: city.requests,
                    p95Weighted: city.p95 * city.requests,
                    x,
                    y,
                });
            }
        }
        items.push(...byCountry.values());
    }

    // Greedy clustering in projected space. Distances are tested against each
    // cluster's seed (its highest-traffic member), which guarantees pills stay
    // at least CLUSTER_RADIUS_PX apart on screen.
    const radius = CLUSTER_RADIUS_PX / zoom;
    const radiusSq = radius * radius;
    items.sort((a, b) => b.requests - a.requests);

    type Cluster = {
        seed: ClusterItem;
        requests: number;
        p95Weighted: number;
        members: ClusterItem[];
    };
    const clusters: Cluster[] = [];
    for (const item of items) {
        let host: Cluster | null = null;
        for (const cluster of clusters) {
            const dx = cluster.seed.x - item.x;
            const dy = cluster.seed.y - item.y;
            if (dx * dx + dy * dy <= radiusSq) {
                host = cluster;
                break;
            }
        }
        if (host) {
            host.requests += item.requests;
            host.p95Weighted += item.p95Weighted;
            host.members.push(item);
        } else {
            clusters.push({
                seed: item,
                requests: item.requests,
                p95Weighted: item.p95Weighted,
                members: [item],
            });
        }
    }

    return clusters
        .sort((a, b) => b.requests - a.requests)
        .slice(0, MAX_CAPSULES)
        .map((cluster) => {
            const { seed, members } = cluster;
            const single = members.length === 1;
            const label = single
                ? useCityLevel
                    ? seed.name
                    : normalizeCountryDisplayName(seed.name)
                : `${members.length} ${useCityLevel ? "cities" : "countries"}`;
            const sameCountry = members.every(
                (member) => member.country === seed.country
            );
            return {
                key: `${useCityLevel ? "city" : "country"}-${seed.name}-${seed.country}`,
                coordinates: unprojectMercator(seed.x, seed.y),
                requests: cluster.requests,
                p95:
                    cluster.requests > 0
                        ? Math.round(cluster.p95Weighted / cluster.requests)
                        : 0,
                label,
                country: sameCountry ? seed.country : null,
                memberCount: members.length,
            };
        });
}

const estimateTextWidth = (text: string, fontSize: number, factor: number) =>
    text.length * fontSize * factor;

type TooltipState = {
    x: number;
    y: number;
    city: CityDataPoint;
};

interface FlatWorldMapProps {
    cities: CityDataPoint[];
    selectedCountry: string | null;
    onSelectCountry: (country: string | null) => void;
    isLightTheme: boolean;
    className?: string;
}

export function FlatWorldMap({
    cities,
    selectedCountry,
    onSelectCountry,
    isLightTheme,
    className = "",
}: FlatWorldMapProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [tooltip, setTooltip] = useState<TooltipState | null>(null);
    const [position, setPosition] = useState<{
        coordinates: [number, number];
        zoom: number;
    }>({ coordinates: [0, 22], zoom: 1 });

    const colors = useMemo(() => getThemeColors(isLightTheme), [isLightTheme]);

    // Prevent touchpad pinch from zooming the whole page over the map.
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        const preventPageZoom = (event: WheelEvent) => {
            if (event.ctrlKey) event.preventDefault();
        };
        container.addEventListener("wheel", preventPageZoom, {
            passive: false,
        });
        return () =>
            container.removeEventListener("wheel", preventPageZoom);
    }, []);

    const inverseZoom = 1 / position.zoom;

    // Re-cluster only when the discrete zoom bucket changes (position.zoom is
    // itself only committed on gesture end via onMoveEnd), never per frame.
    const zoomBucket = getZoomBucket(position.zoom);
    const capsules = useMemo(
        () => buildCapsules(cities, zoomForBucket(zoomBucket)),
        [cities, zoomBucket]
    );

    const showTooltip = useCallback(
        (event: React.MouseEvent, city: CityDataPoint) => {
            const bounds = containerRef.current?.getBoundingClientRect();
            setTooltip({
                x: bounds ? event.clientX - bounds.left : event.clientX,
                y: bounds ? event.clientY - bounds.top : event.clientY,
                city,
            });
        },
        []
    );

    const clearTooltip = useCallback(() => setTooltip(null), []);

    const setZoom = useCallback((next: number) => {
        setPosition((prev) => ({
            ...prev,
            zoom: Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, next)),
        }));
    }, []);

    const focusCluster = useCallback((coordinates: [number, number]) => {
        setPosition((prev) => ({
            coordinates,
            zoom: Math.min(MAX_ZOOM, prev.zoom * 2),
        }));
    }, []);

    const resetView = useCallback(() => {
        setPosition({ coordinates: [0, 22], zoom: 1 });
        onSelectCountry(null);
    }, [onSelectCountry]);

    return (
        <div
            ref={containerRef}
            data-geo-map
            className={`relative h-full w-full overflow-hidden ${className}`}
            style={{ background: colors.background, touchAction: "none" }}
        >
            <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                    scale: PROJECTION_SCALE,
                    center: PROJECTION_CENTER,
                }}
                width={MAP_WIDTH}
                height={MAP_HEIGHT}
                style={{ width: "100%", height: "100%" }}
            >
                <title>Geography map</title>
                {ZoomableGroup ? (
                    <ZoomableGroup
                        center={position.coordinates}
                        zoom={position.zoom}
                        minZoom={MIN_ZOOM}
                        maxZoom={MAX_ZOOM}
                        onMoveEnd={({
                            coordinates,
                            zoom,
                        }: {
                            coordinates: number[];
                            zoom: number;
                        }) =>
                            setPosition({
                                coordinates: coordinates as [number, number],
                                zoom,
                            })
                        }
                    >
                        <MapBody
                            colors={colors}
                            cities={cities}
                            selectedCountry={selectedCountry}
                            inverseZoom={inverseZoom}
                            onSelectCountry={onSelectCountry}
                            onHoverCity={showTooltip}
                            onLeaveCity={clearTooltip}
                        />
                        <CapsuleLayer
                            capsules={capsules}
                            inverseZoom={inverseZoom}
                            colors={colors}
                            selectedCountry={selectedCountry}
                            onSelectCountry={onSelectCountry}
                            onFocusCluster={focusCluster}
                        />
                    </ZoomableGroup>
                ) : (
                    <>
                        <MapBody
                            colors={colors}
                            cities={cities}
                            selectedCountry={selectedCountry}
                            inverseZoom={inverseZoom}
                            onSelectCountry={onSelectCountry}
                            onHoverCity={showTooltip}
                            onLeaveCity={clearTooltip}
                        />
                        <CapsuleLayer
                            capsules={capsules}
                            inverseZoom={inverseZoom}
                            colors={colors}
                            selectedCountry={selectedCountry}
                            onSelectCountry={onSelectCountry}
                            onFocusCluster={focusCluster}
                        />
                    </>
                )}
            </ComposableMap>

            {/* Zoom controls */}
            <div className="absolute bottom-4 left-4 z-[400] flex flex-col gap-2">
                <button
                    type="button"
                    onClick={() => setZoom(position.zoom + 1)}
                    className="dashboard-button-secondary h-9 w-9 p-0"
                    aria-label="Zoom in"
                    title="Zoom in"
                >
                    <ZoomIn className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onClick={() => setZoom(position.zoom - 1)}
                    className="dashboard-button-secondary h-9 w-9 p-0"
                    aria-label="Zoom out"
                    title="Zoom out"
                >
                    <ZoomOut className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onClick={resetView}
                    className="dashboard-button-secondary h-9 w-9 p-0"
                    aria-label="Reset map view"
                    title="Reset view"
                >
                    <Maximize className="h-4 w-4" />
                </button>
            </div>

            {tooltip ? (
                <div
                    className="pointer-events-none absolute z-[500] -translate-x-1/2 -translate-y-[calc(100%+12px)] whitespace-nowrap rounded-md border border-[color:var(--dash-border)] bg-[color:var(--dash-surface)]/95 px-3 py-2 shadow-[var(--dash-menu-shadow)] backdrop-blur-sm"
                    style={{ left: tooltip.x, top: tooltip.y }}
                >
                    <div className="mb-1 flex items-center gap-2">
                        {getCountryFlagSrc(tooltip.city.country) ? (
                            <img
                                src={getCountryFlagSrc(tooltip.city.country)!}
                                alt=""
                                className="h-3.5 w-5 rounded-[2px] object-cover"
                                loading="lazy"
                            />
                        ) : null}
                        <span className="text-xs font-medium text-[color:var(--dash-text)]">
                            {tooltip.city.city}
                        </span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px]">
                        <span className="text-[color:var(--dash-text-soft)]">
                            {formatNumber(tooltip.city.requests)} requests
                        </span>
                        <span
                            className="font-mono"
                            style={{ color: getLatencyColor(tooltip.city.p95) }}
                        >
                            p95: {tooltip.city.p95}ms
                        </span>
                    </div>
                </div>
            ) : null}
        </div>
    );
}

interface CapsuleLayerProps {
    capsules: CapsuleDatum[];
    inverseZoom: number;
    colors: ThemeColors;
    selectedCountry: string | null;
    onSelectCountry: (country: string | null) => void;
    onFocusCluster: (coordinates: [number, number]) => void;
}

/**
 * Pill-shaped cluster labels rendered above the city dots. Memoized so hover
 * tooltips and unrelated parent updates don't touch it; during pan/zoom
 * gestures the surrounding ZoomableGroup transform moves the existing SVG and
 * this layer only re-renders once the gesture commits a new zoom.
 */
const CapsuleLayer = memo(function CapsuleLayer({
    capsules,
    inverseZoom,
    colors,
    selectedCountry,
    onSelectCountry,
    onFocusCluster,
}: CapsuleLayerProps) {
    return (
        <>
            {capsules.map((capsule) => {
                const statusColor = getLatencyColor(capsule.p95);
                const countText = formatNumber(capsule.requests);
                const dimmed =
                    !!selectedCountry && capsule.country !== selectedCountry;

                const countWidth = estimateTextWidth(countText, 9.5, 0.64);
                const labelWidth = estimateTextWidth(capsule.label, 9.5, 0.56);
                const dividerX = 19 + countWidth + 7;
                const labelX = dividerX + 8;
                const width = labelX + labelWidth + 10;

                return (
                    <Marker
                        key={capsule.key}
                        coordinates={capsule.coordinates}
                        onClick={() => {
                            if (capsule.country) {
                                onSelectCountry(capsule.country);
                            } else {
                                onFocusCluster(capsule.coordinates);
                            }
                        }}
                    >
                        {/* scale() first so the offset stays constant in screen px */}
                        <g
                            transform={`scale(${inverseZoom}) translate(${-width / 2}, ${-(CAPSULE_HEIGHT + 12)})`}
                            style={{ cursor: "pointer" }}
                            opacity={dimmed ? 0.3 : 1}
                        >
                            <rect
                                width={width}
                                height={CAPSULE_HEIGHT}
                                rx={CAPSULE_HEIGHT / 2}
                                fill={colors.capsuleBg}
                                stroke={colors.capsuleBorder}
                                strokeWidth={1}
                            />
                            <circle
                                cx={11.5}
                                cy={CAPSULE_HEIGHT / 2}
                                r={3}
                                fill={statusColor}
                            />
                            <text
                                x={19}
                                y={CAPSULE_HEIGHT / 2}
                                dominantBaseline="central"
                                fontSize={9.5}
                                fontWeight={600}
                                fill={colors.capsuleText}
                                style={{
                                    fontFamily:
                                        "ui-monospace, SFMono-Regular, Menlo, monospace",
                                }}
                            >
                                {countText}
                            </text>
                            <line
                                x1={dividerX}
                                y1={5}
                                x2={dividerX}
                                y2={CAPSULE_HEIGHT - 5}
                                stroke={colors.capsuleDivider}
                                strokeWidth={1}
                            />
                            <text
                                x={labelX}
                                y={CAPSULE_HEIGHT / 2}
                                dominantBaseline="central"
                                fontSize={9.5}
                                fill={colors.capsuleMuted}
                            >
                                {capsule.label}
                            </text>
                        </g>
                    </Marker>
                );
            })}
        </>
    );
});

interface MapBodyProps {
    colors: ThemeColors;
    cities: CityDataPoint[];
    selectedCountry: string | null;
    inverseZoom: number;
    onSelectCountry: (country: string | null) => void;
    onHoverCity: (event: React.MouseEvent, city: CityDataPoint) => void;
    onLeaveCity: () => void;
}

function MapBody({
    colors,
    cities,
    selectedCountry,
    inverseZoom,
    onSelectCountry,
    onHoverCity,
    onLeaveCity,
}: MapBodyProps) {
    return (
        <>
            <Geographies geography={MAP_FILE}>
                {({ geographies }) =>
                    geographies.map((geo) => (
                        <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill={colors.land}
                            stroke={colors.landStroke}
                            strokeWidth={colors.landStrokeWidth}
                            style={{
                                default: {
                                    outline: "none",
                                    pointerEvents: "none",
                                },
                                hover: {
                                    outline: "none",
                                    pointerEvents: "none",
                                },
                                pressed: {
                                    outline: "none",
                                    pointerEvents: "none",
                                },
                            }}
                        />
                    ))
                }
            </Geographies>

            {/* Individual city dots (latency-colored, with glow) */}
            {cities.map((city, index) => {
                if (
                    !Number.isFinite(city.coordinates?.[0]) ||
                    !Number.isFinite(city.coordinates?.[1])
                ) {
                    return null;
                }
                const color = getLatencyColor(city.p95);
                const dimmed =
                    !!selectedCountry && city.country !== selectedCountry;
                const radius =
                    Math.max(1.6, Math.min(4.5, Math.sqrt(city.requests) * 0.12)) *
                    inverseZoom;

                return (
                    <Marker
                        key={`dot-${city.city}-${city.country}-${index}`}
                        coordinates={city.coordinates}
                        onMouseEnter={(event) => onHoverCity(event, city)}
                        onMouseMove={(event) => onHoverCity(event, city)}
                        onMouseLeave={onLeaveCity}
                        onClick={() => onSelectCountry(city.country)}
                    >
                        <g
                            style={{ cursor: "pointer" }}
                            opacity={dimmed ? 0.25 : 1}
                        >
                            {/* Pulsing radar ring */}
                            <circle r={radius} fill={color} opacity={0.35}>
                                <animate
                                    attributeName="r"
                                    from={radius}
                                    to={radius * 3.4}
                                    dur="2.4s"
                                    begin={`${(index % 5) * 0.45}s`}
                                    repeatCount="indefinite"
                                />
                                <animate
                                    attributeName="opacity"
                                    from={0.35}
                                    to={0}
                                    dur="2.4s"
                                    begin={`${(index % 5) * 0.45}s`}
                                    repeatCount="indefinite"
                                />
                            </circle>
                            <circle
                                r={radius}
                                fill={color}
                                stroke={color}
                                strokeOpacity={0.9}
                                strokeWidth={0.5 * inverseZoom}
                            />
                        </g>
                    </Marker>
                );
            })}
        </>
    );
}
