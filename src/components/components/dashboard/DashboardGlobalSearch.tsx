'use client';

import { createPortal } from 'react-dom';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import {
  Activity,
  AlertTriangle,
  Bell,
  Blocks,
  Clock,
  FileText,
  Globe,
  Gauge,
  History,
  Home,
  LayoutDashboard,
  Layers,
  Link2,
  Monitor,
  PieChart,
  ScrollText,
  Search,
  Settings,
  Sticker,
  User,
  Users,
  Waves,
  Wifi,
  X,
  ArrowRight,
} from '@/components/dashboard/icons';
import { getProjectHref, useDashboardShell } from './DashboardShellContext';
import { scrollToDashboardSectionHash } from './DashboardSection';
import { getUserAnalyticsHref } from '@/lib/user-analytics/tabs';

type SearchTarget = {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  section: 'Observability' | 'User Analytics' | 'Configuration' | 'Workspace';
  pageLabel?: string;
  kind?: 'page' | 'section';
  keywords: string[];
};

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    target.isContentEditable
  );
}

export function DashboardGlobalSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);
  const { basePath, billingPath, profilePath, projectId, projectName } = useDashboardShell();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const targets = useMemo<SearchTarget[]>(() => {
    if (!projectId) return [];

    const projectRoot = getProjectHref(basePath, projectId);

    const items: SearchTarget[] = [
      {
        id: 'obs-overview',
        label: 'Overview',
        href: projectRoot,
        icon: Home,
        section: 'Observability',
        keywords: ['home', 'summary', 'dashboard', 'observability overview'],
      },
      {
        id: 'obs-map',
        label: 'Global Map',
        href: getProjectHref(basePath, projectId, 'map'),
        icon: Globe,
        section: 'Observability',
        keywords: ['map', 'countries', 'latency map', 'global'],
      },
      {
        id: 'obs-endpoints',
        label: 'Endpoints',
        href: getProjectHref(basePath, projectId, 'endpoints'),
        icon: Activity,
        section: 'Observability',
        keywords: ['api', 'routes', 'paths', 'requests', 'endpoint'],
      },
      {
        id: 'obs-isps',
        label: 'ISPs',
        href: getProjectHref(basePath, projectId, 'isps'),
        icon: PieChart,
        section: 'Observability',
        keywords: ['providers', 'carrier', 'network providers', 'isp'],
      },
      {
        id: 'obs-errors',
        label: 'Errors',
        href: getProjectHref(basePath, projectId, 'errors'),
        icon: AlertTriangle,
        section: 'Observability',
        keywords: ['exceptions', 'failures', 'status codes', 'error'],
      },
      {
        id: 'obs-pages',
        label: 'Pages',
        href: getProjectHref(basePath, projectId, 'pages'),
        icon: FileText,
        section: 'Observability',
        keywords: ['page performance', 'routes', 'frontend', 'pages'],
      },
      {
        id: 'obs-vitals',
        label: 'Web Vitals',
        href: getProjectHref(basePath, projectId, 'web-vitals'),
        icon: Gauge,
        section: 'Observability',
        keywords: ['lcp', 'cls', 'inp', 'ttfb', 'fcp', 'core web vitals'],
      },
      {
        id: 'obs-network',
        label: 'Network',
        href: getProjectHref(basePath, projectId, 'network'),
        icon: Wifi,
        section: 'Observability',
        keywords: ['dns', 'tcp', 'tls', 'rtt', 'network'],
      },
      {
        id: 'obs-third-parties',
        label: 'Third Parties',
        href: getProjectHref(basePath, projectId, 'third-parties'),
        icon: Blocks,
        section: 'Observability',
        keywords: ['3p', 'external scripts', 'vendors', 'third parties'],
      },
      {
        id: 'obs-sessions',
        label: 'Sessions',
        href: getProjectHref(basePath, projectId, 'sessions'),
        icon: Waves,
        section: 'Observability',
        keywords: ['session waterfall', 'session replay', 'visits', 'sessions'],
      },
      {
        id: 'obs-timeseries',
        label: 'Time Series',
        href: getProjectHref(basePath, projectId, 'timeseries'),
        icon: Clock,
        section: 'Observability',
        keywords: ['chart', 'history', 'latency trends', 'timeseries'],
      },
      {
        id: 'ua-overview',
        label: 'User Analytics Overview',
        href: getUserAnalyticsHref(basePath, projectId, 'overview'),
        icon: User,
        section: 'User Analytics',
        keywords: ['user overview', 'visitors', 'user analytics'],
      },
      {
        id: 'ua-pageviews',
        label: 'Pageviews',
        href: getUserAnalyticsHref(basePath, projectId, 'pageviews'),
        icon: FileText,
        section: 'User Analytics',
        keywords: ['page views', 'recent pageviews', 'pages'],
      },
      {
        id: 'ua-visits',
        label: 'Visits & Sessions',
        href: getUserAnalyticsHref(basePath, projectId, 'visits'),
        icon: Users,
        section: 'User Analytics',
        keywords: ['sessions', 'visits', 'latest visits'],
      },
      {
        id: 'ua-journeys',
        label: 'Journeys',
        href: getUserAnalyticsHref(basePath, projectId, 'journeys'),
        icon: ArrowRight,
        section: 'User Analytics',
        keywords: ['journeys', 'user flow', 'route flow', 'dropoff'],
      },
      {
        id: 'ua-geography',
        label: 'Geography',
        href: getUserAnalyticsHref(basePath, projectId, 'geography'),
        icon: Globe,
        section: 'User Analytics',
        keywords: ['countries', 'regions', 'cities', 'geography'],
      },
      {
        id: 'ua-geography-heatmap-card',
        label: 'Visitor Geography',
        pageLabel: 'Geography',
        href: `${getUserAnalyticsHref(basePath, projectId, 'geography')}#ua-geography-heatmap`,
        icon: Layers,
        section: 'User Analytics',
        kind: 'section',
        keywords: ['heatmap', 'choropleth', 'pageviews', 'visitors', 'country map'],
      },
      {
        id: 'ua-devices',
        label: 'Devices & Browsers',
        href: getUserAnalyticsHref(basePath, projectId, 'devices'),
        icon: Monitor,
        section: 'User Analytics',
        keywords: ['device', 'browser', 'os', 'screen sizes'],
      },
      {
        id: 'ua-referrers',
        label: 'Referrers & UTM',
        href: getUserAnalyticsHref(basePath, projectId, 'referrers'),
        icon: Link2,
        section: 'User Analytics',
        keywords: ['utm', 'campaigns', 'channels', 'referrers'],
      },
      {
        id: 'ua-search-console',
        label: 'Search Console',
        href: getProjectHref(basePath, projectId, 'search-console'),
        icon: Search,
        section: 'User Analytics',
        keywords: [
          'search console',
          'gsc',
          'google search',
          'clicks',
          'impressions',
          'ctr',
          'position',
          'queries',
        ],
      },
      {
        id: 'ua-engagement',
        label: 'Scroll & Engagement',
        href: getUserAnalyticsHref(basePath, projectId, 'engagement'),
        icon: ScrollText,
        section: 'User Analytics',
        keywords: ['scroll', 'engagement', 'depth', 'avg scroll'],
      },
      {
        id: 'ua-heatmap',
        label: 'Heatmap',
        href: getUserAnalyticsHref(basePath, projectId, 'heatmap'),
        icon: Layers,
        section: 'User Analytics',
        keywords: ['heatmap', 'click map', 'click tracking', 'where users click', 'click density'],
      },
      {
        id: 'ua-embed',
        label: 'Public badge',
        href: getUserAnalyticsHref(basePath, projectId, 'embed'),
        icon: Sticker,
        section: 'User Analytics',
        keywords: ['embed', 'widget', 'live visitors', 'badge', 'public stats', 'snippet', 'badge.js'],
      },
      {
        id: 'ua-overview-pages-card',
        label: 'Pages',
        pageLabel: 'User Analytics Overview',
        href: `${getUserAnalyticsHref(basePath, projectId, 'overview')}#ua-overview-pages`,
        icon: FileText,
        section: 'User Analytics',
        kind: 'section',
        keywords: ['pages card', 'top pages', 'page views', 'popular pages'],
      },
      {
        id: 'ua-overview-traffic-card',
        label: 'Traffic Acquisition',
        pageLabel: 'User Analytics Overview',
        href: `${getUserAnalyticsHref(basePath, projectId, 'overview')}#ua-overview-traffic-acquisition`,
        icon: Link2,
        section: 'User Analytics',
        kind: 'section',
        keywords: ['traffic acquisition', 'channels', 'direct', 'organic search', 'referral', 'social media'],
      },
      {
        id: 'ua-overview-environment-card',
        label: 'Environment',
        pageLabel: 'User Analytics Overview',
        href: `${getUserAnalyticsHref(basePath, projectId, 'overview')}#ua-overview-environment`,
        icon: Monitor,
        section: 'User Analytics',
        kind: 'section',
        keywords: ['environment', 'devices', 'browsers', 'desktop', 'mobile', 'tablet'],
      },
      {
        id: 'ua-overview-countries-card',
        label: 'Countries',
        pageLabel: 'User Analytics Overview',
        href: `${getUserAnalyticsHref(basePath, projectId, 'overview')}#ua-overview-countries`,
        icon: Globe,
        section: 'User Analytics',
        kind: 'section',
        keywords: ['countries', 'visitors by country', 'geography', 'united states', 'india'],
      },
      {
        id: 'ua-overview-pageviews-chart',
        label: 'Pageviews Over Time',
        pageLabel: 'User Analytics Overview',
        href: `${getUserAnalyticsHref(basePath, projectId, 'overview')}#ua-overview-pageviews-over-time`,
        icon: Clock,
        section: 'User Analytics',
        kind: 'section',
        keywords: ['pageviews over time', 'overview chart', 'traffic trend'],
      },
      {
        id: 'ua-pageviews-summary-card',
        label: 'Pageviews Summary',
        pageLabel: 'Pageviews',
        href: `${getUserAnalyticsHref(basePath, projectId, 'pageviews')}#ua-pageviews-summary`,
        icon: FileText,
        section: 'User Analytics',
        kind: 'section',
        keywords: ['pageviews summary', 'total pageviews', 'spa share'],
      },
      {
        id: 'ua-pageviews-trend-card',
        label: 'Pageview Trend',
        pageLabel: 'Pageviews',
        href: `${getUserAnalyticsHref(basePath, projectId, 'pageviews')}#ua-pageviews-trend`,
        icon: Clock,
        section: 'User Analytics',
        kind: 'section',
        keywords: ['pageview trend', 'pageviews chart', 'current period'],
      },
      {
        id: 'ua-pageviews-recent-card',
        label: 'Recent Pageviews',
        pageLabel: 'Pageviews',
        href: `${getUserAnalyticsHref(basePath, projectId, 'pageviews')}#ua-pageviews-recent-pageviews`,
        icon: FileText,
        section: 'User Analytics',
        kind: 'section',
        keywords: ['recent pageviews', 'latest pageviews', 'recent visits'],
      },
      {
        id: 'ua-pageviews-pages-card',
        label: 'Pageview Pages',
        pageLabel: 'Pageviews',
        href: `${getUserAnalyticsHref(basePath, projectId, 'pageviews')}#ua-pageviews-pages`,
        icon: FileText,
        section: 'User Analytics',
        kind: 'section',
        keywords: ['pageview pages', 'pages table', 'spa pages'],
      },
      {
        id: 'ua-visits-summary-card',
        label: 'Visits Summary',
        pageLabel: 'Visits & Sessions',
        href: `${getUserAnalyticsHref(basePath, projectId, 'visits')}#ua-visits-summary`,
        icon: Users,
        section: 'User Analytics',
        kind: 'section',
        keywords: ['visits summary', 'bounce rate', 'pages per visit'],
      },
      {
        id: 'ua-visits-volume-card',
        label: 'Visit Volume',
        pageLabel: 'Visits & Sessions',
        href: `${getUserAnalyticsHref(basePath, projectId, 'visits')}#ua-visits-volume`,
        icon: Clock,
        section: 'User Analytics',
        kind: 'section',
        keywords: ['visit volume', 'sessions over time', 'visit chart'],
      },
      {
        id: 'ua-visits-latest-card',
        label: 'Latest Visits',
        pageLabel: 'Visits & Sessions',
        href: `${getUserAnalyticsHref(basePath, projectId, 'visits')}#ua-visits-latest-visits`,
        icon: Users,
        section: 'User Analytics',
        kind: 'section',
        keywords: ['latest visits', 'visit sessions', 'recent sessions'],
      },
      {
        id: 'ua-journeys-flow-card',
        label: 'Journey Flow',
        pageLabel: 'Journeys',
        href: `${getUserAnalyticsHref(basePath, projectId, 'journeys')}#ua-journeys-flow`,
        icon: ArrowRight,
        section: 'User Analytics',
        kind: 'section',
        keywords: ['journey flow', 'step columns', 'path flow'],
      },
      {
        id: 'ua-geography-summary-card',
        label: 'Geography Summary',
        pageLabel: 'Geography',
        href: `${getUserAnalyticsHref(basePath, projectId, 'geography')}#ua-geography-summary`,
        icon: Globe,
        section: 'User Analytics',
        kind: 'section',
        keywords: ['geography summary', 'countries regions cities', 'top country'],
      },
      {
        id: 'ua-geography-locations-card',
        label: 'Locations',
        pageLabel: 'Geography',
        href: `${getUserAnalyticsHref(basePath, projectId, 'geography')}#ua-geography-locations`,
        icon: Globe,
        section: 'User Analytics',
        kind: 'section',
        keywords: ['locations', 'countries', 'regions', 'cities'],
      },
      {
        id: 'ua-geography-context-card',
        label: 'Geography Context',
        pageLabel: 'Geography',
        href: `${getUserAnalyticsHref(basePath, projectId, 'geography')}#ua-geography-context`,
        icon: Globe,
        section: 'User Analytics',
        kind: 'section',
        keywords: ['timezones', 'languages', 'geography context'],
      },
      {
        id: 'ua-devices-insights-card',
        label: 'Device Insights',
        pageLabel: 'Devices & Browsers',
        href: `${getUserAnalyticsHref(basePath, projectId, 'devices')}#ua-devices-insights`,
        icon: Monitor,
        section: 'User Analytics',
        kind: 'section',
        keywords: ['top device', 'top browser', 'top os', 'screen sizes'],
      },
      {
        id: 'ua-devices-environment-card',
        label: 'Device Environment',
        pageLabel: 'Devices & Browsers',
        href: `${getUserAnalyticsHref(basePath, projectId, 'devices')}#ua-devices-environment`,
        icon: Monitor,
        section: 'User Analytics',
        kind: 'section',
        keywords: ['devices', 'browsers', 'operating systems', 'environment'],
      },
      {
        id: 'ua-devices-screen-card',
        label: 'Top Screen Sizes',
        pageLabel: 'Devices & Browsers',
        href: `${getUserAnalyticsHref(basePath, projectId, 'devices')}#ua-devices-screen-sizes`,
        icon: Monitor,
        section: 'User Analytics',
        kind: 'section',
        keywords: ['screen sizes', 'resolutions', 'top screen sizes'],
      },
      {
        id: 'ua-referrers-summary-card',
        label: 'Referrer Summary',
        pageLabel: 'Referrers & UTM',
        href: `${getUserAnalyticsHref(basePath, projectId, 'referrers')}#ua-referrers-summary`,
        icon: Link2,
        section: 'User Analytics',
        kind: 'section',
        keywords: ['direct visits', 'attributed visits', 'campaign visits'],
      },
      {
        id: 'ua-referrers-sources-card',
        label: 'Sources',
        pageLabel: 'Referrers & UTM',
        href: `${getUserAnalyticsHref(basePath, projectId, 'referrers')}#ua-referrers-sources`,
        icon: Link2,
        section: 'User Analytics',
        kind: 'section',
        keywords: ['referrers', 'channels', 'sources', 'traffic sources'],
      },
      {
        id: 'ua-referrers-attribution-card',
        label: 'Attribution',
        pageLabel: 'Referrers & UTM',
        href: `${getUserAnalyticsHref(basePath, projectId, 'referrers')}#ua-referrers-attribution`,
        icon: Link2,
        section: 'User Analytics',
        kind: 'section',
        keywords: ['utm', 'click ids', 'attribution', 'campaigns'],
      },
      {
        id: 'ua-engagement-summary-card',
        label: 'Engagement Summary',
        pageLabel: 'Scroll & Engagement',
        href: `${getUserAnalyticsHref(basePath, projectId, 'engagement')}#ua-engagement-summary`,
        icon: ScrollText,
        section: 'User Analytics',
        kind: 'section',
        keywords: ['avg scroll', 'deep scroll rate', 'engaged visit rate'],
      },
      {
        id: 'ua-engagement-top-pages-card',
        label: 'Top Pages',
        pageLabel: 'Scroll & Engagement',
        href: `${getUserAnalyticsHref(basePath, projectId, 'engagement')}#ua-engagement-top-pages`,
        icon: FileText,
        section: 'User Analytics',
        kind: 'section',
        keywords: ['top pages', 'avg time', 'avg scroll pages'],
      },
      {
        id: 'ua-engagement-behavior-card',
        label: 'Behavior Mix',
        pageLabel: 'Scroll & Engagement',
        href: `${getUserAnalyticsHref(basePath, projectId, 'engagement')}#ua-engagement-behavior-mix`,
        icon: ScrollText,
        section: 'User Analytics',
        kind: 'section',
        keywords: [
          'behavior mix',
          'route types',
          'visit depth',
          'scroll depth',
          'distribution',
        ],
      },
      {
        id: 'config-alerts',
        label: 'Alerts',
        href: getProjectHref(basePath, projectId, 'alerts'),
        icon: Bell,
        section: 'Configuration',
        keywords: ['alerts', 'notifications', 'thresholds'],
      },
      {
        id: 'config-alert-history',
        label: 'Alert History',
        href: getProjectHref(basePath, projectId, 'alert-history'),
        icon: History,
        section: 'Configuration',
        keywords: ['history', 'incidents', 'alert logs'],
      },
      {
        id: 'config-status-page',
        label: 'Status Page',
        href: getProjectHref(basePath, projectId, 'status-page'),
        icon: LayoutDashboard,
        section: 'Configuration',
        keywords: ['public status', 'uptime page', 'status page'],
      },
      {
        id: 'config-settings',
        label: 'Project Settings',
        href: getProjectHref(basePath, projectId, 'settings'),
        icon: Settings,
        section: 'Configuration',
        keywords: ['project settings', 'snippet', 'domain', 'settings'],
      },
    ];

    if (profilePath) {
      items.push({
        id: 'workspace-profile',
        label: 'Profile',
        href: profilePath,
        icon: User,
        section: 'Workspace',
        keywords: ['account', 'profile', 'user profile'],
      });
    }

    if (billingPath) {
      items.push({
        id: 'workspace-billing',
        label: 'Billing',
        href: billingPath,
        icon: Settings,
        section: 'Workspace',
        keywords: ['plan', 'subscription', 'billing'],
      });
    }

    items.push(
      {
        id: 'obs-overview-summary',
        label: 'Overview Metrics',
        pageLabel: 'Overview',
        href: `${projectRoot}#overview-metrics`,
        icon: Home,
        section: 'Observability',
        kind: 'section',
        keywords: ['overview cards', 'summary cards', 'metrics', 'requests', 'error rate'],
      },
      {
        id: 'obs-overview-latency',
        label: 'Latency Distribution',
        pageLabel: 'Overview',
        href: `${projectRoot}#overview-latency-distribution`,
        icon: Gauge,
        section: 'Observability',
        kind: 'section',
        keywords: ['latency distribution', 'p50', 'p95', 'p99', 'latency chart'],
      },
      {
        id: 'obs-overview-requests',
        label: 'Request Trends',
        pageLabel: 'Overview',
        href: `${projectRoot}#overview-request-trends`,
        icon: Activity,
        section: 'Observability',
        kind: 'section',
        keywords: ['cumulative requests', 'request delta', 'request trends'],
      },
      {
        id: 'obs-map-summary',
        label: 'Map Summary',
        pageLabel: 'Global Map',
        href: `${getProjectHref(basePath, projectId, 'map')}#map-summary`,
        icon: Globe,
        section: 'Observability',
        kind: 'section',
        keywords: ['map summary', 'countries', 'cities', 'map stats'],
      },
      {
        id: 'obs-map-top-countries',
        label: 'Top Countries',
        pageLabel: 'Global Map',
        href: `${getProjectHref(basePath, projectId, 'map')}#map-top-countries`,
        icon: Globe,
        section: 'Observability',
        kind: 'section',
        keywords: ['top countries', 'country ranking', 'country list'],
      },
      {
        id: 'obs-endpoints-table',
        label: 'Endpoints Table',
        pageLabel: 'Endpoints',
        href: `${getProjectHref(basePath, projectId, 'endpoints')}#endpoints-table`,
        icon: Activity,
        section: 'Observability',
        kind: 'section',
        keywords: ['endpoints table', 'api routes', 'path table'],
      },
      {
        id: 'obs-isps-top',
        label: 'Top ISPs',
        pageLabel: 'ISPs',
        href: `${getProjectHref(basePath, projectId, 'isps')}#isps-top-carriers`,
        icon: PieChart,
        section: 'Observability',
        kind: 'section',
        keywords: ['top isps', 'carriers', 'isp chart'],
      },
      {
        id: 'obs-isps-table',
        label: 'ISP Table',
        pageLabel: 'ISPs',
        href: `${getProjectHref(basePath, projectId, 'isps')}#isps-table`,
        icon: Wifi,
        section: 'Observability',
        kind: 'section',
        keywords: ['isp table', 'carrier breakdown', 'network providers'],
      },
      {
        id: 'obs-pages-summary',
        label: 'Page Summary',
        pageLabel: 'Pages',
        href: `${getProjectHref(basePath, projectId, 'pages')}#pages-summary`,
        icon: FileText,
        section: 'Observability',
        kind: 'section',
        keywords: ['page summary', 'page cards', 'page metrics'],
      },
      {
        id: 'obs-pages-table',
        label: 'Page Breakdown',
        pageLabel: 'Pages',
        href: `${getProjectHref(basePath, projectId, 'pages')}#pages-table`,
        icon: FileText,
        section: 'Observability',
        kind: 'section',
        keywords: ['page table', 'page path', 'page breakdown'],
      },
      {
        id: 'obs-vitals-summary',
        label: 'Web Vitals Summary',
        pageLabel: 'Web Vitals',
        href: `${getProjectHref(basePath, projectId, 'web-vitals')}#web-vitals-summary`,
        icon: Gauge,
        section: 'Observability',
        kind: 'section',
        keywords: ['vitals summary', 'lcp', 'cls', 'inp', 'ttfb'],
      },
      {
        id: 'obs-vitals-chart',
        label: 'Vitals Over Time',
        pageLabel: 'Web Vitals',
        href: `${getProjectHref(basePath, projectId, 'web-vitals')}#web-vitals-timeseries`,
        icon: Gauge,
        section: 'Observability',
        kind: 'section',
        keywords: ['vitals chart', 'vitals trends', 'web vitals chart'],
      },
      {
        id: 'obs-vitals-country',
        label: 'Vitals by Country',
        pageLabel: 'Web Vitals',
        href: `${getProjectHref(basePath, projectId, 'web-vitals')}#web-vitals-country-table`,
        icon: Globe,
        section: 'Observability',
        kind: 'section',
        keywords: ['country vitals', 'performance by country'],
      },
      {
        id: 'obs-vitals-connection',
        label: 'Vitals by Connection',
        pageLabel: 'Web Vitals',
        href: `${getProjectHref(basePath, projectId, 'web-vitals')}#web-vitals-connection-table`,
        icon: Wifi,
        section: 'Observability',
        kind: 'section',
        keywords: ['connection vitals', 'performance by connection type'],
      },
      {
        id: 'obs-network-distribution',
        label: 'Connection Distribution',
        pageLabel: 'Network',
        href: `${getProjectHref(basePath, projectId, 'network')}#network-connection-distribution`,
        icon: Wifi,
        section: 'Observability',
        kind: 'section',
        keywords: ['connection distribution', '4g', '3g', 'network distribution'],
      },
      {
        id: 'obs-network-ttfb',
        label: 'TTFB by Connection',
        pageLabel: 'Network',
        href: `${getProjectHref(basePath, projectId, 'network')}#network-ttfb-by-connection`,
        icon: Clock,
        section: 'Observability',
        kind: 'section',
        keywords: ['ttfb chart', 'ttfb by connection', 'network ttfb'],
      },
      {
        id: 'obs-network-timing',
        label: 'Connection Timing Percentiles',
        pageLabel: 'Network',
        href: `${getProjectHref(basePath, projectId, 'network')}#network-timing-percentiles`,
        icon: Clock,
        section: 'Observability',
        kind: 'section',
        keywords: ['dns', 'tcp', 'tls', 'timing percentiles'],
      },
      {
        id: 'obs-network-rtt',
        label: 'RTT Over Time',
        pageLabel: 'Network',
        href: `${getProjectHref(basePath, projectId, 'network')}#network-rtt-timeseries`,
        icon: Waves,
        section: 'Observability',
        kind: 'section',
        keywords: ['rtt trends', 'rtt over time', 'latency by connection'],
      },
      {
        id: 'obs-network-table',
        label: 'Network Timing Table',
        pageLabel: 'Network',
        href: `${getProjectHref(basePath, projectId, 'network')}#network-connection-table`,
        icon: Wifi,
        section: 'Observability',
        kind: 'section',
        keywords: ['network table', 'connection table', 'network timing by connection'],
      },
      {
        id: 'obs-third-party-summary',
        label: 'Third-Party Summary',
        pageLabel: 'Third Parties',
        href: `${getProjectHref(basePath, projectId, 'third-parties')}#third-party-summary`,
        icon: Blocks,
        section: 'Observability',
        kind: 'section',
        keywords: ['third-party summary', 'third party share', 'vendor summary'],
      },
      {
        id: 'obs-third-party-top',
        label: 'Top Third-Party Domains',
        pageLabel: 'Third Parties',
        href: `${getProjectHref(basePath, projectId, 'third-parties')}#third-party-top-domains`,
        icon: Globe,
        section: 'Observability',
        kind: 'section',
        keywords: ['top vendors', 'top third-party domains', 'external domains'],
      },
      {
        id: 'obs-third-party-table',
        label: 'Third-Party Domain Breakdown',
        pageLabel: 'Third Parties',
        href: `${getProjectHref(basePath, projectId, 'third-parties')}#third-party-domain-breakdown`,
        icon: Blocks,
        section: 'Observability',
        kind: 'section',
        keywords: ['domain breakdown', 'third-party table', 'vendor table'],
      },
      {
        id: 'obs-timeseries-summary',
        label: 'Performance Summary',
        pageLabel: 'Time Series',
        href: `${getProjectHref(basePath, projectId, 'timeseries')}#timeseries-summary`,
        icon: Clock,
        section: 'Observability',
        kind: 'section',
        keywords: ['timeseries summary', 'avg p50', 'avg p95', 'summary'],
      },
      {
        id: 'obs-timeseries-chart',
        label: 'Latency Quantiles Chart',
        pageLabel: 'Time Series',
        href: `${getProjectHref(basePath, projectId, 'timeseries')}#timeseries-latency-chart`,
        icon: Clock,
        section: 'Observability',
        kind: 'section',
        keywords: ['latency quantiles', 'p50 p95 p99 chart', 'performance history'],
      },
      {
        id: 'config-alert-history-summary',
        label: 'Alert History Summary',
        pageLabel: 'Alert History',
        href: `${getProjectHref(basePath, projectId, 'alert-history')}#alert-history-summary`,
        icon: History,
        section: 'Configuration',
        kind: 'section',
        keywords: ['alert history summary', 'fired alerts', 'suppressed alerts'],
      },
      {
        id: 'config-alert-history-table',
        label: 'Alert History Table',
        pageLabel: 'Alert History',
        href: `${getProjectHref(basePath, projectId, 'alert-history')}#alert-history-table`,
        icon: Bell,
        section: 'Configuration',
        kind: 'section',
        keywords: ['alert history table', 'alert log', 'evaluations table'],
      },
    );

    return items;
  }, [basePath, billingPath, profilePath, projectId]);

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return targets;

    const tokens = normalized.split(/\s+/).filter(Boolean);
    return targets.filter((target) => {
      const haystack = [
        target.label,
        target.section,
        projectName ?? '',
        ...target.keywords,
      ]
        .join(' ')
        .toLowerCase();

      return tokens.every((token) => haystack.includes(token));
    });
  }, [projectName, query, targets]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query, isOpen]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsOpen((current) => !current);
        return;
      }

      if (event.key === 'Escape') {
        setIsOpen(false);
      }

      if (event.key === '/' && !isTypingTarget(event.target)) {
        event.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!results.length) return;

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSelectedIndex((current) => (current + 1) % results.length);
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSelectedIndex((current) =>
          current === 0 ? results.length - 1 : current - 1
        );
      }

      if (event.key === 'Enter') {
        event.preventDefault();
        const target = results[selectedIndex];
        if (target) {
          handleNavigate(target.href);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  const handleOpenChange = (next: boolean) => {
    setIsOpen(next);
  };

  const handleNavigate = (href: string) => {
    const hash = href.split('#')[1];
    router.push(href);
    setIsOpen(false);
    if (hash) {
      window.setTimeout(() => {
        scrollToDashboardSectionHash(hash);
      }, 80);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => handleOpenChange(true)}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-[color:var(--dash-divider)] bg-[color:var(--dash-surface)] px-2.5 py-2 text-left shadow-[var(--dash-control-shadow)] transition hover:bg-[color:var(--dash-surface-hover)]"
        aria-label="Open app search"
      >
        <span className="flex min-w-0 items-center gap-2 text-xs text-[color:var(--dash-text-soft)]">
          <Search className="h-3.5 w-3.5 shrink-0 text-[color:var(--dash-text-muted)]" />
          <span className="truncate">Search</span>
        </span>
        <span className="rounded-md bg-[color:var(--dash-bg-subtle)] px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.08em] text-[color:var(--dash-text-muted)]">
          Ctrl + K
        </span>
      </button>

      {isMounted ? createPortal(
        <AnimatePresence>
          {isOpen ? (
        <motion.div
          className="fixed inset-0 z-[1600] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
        >
          <motion.div
            className="absolute inset-0 bg-black/55"
            onClick={() => handleOpenChange(false)}
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          />
          <motion.div
            className="dashboard-panel relative z-[1] flex w-full max-w-2xl flex-col overflow-hidden"
            initial={{ opacity: 0, y: 18, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.985 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <div className="flex items-center gap-3 border-b border-[color:var(--dash-divider)] px-4 py-3">
              <Search className="h-4 w-4 shrink-0 text-[color:var(--dash-text-muted)]" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={`Search ${projectName ?? 'this project'}...`}
                className="w-full bg-transparent text-sm text-[color:var(--dash-text)] outline-none placeholder:text-[color:var(--dash-text-muted)]"
              />
              <button
                type="button"
                onClick={() => handleOpenChange(false)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[color:var(--dash-bg-subtle)] text-[color:var(--dash-text-soft)] transition hover:bg-[color:var(--dash-surface-hover)] hover:text-[color:var(--dash-text)]"
                aria-label="Close search"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2">
              {results.length ? (
                <div className="space-y-1">
                  {results.map((target) => {
                    const Icon = target.icon;
                    const isActive = pathname === target.href;
                    const isSelected = results[selectedIndex]?.id === target.id;

                    return (
                      <button
                        key={target.id}
                        type="button"
                        onClick={() => handleNavigate(target.href)}
                        className={`flex w-full items-center justify-between gap-4 rounded-lg px-3 py-3 text-left transition ${
                          isSelected
                            ? 'bg-[color:var(--dash-blue-soft)]'
                            : isActive
                            ? 'bg-[color:var(--dash-blue-soft)]'
                            : 'hover:bg-[color:var(--dash-surface-hover)]'
                        }`}
                        onMouseEnter={() =>
                          setSelectedIndex(results.findIndex((item) => item.id === target.id))
                        }
                      >
                        <span className="flex min-w-0 items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[color:var(--dash-bg-subtle)] text-[color:var(--dash-blue)]">
                            <Icon className="h-4 w-4" />
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-medium text-[color:var(--dash-text)]">
                              {target.label}
                            </span>
                            <span className="block truncate text-[11px] uppercase tracking-[0.14em] text-[color:var(--dash-text-muted)]">
                              {target.kind === 'section' && target.pageLabel
                                ? `${target.section} · ${target.pageLabel}`
                                : target.section}
                            </span>
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="px-3 py-8 text-center">
                  <p className="text-sm font-medium text-[color:var(--dash-text)]">
                    No results found
                  </p>
                  <p className="mt-1 text-xs text-[color:var(--dash-text-muted)]">
                    Try `web vitals`, `top countries`, `network timing`, or `alert history table`.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
          ) : null}
        </AnimatePresence>
      , document.body) : null}
    </>
  );
}
