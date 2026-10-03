'use client'

import { useState, useEffect, useCallback, type ReactNode } from 'react'
import Link from 'next/link'
import { DashboardMetricCard } from '@/components/dashboard/DashboardMetricCard'
import { DashboardMetricDelta } from '@/components/dashboard/DashboardMetricDelta'
import {
  dashboardChartHeight,
  dashboardMetricGridFourClass,
  dashboardPanelBodyClass,
  dashboardPanelHeaderClass,
} from '@/components/dashboard/chart-layout'
import { Skeleton } from '@/components/dashboard/DashboardSkeleton'
import { ExportDropdown } from '@/components/dashboard/ExportDropdown'
import { exportCSV, exportJSON, exportFilename, type ExportColumn } from '@/lib/core/export'
import {
  selectFilters,
  setFilter,
  useAllowedTimeRanges,
  useAppDispatch,
  useAppSelector,
  type TimeRange,
} from '@/lib/redux'
import {
  Area,
  ComposedChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
  Cell,
} from 'recharts'

const tooltipStyle = {
  backgroundColor: 'var(--dash-surface)',
  border: '1px solid var(--dash-border)',
  borderRadius: 8,
  color: 'var(--dash-text)',
  boxShadow: 'var(--dash-menu-shadow)',
}

const TABLE_WRAP = 'overflow-x-auto'
const TH_BASE =
  'px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.16em] text-[color:var(--dash-text-muted)] sm:px-5'
const TH = `${TH_BASE} text-left`
const TH_CENTER = `${TH_BASE} text-center`
const TD = 'px-4 py-2.5 sm:px-5'
const TR =
  'border-b border-[color:var(--dash-divider)] last:border-b-0 hover:bg-[color:var(--dash-surface-hover)]'
const THEAD = 'border-b border-[color:var(--dash-divider)]'
const BTN_SECONDARY =
  'mt-3 rounded-md border border-[color:var(--dash-border)] bg-[color:var(--dash-surface)] px-3 py-2 text-sm font-medium text-[color:var(--dash-text)] shadow-[var(--dash-control-shadow)] transition-colors hover:bg-[color:var(--dash-surface-hover)]'
const BTN_PRIMARY =
  'mt-3 inline-flex items-center rounded-md border border-[color:var(--dash-border)] bg-[color:var(--dash-blue)] px-4 py-2 text-sm font-medium text-[color:var(--dash-text-on-accent)] shadow-[var(--dash-control-shadow)] transition-colors hover:bg-[color:var(--dash-blue-hover)]'

/** Delta comparison window label — API uses the same range shifted back one calendar month. */
const SEARCH_CONSOLE_DELTA_LABEL = 'month'

const SEARCH_CONSOLE_RANGES: TimeRange[] = ['24h', '7d', '30d', '90d', '1y']

const TIMESERIES_EXPORT_COLUMNS: ExportColumn<{
  date: string
  clicks: number
  impressions: number
  ctr: number
  position: number
}>[] = [
  { key: 'date', header: 'Date' },
  { key: 'clicks', header: 'Clicks' },
  { key: 'impressions', header: 'Impressions' },
  { key: 'ctr', header: 'CTR' },
  { key: 'position', header: 'Position' },
]

function PageHeader({
  propertyLabel,
  range,
  timeRanges,
  onRangeChange,
  onExportCSV,
  onExportJSON,
  exportDisabled,
}: {
  propertyLabel?: string | null
  range: TimeRange
  timeRanges: ReturnType<typeof useAllowedTimeRanges>
  onRangeChange: (range: TimeRange) => void
  onExportCSV: () => void
  onExportJSON: () => void
  exportDisabled: boolean
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-xl font-semibold tracking-tight text-[color:var(--dash-text)]">
          Search Console
        </h1>
        <p className="mt-1 text-sm text-[color:var(--dash-text-soft)]">
          Search clicks, impressions, and ranking from Google Search Console
          {propertyLabel ? (
            <span className="text-[color:var(--dash-text-muted)]"> · {propertyLabel}</span>
          ) : null}
        </p>
      </div>

      <div className="flex self-start items-center gap-2">
        <div className="dashboard-control flex flex-wrap shrink-0 p-0.5">
          {timeRanges.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => !item.disabled && onRangeChange(item.value)}
              disabled={item.disabled}
              title={item.disabled ? 'Upgrade plan for longer retention' : undefined}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                item.disabled
                  ? 'cursor-not-allowed text-[color:var(--dash-text-muted)] opacity-45'
                  : range === item.value
                    ? 'bg-[color:var(--dash-blue)] text-[color:var(--dash-text-on-accent)] shadow-[var(--dash-button-shadow)]'
                    : 'text-[color:var(--dash-text-soft)] hover:text-[color:var(--dash-text)]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <ExportDropdown
          onExportCSV={onExportCSV}
          onExportJSON={onExportJSON}
          disabled={exportDisabled}
        />
      </div>
    </div>
  )
}

function SectionPanel({
  title,
  description,
  children,
  bodyClassName = dashboardPanelBodyClass,
}: {
  title: string
  description?: string
  children: ReactNode
  bodyClassName?: string
}) {
  return (
    <section className="dashboard-panel min-w-0 overflow-hidden">
      <div className={dashboardPanelHeaderClass}>
        <h2 className="text-sm font-semibold text-[color:var(--dash-text)]">{title}</h2>
        {description ? (
          <p className="mt-1 text-xs text-[color:var(--dash-text-soft)]">{description}</p>
        ) : null}
      </div>
      <div className={bodyClassName}>{children}</div>
    </section>
  )
}

function EmptyState({
  title,
  description,
  tone = 'default',
  action,
}: {
  title: string
  description: string
  tone?: 'default' | 'danger'
  action?: ReactNode
}) {
  return (
    <div className="dashboard-panel p-10 text-center">
      <p
        className={`text-sm font-medium ${
          tone === 'danger' ? 'text-[color:var(--dash-danger)]' : 'text-[color:var(--dash-text)]'
        }`}
      >
        {title}
      </p>
      <p className="mt-2 text-sm text-[color:var(--dash-text-soft)]">{description}</p>
      {action}
    </div>
  )
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString()
}

function formatPercent(n: number): string {
  return `${(n * 100).toFixed(1)}%`
}

function formatPosition(n: number): string {
  return n.toFixed(1)
}

/** Display pathname only; keep full URL for title/hover. */
function pagePathLabel(page: string): string {
  try {
    return new URL(page).pathname || '/'
  } catch {
    return page.startsWith('/') ? page : page || '/'
  }
}

interface SearchConsoleOverview {
  totalClicks: number
  totalImpressions: number
  avgCtr: number
  avgPosition: number
}

interface SearchConsoleData {
  matchedSite: string | null
  matchedSiteType: 'url-prefix' | 'domain' | null
  error?: 'NO_CONNECTION' | 'NO_MATCHING_PROPERTY' | 'GSC_ERROR' | 'NO_DOMAIN'
  overview: SearchConsoleOverview
  previousOverview: SearchConsoleOverview | null
  timeseries: Array<{
    date: string
    clicks: number
    impressions: number
    ctr: number
    position: number
  }>
  topQueries: Array<{
    query: string
    clicks: number
    impressions: number
    ctr: number
    position: number
  }>
  topPages: Array<{
    page: string
    clicks: number
    impressions: number
    ctr: number
    position: number
  }>
  countries: Array<{
    country: string
    clicks: number
    impressions: number
    ctr: number
    position: number
  }>
  devices: Array<{
    device: string
    clicks: number
    impressions: number
    ctr: number
    position: number
  }>
}

function countryName(code: string): string {
  const names: Record<string, string> = {
    USA: 'United States',
    GBR: 'United Kingdom',
    DEU: 'Germany',
    FRA: 'France',
    JPN: 'Japan',
    CAN: 'Canada',
    AUS: 'Australia',
    IND: 'India',
    BRA: 'Brazil',
    NLD: 'Netherlands',
    ESP: 'Spain',
    ITA: 'Italy',
    MEX: 'Mexico',
    KOR: 'South Korea',
    RUS: 'Russia',
    CHN: 'China',
    IDN: 'Indonesia',
    TUR: 'Turkey',
    SAU: 'Saudi Arabia',
    CHE: 'Switzerland',
    SWE: 'Sweden',
    POL: 'Poland',
    BEL: 'Belgium',
    NOR: 'Norway',
    DNK: 'Denmark',
    FIN: 'Finland',
    AUT: 'Austria',
    IRL: 'Ireland',
    PRT: 'Portugal',
    GRC: 'Greece',
    CZE: 'Czech Republic',
    ROU: 'Romania',
    HUN: 'Hungary',
    UKR: 'Ukraine',
    ARG: 'Argentina',
    COL: 'Colombia',
    CHL: 'Chile',
    PER: 'Peru',
    NZL: 'New Zealand',
    ZAF: 'South Africa',
    ARE: 'United Arab Emirates',
    SGP: 'Singapore',
    MYS: 'Malaysia',
    THA: 'Thailand',
    VNM: 'Vietnam',
    PHL: 'Philippines',
    PAK: 'Pakistan',
    NGA: 'Nigeria',
    EGY: 'Egypt',
    ISR: 'Israel',
    TWN: 'Taiwan',
    HKG: 'Hong Kong',
  }
  return names[code] ?? code
}

function deviceLabel(device: string): string {
  return device.charAt(0).toUpperCase() + device.slice(1).toLowerCase()
}

const skeleton = (
  <div className="flex flex-col gap-5">
    <div className={dashboardMetricGridFourClass}>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="dashboard-panel dashboard-metric-card min-w-0 px-4 py-3">
          <Skeleton className="mb-1.5 h-2.5 w-20" />
          <Skeleton className="h-7 w-24" />
          <Skeleton className="mt-1 h-2.5 w-16" />
        </div>
      ))}
    </div>
    <section className="dashboard-panel min-w-0 overflow-hidden">
      <div className={dashboardPanelHeaderClass}>
        <Skeleton className="h-4 w-48" />
      </div>
      <div className={dashboardPanelBodyClass}>
        <Skeleton className={`${dashboardChartHeight.wide} w-full rounded-md`} />
      </div>
    </section>
  </div>
)

interface SearchConsoleViewProps {
  projectId: string
  projectDomain: string | null
}

export function SearchConsoleView({ projectId, projectDomain }: SearchConsoleViewProps) {
  const dispatch = useAppDispatch()
  const filters = useAppSelector(selectFilters('searchConsole')) as { range: string }
  const timeRanges = useAllowedTimeRanges(SEARCH_CONSOLE_RANGES)
  const rawRange = (filters.range || '30d') as TimeRange
  const range =
    timeRanges.some((item) => !item.disabled && item.value === rawRange)
      ? rawRange
      : ((timeRanges.find((item) => !item.disabled)?.value ?? '30d') as TimeRange)

  const [data, setData] = useState<SearchConsoleData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    if (rawRange === range) return
    dispatch(setFilter({ page: 'searchConsole', key: 'range', value: range }))
  }, [dispatch, range, rawRange])

  const setRange = useCallback(
    (nextRange: TimeRange) => {
      dispatch(setFilter({ page: 'searchConsole', key: 'range', value: nextRange }))
    },
    [dispatch],
  )

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setFetchError(null)
    try {
      const res = await fetch(
        `/api/projects/${projectId}/search-console?range=${encodeURIComponent(range)}`,
      )
      const json = await res.json() as SearchConsoleData & { error?: string }
      if (!res.ok) throw new Error(json.error ?? 'Failed to load search console data')
      setData(json)
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setIsLoading(false)
    }
  }, [projectId, range])

  useEffect(() => {
    void fetchData()
  }, [fetchData])

  const handleExportCSV = useCallback(() => {
    if (!data?.timeseries.length) return
    exportCSV(
      data.timeseries,
      TIMESERIES_EXPORT_COLUMNS,
      exportFilename('search-console', projectId, range, 'csv'),
    )
  }, [data, projectId, range])

  const handleExportJSON = useCallback(() => {
    if (!data) return
    exportJSON(data, exportFilename('search-console', projectId, range, 'json'))
  }, [data, projectId, range])

  let body: ReactNode = null

  if (isLoading) {
    body = skeleton
  } else if (fetchError) {
    body = (
      <EmptyState
        title="Failed to load search console data"
        description={fetchError}
        tone="danger"
        action={
          <button type="button" onClick={fetchData} className={BTN_SECONDARY}>
            Retry
          </button>
        }
      />
    )
  } else if (data?.error === 'NO_CONNECTION') {
    body = (
      <EmptyState
        title="Connect Google Search Console"
        description="Connect your Google Search Console account to see search performance data for this project."
        action={
          <Link href="/dashboard/connections" className={BTN_PRIMARY}>
            Go to Connections
          </Link>
        }
      />
    )
  } else if (data?.error === 'NO_DOMAIN') {
    body = (
      <EmptyState
        title="No domain configured"
        description="Add a domain to this project in Settings to see Search Console data."
      />
    )
  } else if (data?.error === 'NO_MATCHING_PROPERTY') {
    body = (
      <EmptyState
        title="No matching Search Console property"
        description={`We couldn't find "${projectDomain ?? 'your domain'}" in your Google Search Console account. Make sure the site has been added and verified.`}
      />
    )
  } else if (data?.error === 'GSC_ERROR') {
    body = (
      <EmptyState
        title="Search Console API error"
        description="Google Search Console returned an error. This may be temporary — try again."
        tone="danger"
        action={
          <button type="button" onClick={fetchData} className={BTN_SECONDARY}>
            Retry
          </button>
        }
      />
    )
  } else if (data && data.overview.totalImpressions <= 0) {
    body = (
      <EmptyState
        title="No search data yet"
        description="Google Search Console hasn't collected any data for this property in the selected period."
      />
    )
  } else if (data) {
    const { overview, previousOverview, timeseries, topQueries, topPages, countries, devices } = data
    body = (
    <div className="flex flex-col gap-5">
      <div className={dashboardMetricGridFourClass}>
        <DashboardMetricCard
          label="Total Clicks"
          value={formatNumber(overview.totalClicks)}
          hint={
            previousOverview ? (
              <DashboardMetricDelta
                current={overview.totalClicks}
                previous={previousOverview.totalClicks}
                rangeLabel={SEARCH_CONSOLE_DELTA_LABEL}
              />
            ) : undefined
          }
        />
        <DashboardMetricCard
          label="Total Impressions"
          value={formatNumber(overview.totalImpressions)}
          hint={
            previousOverview ? (
              <DashboardMetricDelta
                current={overview.totalImpressions}
                previous={previousOverview.totalImpressions}
                rangeLabel={SEARCH_CONSOLE_DELTA_LABEL}
              />
            ) : undefined
          }
        />
        <DashboardMetricCard
          label="Avg CTR"
          value={formatPercent(overview.avgCtr)}
          hint={
            previousOverview ? (
              <DashboardMetricDelta
                current={overview.avgCtr}
                previous={previousOverview.avgCtr}
                rangeLabel={SEARCH_CONSOLE_DELTA_LABEL}
              />
            ) : undefined
          }
        />
        <DashboardMetricCard
          label="Avg Position"
          value={formatPosition(overview.avgPosition)}
          hint={
            previousOverview ? (
              <DashboardMetricDelta
                current={overview.avgPosition}
                previous={previousOverview.avgPosition}
                rangeLabel={SEARCH_CONSOLE_DELTA_LABEL}
                goodWhenDown
              />
            ) : undefined
          }
        />
      </div>

      <SectionPanel title="Clicks & Impressions Over Time">
        <div className={dashboardChartHeight.wide}>
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <ComposedChart data={timeseries} margin={{ top: 4, right: 0, left: 0, bottom: 4 }}>
              <defs>
                <linearGradient id="clicksGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--dash-blue)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--dash-blue)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="impressionsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--dash-success)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="var(--dash-success)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--dash-divider)" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: 'var(--dash-text-muted)' }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 11, fill: 'var(--dash-text-muted)' }}
                tickLine={false}
                axisLine={false}
                domain={[0, 'auto']}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 11, fill: 'var(--dash-text-muted)' }}
                tickLine={false}
                axisLine={false}
                domain={[0, 'auto']}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                labelStyle={{ color: 'var(--dash-text-soft)', fontSize: 12 }}
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="clicks"
                stroke="var(--dash-blue)"
                fill="url(#clicksGradient)"
                strokeWidth={2}
                name="Clicks"
                isAnimationActive={false}
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="impressions"
                stroke="var(--dash-success)"
                fill="url(#impressionsGradient)"
                strokeWidth={2}
                name="Impressions"
                isAnimationActive={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </SectionPanel>

      <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-2 [&>*]:min-w-0">
        <SectionPanel title="Top Queries" bodyClassName={TABLE_WRAP}>
          <table className="w-full text-xs">
            <thead>
              <tr className={THEAD}>
                <th className={TH}>Query</th>
                <th className={TH_CENTER}>Clicks</th>
                <th className={TH_CENTER}>Impressions</th>
                <th className={TH_CENTER}>CTR</th>
                <th className={TH_CENTER}>Position</th>
              </tr>
            </thead>
            <tbody>
              {topQueries.map((row, i) => (
                <tr key={i} className={TR}>
                  <td className={`${TD} max-w-[160px] truncate text-[color:var(--dash-text)]`}>
                    {row.query}
                  </td>
                  <td className={`${TD} text-center tabular-nums text-[color:var(--dash-text)]`}>
                    {formatNumber(row.clicks)}
                  </td>
                  <td className={`${TD} text-center tabular-nums text-[color:var(--dash-text-soft)]`}>
                    {formatNumber(row.impressions)}
                  </td>
                  <td className={`${TD} text-center tabular-nums text-[color:var(--dash-text-soft)]`}>
                    {formatPercent(row.ctr)}
                  </td>
                  <td className={`${TD} text-center tabular-nums text-[color:var(--dash-text-soft)]`}>
                    {formatPosition(row.position)}
                  </td>
                </tr>
              ))}
              {topQueries.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-[color:var(--dash-text-muted)]">
                    No query data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </SectionPanel>

        <SectionPanel title="Top Pages" bodyClassName={TABLE_WRAP}>
          <table className="w-full text-xs">
            <thead>
              <tr className={THEAD}>
                <th className={TH}>Page</th>
                <th className={TH_CENTER}>Clicks</th>
                <th className={TH_CENTER}>Impressions</th>
                <th className={TH_CENTER}>CTR</th>
                <th className={TH_CENTER}>Position</th>
              </tr>
            </thead>
            <tbody>
              {topPages.map((row, i) => (
                <tr key={i} className={TR}>
                  <td
                    className={`${TD} max-w-[160px] truncate text-[color:var(--dash-text)]`}
                    title={row.page}
                  >
                    {pagePathLabel(row.page)}
                  </td>
                  <td className={`${TD} text-center tabular-nums text-[color:var(--dash-text)]`}>
                    {formatNumber(row.clicks)}
                  </td>
                  <td className={`${TD} text-center tabular-nums text-[color:var(--dash-text-soft)]`}>
                    {formatNumber(row.impressions)}
                  </td>
                  <td className={`${TD} text-center tabular-nums text-[color:var(--dash-text-soft)]`}>
                    {formatPercent(row.ctr)}
                  </td>
                  <td className={`${TD} text-center tabular-nums text-[color:var(--dash-text-soft)]`}>
                    {formatPosition(row.position)}
                  </td>
                </tr>
              ))}
              {topPages.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-[color:var(--dash-text-muted)]">
                    No page data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </SectionPanel>
      </div>

      <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-2 [&>*]:min-w-0">
        <SectionPanel title="Clicks by Country">
          <div className={dashboardChartHeight.standard}>
            {countries.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <BarChart
                  data={countries.slice(0, 10)}
                  layout="vertical"
                  margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
                >
                  <CartesianGrid stroke="var(--dash-divider)" strokeDasharray="3 3" horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11, fill: 'var(--dash-text-muted)' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="country"
                    tickFormatter={countryName}
                    tick={{ fontSize: 11, fill: 'var(--dash-text-muted)' }}
                    tickLine={false}
                    axisLine={false}
                    width={100}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    labelFormatter={(code) => countryName(code as string)}
                    formatter={(value) => [formatNumber(Number(value)), 'Clicks']}
                    labelStyle={{ color: 'var(--dash-text-soft)', fontSize: 12 }}
                    cursor={{
                      fill: 'color-mix(in srgb, var(--dash-bg-subtle) 78%, var(--dash-text) 22%)',
                      fillOpacity: 0.72,
                    }}
                  />
                  <Bar
                    dataKey="clicks"
                    fill="var(--dash-blue)"
                    radius={[0, 4, 4, 0]}
                    maxBarSize={24}
                    isAnimationActive={false}
                  >
                    {countries.slice(0, 10).map((_, i) => (
                      <Cell key={i} fill="var(--dash-blue)" fillOpacity={1 - i * 0.07} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-[color:var(--dash-text-muted)]">
                No country data available
              </div>
            )}
          </div>
        </SectionPanel>

        <SectionPanel title="Clicks by Device">
          <div className={dashboardChartHeight.standard}>
            {devices.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <BarChart data={devices} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="var(--dash-divider)" strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="device"
                    tickFormatter={deviceLabel}
                    tick={{ fontSize: 11, fill: 'var(--dash-text-muted)' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: 'var(--dash-text-muted)' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    labelFormatter={(label) => deviceLabel(label as string)}
                    formatter={(value) => [formatNumber(Number(value)), 'Clicks']}
                    labelStyle={{ color: 'var(--dash-text-soft)', fontSize: 12 }}
                    cursor={{
                      fill: 'color-mix(in srgb, var(--dash-bg-subtle) 78%, var(--dash-text) 22%)',
                      fillOpacity: 0.72,
                    }}
                  />
                  <Bar
                    dataKey="clicks"
                    fill="var(--dash-blue)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={64}
                    isAnimationActive={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-[color:var(--dash-text-muted)]">
                No device data available
              </div>
            )}
          </div>
        </SectionPanel>
      </div>
    </div>
    )
  }

  const propertyLabel =
    data?.matchedSite && !data.error
      ? `${data.matchedSiteType === 'domain' ? 'Domain' : 'URL-prefix'} property`
      : null

  const canExport =
    Boolean(data) &&
    !data?.error &&
    (data?.timeseries.length ?? 0) > 0 &&
    !isLoading

  return (
    <div className="mx-auto min-w-0 max-w-350 px-4 sm:px-6 py-8">
      <PageHeader
        propertyLabel={propertyLabel}
        range={range}
        timeRanges={timeRanges}
        onRangeChange={setRange}
        onExportCSV={handleExportCSV}
        onExportJSON={handleExportJSON}
        exportDisabled={!canExport}
      />
      {body}
    </div>
  )
}
