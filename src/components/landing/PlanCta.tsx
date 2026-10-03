'use client';

import Link from 'next/link';
import { useState } from 'react';
import { normalizePlanId, PLAN_RANK, type BillingInterval, type PlanId } from '@/lib/billing/config';
import type { PlanDisplayRow } from '@/lib/billing/pricing-display';
import { startBillingCheckout } from '@/lib/billing/checkout-client';

interface SubscriptionData {
  plan: {
    id: string;
    name: string;
  };
  subscription: {
    status: string;
    plan?: string;
    billingInterval?: BillingInterval;
    currentPeriodEnd: string | null;
  } | null;
}

function ctaClass(featured: boolean, extra?: string) {
  return [
    'landing-pricing-cta',
    featured && 'landing-pricing-cta--featured dashboard-button-primary',
    extra,
  ]
    .filter(Boolean)
    .join(' ');
}

function planRank(planId: string): number {
  return PLAN_RANK[planId as PlanId] ?? 0;
}

function useFeaturedCta(plan: PlanDisplayRow, highlightCurrentPlan: boolean): boolean {
  if (highlightCurrentPlan) return false;
  return plan.planId === 'premium' || plan.planId === 'free' || plan.planId === 'pro';
}

function paidPlanActionLabel(plan: PlanDisplayRow, highlightCurrentPlan: boolean): string {
  if (highlightCurrentPlan) return 'Upgrade';
  if (plan.planId === 'pro' || plan.planId === 'premium') return 'Buy now';
  return plan.popular ? 'Buy now' : 'Upgrade';
}

function isBillingIntervalSwitch(
  plan: PlanDisplayRow,
  currentPlanId: string,
  currentBillingInterval?: BillingInterval,
): boolean {
  return (
    plan.planId !== 'free' &&
    currentPlanId === plan.planId &&
    !!currentBillingInterval &&
    plan.billingInterval !== currentBillingInterval
  );
}

function checkoutActionLabel(
  plan: PlanDisplayRow,
  highlightCurrentPlan: boolean,
  intervalSwitch: boolean,
): string {
  if (intervalSwitch) {
    return plan.billingInterval === 'yearly' ? 'Switch to yearly' : 'Switch to monthly';
  }
  return paidPlanActionLabel(plan, highlightCurrentPlan);
}

function buildBillingHref(plan: PlanDisplayRow) {
  if (plan.planId === 'free') {
    return '/dashboard/billing';
  }

  const params = new URLSearchParams({
    plan: plan.planId,
    interval: plan.billingInterval,
  });

  return `/dashboard/billing?${params.toString()}`;
}

function buildSignUpHref(plan: PlanDisplayRow) {
  const params = new URLSearchParams({ fromPricing: 'true' });
  if (plan.planId !== 'free') {
    params.set('plan', plan.planId);
    params.set('interval', plan.billingInterval);
  }

  const returnTo = encodeURIComponent(`/onboarding?${params.toString()}`);
  return `/auth/sign-up?returnTo=${returnTo}`;
}

function ManageBillingCta({
  featured = false,
  compact = false,
}: {
  featured?: boolean;
  compact?: boolean;
}) {
  return (
    <Link
      href="/dashboard/billing?manage=1"
      className={ctaClass(featured, compact ? 'text-xs py-2' : '')}
    >
      Manage billing
    </Link>
  );
}

function IncludedCta({ compact = false }: { compact?: boolean }) {
  return (
    <button type="button" disabled className={ctaClass(false, compact ? 'text-xs py-2' : '')}>
      Included
    </button>
  );
}

export function PlanCta({
  plan,
  isLoading,
  isAuthenticated,
  subscriptionData,
  currentPlanId: currentPlanIdProp,
  currentBillingInterval: currentBillingIntervalProp,
  compact = false,
  redirectToBilling = false,
  highlightCurrentPlan = true,
}: {
  plan: PlanDisplayRow;
  isLoading: boolean;
  isAuthenticated: boolean;
  subscriptionData: SubscriptionData | null;
  /** Normalized plan id from PricingPlanCards (preferred over subscriptionData.plan.id). */
  currentPlanId?: string;
  /** Active subscription interval (monthly vs yearly). */
  currentBillingInterval?: BillingInterval;
  compact?: boolean;
  /** Landing page: send signed-in users to dashboard billing instead of inline checkout. */
  redirectToBilling?: boolean;
  /** Marketing pages: do not show "Current plan" / manage-only CTAs for the active plan. */
  highlightCurrentPlan?: boolean;
}) {
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  if (isLoading) {
    return (
      <button
        type="button"
        disabled
        className={ctaClass(plan.popular, `cursor-not-allowed opacity-70 ${compact ? 'text-xs py-2' : ''}`)}
      >
        Loading...
      </button>
    );
  }

  if (!isAuthenticated) {
    if (!highlightCurrentPlan) {
      if (plan.planId === 'free') {
        return (
          <Link
            href={buildSignUpHref(plan)}
            className={ctaClass(true, compact ? 'text-xs py-2' : '')}
          >
            Get started for free
          </Link>
        );
      }

      if (plan.planId === 'premium') {
        return (
          <Link
            href={buildSignUpHref(plan)}
            className={ctaClass(true, compact ? 'text-xs py-2' : '')}
          >
            Buy now
          </Link>
        );
      }

      if (plan.planId === 'pro') {
        return (
          <Link
            href={buildSignUpHref(plan)}
            className={ctaClass(true, compact ? 'text-xs py-2' : '')}
          >
            Buy now
          </Link>
        );
      }
    }

    return (
      <Link
        href={buildSignUpHref(plan)}
        className={ctaClass(plan.popular, compact ? 'text-xs py-2' : '')}
      >
        {plan.planId === 'free' ? 'Get started for free' : `Get ${plan.name}`}
      </Link>
    );
  }

  const currentPlanId = normalizePlanId(
    currentPlanIdProp ??
      subscriptionData?.subscription?.plan ??
      subscriptionData?.plan?.id ??
      'free',
  );
  const subscriptionStatus = subscriptionData?.subscription?.status;
  const currentBillingInterval =
    currentBillingIntervalProp ?? subscriptionData?.subscription?.billingInterval;
  const isUserCurrentPlan =
    currentPlanId === plan.planId &&
    (plan.planId === 'free' ||
      !currentBillingInterval ||
      plan.billingInterval === currentBillingInterval);
  const isCurrentPlan = highlightCurrentPlan && isUserCurrentPlan;
  const currentRank = planRank(currentPlanId);
  const targetRank = planRank(plan.planId);
  const isLowerPaidTier =
    highlightCurrentPlan && targetRank < currentRank && plan.planId !== 'free';

  if (!highlightCurrentPlan) {
    if (plan.planId === 'free') {
      return (
        <Link
          href={isAuthenticated ? '/dashboard' : buildSignUpHref(plan)}
          className={ctaClass(true, compact ? 'text-xs py-2' : '')}
        >
          Get started for free
        </Link>
      );
    }

    if (plan.planId === 'premium') {
      return (
        <Link
          href={buildBillingHref(plan)}
          className={ctaClass(true, compact ? 'text-xs py-2' : '')}
        >
          Buy now
        </Link>
      );
    }

    if (plan.planId === 'pro') {
      return (
        <Link
          href={buildBillingHref(plan)}
          className={ctaClass(true, compact ? 'text-xs py-2' : '')}
        >
          Buy now
        </Link>
      );
    }
  }

  if (isLowerPaidTier) {
    return <IncludedCta compact={compact} />;
  }

  if (isCurrentPlan) {
    if (plan.planId === 'pro' || plan.planId === 'premium') {
      return <ManageBillingCta compact={compact} />;
    }

    return (
      <button type="button" disabled className={ctaClass(false, compact ? 'text-xs py-2' : '')}>
        Current plan
      </button>
    );
  }

  if (redirectToBilling) {
    return (
      <Link
        href={buildBillingHref(plan)}
        className={ctaClass(useFeaturedCta(plan, highlightCurrentPlan), compact ? 'text-xs py-2' : '')}
      >
        {plan.planId === 'free' ? 'Go to billing' : paidPlanActionLabel(plan, highlightCurrentPlan)}
      </Link>
    );
  }

  const intervalSwitch = isBillingIntervalSwitch(plan, currentPlanId, currentBillingInterval);
  const canCheckout =
    plan.planId !== 'free' && (targetRank > currentRank || intervalSwitch);

  if (canCheckout) {
    const featured = useFeaturedCta(plan, highlightCurrentPlan);
    const label = checkoutActionLabel(plan, highlightCurrentPlan, intervalSwitch);
    const startCheckout = async () => {
      setCheckoutLoading(true);
      try {
        await startBillingCheckout(plan.planId, plan.billingInterval);
      } catch {
        window.location.href = buildBillingHref(plan);
      } finally {
        setCheckoutLoading(false);
      }
    };

    return (
      <button
        type="button"
        onClick={() => void startCheckout()}
        disabled={checkoutLoading}
        className={ctaClass(featured, compact ? 'text-xs py-2' : '')}
      >
        {checkoutLoading ? 'Loading...' : label}
      </button>
    );
  }

  if (highlightCurrentPlan && plan.planId === 'free' && currentRank > 0) {
    if (subscriptionStatus === 'pending_cancellation') {
      return (
        <button type="button" disabled className={ctaClass(false, compact ? 'text-xs py-2' : '')}>
          Cancellation scheduled
        </button>
      );
    }

    return <IncludedCta compact={compact} />;
  }

  return (
    <Link
      href={plan.planId === 'free' ? '/dashboard/billing' : buildBillingHref(plan)}
      className={ctaClass(useFeaturedCta(plan, highlightCurrentPlan), compact ? 'text-xs py-2' : '')}
    >
      {plan.planId === 'free' ? 'Get started for free' : paidPlanActionLabel(plan, highlightCurrentPlan)}
    </Link>
  );
}
