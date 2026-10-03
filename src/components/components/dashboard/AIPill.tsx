'use client';

/**
 * AI Pill Component - Floating button to open AI Insights panel
 *
 * Features:
 * - Fixed circular button at bottom right
 * - Themed tooltip ("Chat with AI")
 * - Context-aware prompts passed to AIInsightsPanel
 */

import { useMemo } from 'react';
import { BotMessageSquare } from 'lucide-react';
import { AIInsightsPanel } from './AIInsightsPanel';
import { DashboardTooltip } from './DashboardTooltip';
import { generateDynamicPrompts } from '@/lib/ai/prompts';
import {
  selectFilters,
  useGetTopISPsQuery,
  useGetAllEndpointsQuery,
  useGetNetworkDataQuery,
  useGetMapDataQuery,
  useGetPagesQuery,
  useGetThirdPartiesQuery,
  useGetStatsQuery,
  useGetUserAnalyticsDevicesQuery,
  useGetUserAnalyticsEngagementQuery,
  useGetUserAnalyticsGeographyQuery,
  useGetUserAnalyticsJourneysQuery,
  useGetUserAnalyticsOverviewQuery,
  useGetUserAnalyticsPageviewsQuery,
  useGetUserAnalyticsReferrersQuery,
  useGetUserAnalyticsVisitsQuery,
  useAppSelector,
} from '@/lib/redux';
import type { TimeRange } from '@/lib/redux/hooks/useAllowedTimeRanges';

interface AIPillProps {
  /** Project ID for AI context */
  projectId: string;
  /** Whether the AI panel is open */
  isOpen: boolean;
  /** Open the AI panel */
  onOpen: () => void;
  /** Close the AI panel */
  onClose: () => void;
  /** Active tab name for context-aware prompts */
  activeTab?: string;
  /** Selected time range for data context */
  range?: string;
  /** Additional CSS classes */
  className?: string;
}

const FILTER_PAGE_BY_TAB: Record<string, string> = {
  overview: 'overview',
  endpoints: 'endpoints',
  isps: 'isps',
  timeseries: 'timeseries',
  errors: 'errors',
  map: 'map',
  network: 'network',
  pages: 'pages',
  sessions: 'sessions',
  vitals: 'vitals',
  'third-parties': 'thirdParties',
  'alert-history': 'alertHistory',
  'user-overview': 'userAnalytics',
  'user-pageviews': 'userAnalytics',
  'user-visits': 'userAnalytics',
  'user-journeys': 'userAnalytics',
  'user-geography': 'userAnalytics',
  'user-devices': 'userAnalytics',
  'user-referrers': 'userAnalytics',
  'user-engagement': 'userAnalytics',
  'user-embed': 'userAnalytics',
};

export function AIPill({
  projectId,
  isOpen,
  onOpen,
  onClose,
  activeTab = 'overview',
  range = '24h',
  className = ''
}: AIPillProps) {
  // Resolve the effective range from the current tab's filter state when available.
  const filters = useAppSelector((state) => {
    const filterPage = FILTER_PAGE_BY_TAB[activeTab];
    return filterPage ? selectFilters(filterPage as any)(state) : null;
  });
  const effectiveRange = (filters?.range as TimeRange) || (range as TimeRange);

  // Only fetch prompt context once the user actually opens the AI panel.
  // While the pill is closed it shows the generic placeholder text.
  const skipQueries = !isOpen;

  const { data: ispData } = useGetTopISPsQuery({
    projectId,
    limit: 10,
    range: effectiveRange
  }, { skip: skipQueries || activeTab !== 'isps' });

  const { data: endpointData } = useGetAllEndpointsQuery({
    projectId,
    range: effectiveRange
  }, { skip: skipQueries || activeTab !== 'endpoints' });

  const { data: networkData } = useGetNetworkDataQuery({
    projectId,
    range: effectiveRange
  }, { skip: skipQueries || activeTab !== 'network' });

  const { data: mapData } = useGetMapDataQuery({
    projectId,
    range: effectiveRange
  }, { skip: skipQueries || activeTab !== 'map' });

  const { data: pageData } = useGetPagesQuery({
    projectId,
    range: effectiveRange
  }, { skip: skipQueries || activeTab !== 'pages' });

  const { data: thirdPartyData } = useGetThirdPartiesQuery({
    projectId,
    range: effectiveRange
  }, { skip: skipQueries || activeTab !== 'third-parties' });

  const { data: statsData } = useGetStatsQuery({
    projectId,
    range: effectiveRange
  }, { skip: skipQueries || activeTab !== 'overview' });

  const { data: userOverviewData } = useGetUserAnalyticsOverviewQuery({
    projectId,
    range: effectiveRange
  }, { skip: skipQueries || activeTab !== 'user-overview' });

  const { data: userPageviewsData } = useGetUserAnalyticsPageviewsQuery({
    projectId,
    range: effectiveRange
  }, { skip: skipQueries || activeTab !== 'user-pageviews' });

  const { data: userVisitsData } = useGetUserAnalyticsVisitsQuery({
    projectId,
    range: effectiveRange
  }, { skip: skipQueries || activeTab !== 'user-visits' });

  const { data: userJourneysData } = useGetUserAnalyticsJourneysQuery({
    projectId,
    range: effectiveRange,
    steps: 3,
  }, { skip: skipQueries || activeTab !== 'user-journeys' });

  const { data: userGeographyData } = useGetUserAnalyticsGeographyQuery({
    projectId,
    range: effectiveRange
  }, { skip: skipQueries || activeTab !== 'user-geography' });

  const { data: userDevicesData } = useGetUserAnalyticsDevicesQuery({
    projectId,
    range: effectiveRange
  }, { skip: skipQueries || activeTab !== 'user-devices' });

  const { data: userReferrersData } = useGetUserAnalyticsReferrersQuery({
    projectId,
    range: effectiveRange
  }, { skip: skipQueries || activeTab !== 'user-referrers' });

  const { data: userEngagementData } = useGetUserAnalyticsEngagementQuery({
    projectId,
    range: effectiveRange
  }, { skip: skipQueries || activeTab !== 'user-engagement' });

  // Get the appropriate data based on tab
  const activeData = useMemo(() => {
    switch (activeTab) {
      case 'isps':
        return ispData;
      case 'endpoints':
        return endpointData;
      case 'network':
        return networkData;
      case 'map':
        return mapData;
      case 'pages':
        return pageData;
      case 'third-parties':
        return thirdPartyData;
      case 'overview':
        return statsData;
      case 'user-overview':
        return userOverviewData;
      case 'user-pageviews':
        return userPageviewsData;
      case 'user-visits':
        return userVisitsData;
      case 'user-journeys':
        return userJourneysData;
      case 'user-geography':
        return userGeographyData;
      case 'user-devices':
        return userDevicesData;
      case 'user-referrers':
        return userReferrersData;
      case 'user-engagement':
        return userEngagementData;
      default:
        return undefined;
    }
  }, [
    activeTab,
    endpointData,
    ispData,
    mapData,
    networkData,
    pageData,
    statsData,
    thirdPartyData,
    userDevicesData,
    userEngagementData,
    userGeographyData,
    userJourneysData,
    userOverviewData,
    userPageviewsData,
    userReferrersData,
    userVisitsData,
  ]);

  // Generate prompts based on data
  const prompts = useMemo(() => {
    return generateDynamicPrompts(activeTab, activeData, effectiveRange);
  }, [activeData, activeTab, effectiveRange]);

  return (
    <>
      <div
        className={`dashboard-ai-pill fixed bottom-5 right-5 z-[10010] transition-opacity ${
          isOpen ? 'pointer-events-none opacity-0' : 'opacity-100'
        } ${className}`}
      >
        <DashboardTooltip
          content="Chat with AI"
          side="left"
          popupClassName="min-w-[8.5rem] whitespace-nowrap px-3.5 py-2 text-sm leading-5"
        >
          <button
            type="button"
            onClick={onOpen}
            aria-label="Chat with AI"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--dash-blue)] bg-[color:var(--dash-blue)] text-white shadow-[var(--dash-button-shadow)] transition-colors hover:bg-[color:var(--dash-blue-hover)] hover:border-[color:var(--dash-blue-hover)]"
          >
            <BotMessageSquare className="h-5 w-5 shrink-0" strokeWidth={1.9} aria-hidden />
          </button>
        </DashboardTooltip>
      </div>

      {/* AI Insights Panel */}
      <AIInsightsPanel
        key={`${projectId}:${activeTab}:${effectiveRange}`}
        isOpen={isOpen}
        onClose={onClose}
        projectId={projectId}
        activeTab={activeTab}
        range={effectiveRange}
        prompts={prompts}
      />
    </>
  );
}
