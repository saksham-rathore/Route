'use client';

import { useEffect, useMemo, useState } from 'react';
import { Check, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { buildPlanDisplayRows, type PlanDisplayRow } from '@/lib/billing/pricing-display';
import { normalizePlanId, type BillingInterval } from '@/lib/billing/config';
import { PlanCta } from '@/components/landing/PlanCta';
import { BillingIntervalToggle } from '@/components/landing/BillingIntervalToggle';

function isActiveSubscriptionPlanCard(
  plan: PlanDisplayRow,
  currentPlanId: string | undefined,
  currentBillingInterval: BillingInterval | undefined,
  highlightCurrentPlan: boolean,
): boolean {
  if (!highlightCurrentPlan || !currentPlanId) return false;
  if (normalizePlanId(currentPlanId) !== plan.planId) return false;
  if (plan.planId === 'free') return true;
  if (!currentBillingInterval) return plan.billingInterval === 'monthly';
  return plan.billingInterval === currentBillingInterval;
}

export type PricingPlanCardsSubscription = {
  plan: {
    id: string;
    name: string;
  };
  subscription: {
    status: string;
    billingInterval?: BillingInterval;
    currentPeriodEnd: string | null;
  } | null;
};

type PricingPlanCardsProps = {
  billingInterval: BillingInterval;
  onBillingIntervalChange?: (interval: BillingInterval) => void;
  showIntervalToggle?: boolean;
  currentPlanId?: string;
  currentBillingInterval?: BillingInterval;
  subscriptionData: PricingPlanCardsSubscription | null;
  isLoading?: boolean;
  isAuthenticated?: boolean;
  redirectToBilling?: boolean;
  /** Marketing pages: hide current-plan badge, border, and tab highlight. */
  highlightCurrentPlan?: boolean;
};

type PricingPlanCardProps = {
  plan: PlanDisplayRow;
  currentPlanId?: string;
  currentBillingInterval?: BillingInterval;
  isLoading: boolean;
  isAuthenticated: boolean;
  subscriptionData: PricingPlanCardsSubscription | null;
  redirectToBilling: boolean;
  highlightCurrentPlan: boolean;
  className?: string;
};

function PricingPlanCard({
  plan,
  currentPlanId,
  currentBillingInterval,
  isLoading,
  isAuthenticated,
  subscriptionData,
  redirectToBilling,
  highlightCurrentPlan,
  className = '',
}: PricingPlanCardProps) {
  const isCurrentPlan = isActiveSubscriptionPlanCard(
    plan,
    currentPlanId,
    currentBillingInterval,
    highlightCurrentPlan,
  );
  /** Billing: only current plan is highlighted. Landing: Pro card is featured. */
  const isFeatured = !highlightCurrentPlan && plan.planId === 'pro';
  const showPopularBadge = !highlightCurrentPlan && plan.planId === 'pro';

  const cardClass = [
    'relative flex w-full flex-col p-5 sm:p-6',
    'landing-pricing-card',
    isFeatured && 'landing-pricing-card--featured',
    isCurrentPlan && 'landing-pricing-card--current',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cardClass}>
      {isCurrentPlan ? (
        <div className="absolute -top-3 left-1/2 z-[1] -translate-x-1/2">
          <span className="landing-pricing-badge landing-pricing-badge--current">Current plan</span>
        </div>
      ) : showPopularBadge ? (
        <div className="absolute right-4 top-4 z-[1] flex items-center">
          <span className="landing-pricing-badge landing-pricing-badge--popular">Popular</span>
        </div>
      ) : null}

      <div className={isFeatured ? 'mb-6 pr-14 sm:pr-16' : 'mb-6'}>
        <h3 className="mb-1 text-lg font-extrabold text-[color:var(--landing-text)] sm:text-xl">
          {plan.name}
        </h3>
        <p className="mb-5 min-h-[4.5rem] text-sm leading-relaxed text-[color:var(--landing-text-soft)] sm:min-h-[3.75rem]">
          {plan.description}
        </p>

        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-4xl font-extrabold tracking-tight text-[color:var(--landing-text)] sm:text-[2.5rem]">
            {plan.price}
          </span>
          {plan.pricePeriodLabel ? (
            <span className="text-sm font-medium text-[color:var(--landing-text-muted)]">
              {plan.pricePeriodLabel}
            </span>
          ) : null}
        </div>
      </div>

      <ul className="mb-6 flex-1 divide-y divide-[color:var(--dash-divider)]">
        {plan.features.map((feature) => (
          <li
            key={feature.key}
            className="flex min-h-[2.75rem] items-start gap-3 py-2.5 sm:min-h-11"
          >
            <span className="min-w-0 flex-1 text-sm leading-snug text-[color:var(--landing-text-soft)]">
              {feature.label}
            </span>
            {!feature.isBoolean ? (
              <span className="shrink-0 text-right text-sm font-bold tabular-nums text-[color:var(--landing-text)]">
                {feature.displayValue}
              </span>
            ) : null}
            {feature.isBoolean ? (
              feature.value ? (
                <span className="landing-pricing-check shrink-0" aria-hidden>
                  <Check className="h-3 w-3 stroke-[3]" />
                </span>
              ) : (
                <span className="landing-pricing-cross shrink-0" aria-hidden>
                  <X className="h-3 w-3 stroke-[3]" />
                </span>
              )
            ) : null}
          </li>
        ))}
      </ul>

      <PlanCta
        plan={plan}
        isLoading={isLoading}
        isAuthenticated={isAuthenticated}
        subscriptionData={subscriptionData}
        currentPlanId={currentPlanId}
        currentBillingInterval={currentBillingInterval}
        redirectToBilling={redirectToBilling}
        highlightCurrentPlan={highlightCurrentPlan}
      />
    </div>
  );
}

function getDefaultPlanIndex(
  plans: PlanDisplayRow[],
  currentPlanId?: string,
  currentBillingInterval?: BillingInterval,
  highlightCurrentPlan = true,
): number {
  if (highlightCurrentPlan && currentPlanId) {
    const currentIndex = plans.findIndex((plan) =>
      isActiveSubscriptionPlanCard(plan, currentPlanId, currentBillingInterval, true),
    );
    if (currentIndex >= 0) return currentIndex;
  }

  const popularIndex = plans.findIndex((plan) => plan.popular);
  return popularIndex >= 0 ? popularIndex : 0;
}

export function PricingPlanCards({
  billingInterval,
  onBillingIntervalChange,
  showIntervalToggle = false,
  currentPlanId,
  currentBillingInterval,
  subscriptionData,
  isLoading = false,
  isAuthenticated = true,
  redirectToBilling = false,
  highlightCurrentPlan = true,
}: PricingPlanCardsProps) {
  const planDisplay = useMemo(() => buildPlanDisplayRows(billingInterval), [billingInterval]);
  const resolvedCurrentPlanId = currentPlanId ? normalizePlanId(currentPlanId) : undefined;
  const resolvedCurrentBillingInterval =
    currentBillingInterval ?? subscriptionData?.subscription?.billingInterval;
  const [activeIndex, setActiveIndex] = useState(() =>
    getDefaultPlanIndex(
      planDisplay,
      resolvedCurrentPlanId,
      resolvedCurrentBillingInterval,
      highlightCurrentPlan,
    ),
  );

  useEffect(() => {
    setActiveIndex(
      getDefaultPlanIndex(
        planDisplay,
        resolvedCurrentPlanId,
        resolvedCurrentBillingInterval,
        highlightCurrentPlan,
      ),
    );
  }, [
    billingInterval,
    planDisplay,
    resolvedCurrentPlanId,
    resolvedCurrentBillingInterval,
    highlightCurrentPlan,
  ]);

  const activePlan = planDisplay[activeIndex] ?? planDisplay[0];
  const canGoPrev = activeIndex > 0;
  const canGoNext = activeIndex < planDisplay.length - 1;

  const cardProps = {
    currentPlanId: resolvedCurrentPlanId,
    currentBillingInterval: resolvedCurrentBillingInterval,
    isLoading,
    isAuthenticated,
    subscriptionData,
    redirectToBilling,
    highlightCurrentPlan,
  };

  return (
    <div className="space-y-6">
      {showIntervalToggle && onBillingIntervalChange ? (
        <div className="flex justify-center">
          <BillingIntervalToggle value={billingInterval} onChange={onBillingIntervalChange} />
        </div>
      ) : null}

      {/* Tablet / mobile: one card + prev / next below */}
      <div className="lg:hidden">
        <div className="mx-auto w-full max-w-lg px-3 pt-4 sm:max-w-xl sm:px-4">
          {activePlan ? (
            <PricingPlanCard plan={activePlan} {...cardProps} />
          ) : null}
        </div>

        <div className="mx-auto mt-4 flex max-w-xl items-center justify-center gap-6 px-3">
          <button
            type="button"
            onClick={() => setActiveIndex((index) => Math.max(0, index - 1))}
            disabled={!canGoPrev}
            aria-label="Previous plan"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--landing-border)] bg-[color:var(--landing-surface)] text-[color:var(--landing-text)] shadow-[var(--dash-control-shadow)] transition enabled:hover:bg-[color:var(--landing-surface-hover)] disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveIndex((index) => Math.min(planDisplay.length - 1, index + 1))
            }
            disabled={!canGoNext}
            aria-label="Next plan"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--landing-border)] bg-[color:var(--landing-surface)] text-[color:var(--landing-text)] shadow-[var(--dash-control-shadow)] transition enabled:hover:bg-[color:var(--landing-surface-hover)] disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Desktop: three-column grid */}
      <div className="mx-auto hidden max-w-6xl gap-5 pt-4 lg:grid lg:grid-cols-3 lg:items-stretch">
        {planDisplay.map((plan) => (
          <PricingPlanCard key={plan.cardId} plan={plan} {...cardProps} />
        ))}
      </div>
    </div>
  );
}
