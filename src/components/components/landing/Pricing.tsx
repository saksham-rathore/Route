'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSectionView } from '@/lib/analytics/use-section-view';
import type { BillingInterval } from '@/lib/billing/config';
import { PricingPlanCards } from '@/components/landing/PricingPlanCards';
import { useAuth } from '@/components/providers/auth-provider';

interface SubscriptionData {
  plan: {
    id: string;
    name: string;
  };
  subscription: {
    status: string;
    currentPeriodEnd: string | null;
  } | null;
}

type PricingProps = {
  showCompareLink?: boolean;
  billingInterval?: BillingInterval;
  onBillingIntervalChange?: (interval: BillingInterval) => void;
  showIntervalToggle?: boolean;
  /** Home landing: signed-in users go to dashboard billing instead of inline checkout. */
  redirectToBilling?: boolean;
};

export function Pricing({
  showCompareLink = true,
  billingInterval: billingIntervalProp,
  onBillingIntervalChange,
  showIntervalToggle = true,
  redirectToBilling = false,
}: PricingProps) {
  const sectionRef = useSectionView('pricing', 0.2);
  const { user, isLoading: authLoading } = useAuth();
  const isAuthenticated = !!user;

  const [internalInterval, setInternalInterval] = useState<BillingInterval>('monthly');
  const billingInterval = billingIntervalProp ?? internalInterval;
  const setBillingInterval = onBillingIntervalChange ?? setInternalInterval;

  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [isLoadingSub, setIsLoadingSub] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setSubscriptionData(null);
      return;
    }

    setIsLoadingSub(true);
    fetch('/api/billing/usage')
      .then((res) => res.json())
      .then((data) => {
        setSubscriptionData(data as SubscriptionData);
      })
      .catch(() => {
        setSubscriptionData({
          plan: { id: 'free', name: 'Free' },
          subscription: null,
        });
      })
      .finally(() => {
        setIsLoadingSub(false);
      });
  }, [isAuthenticated]);

  const isLoading = authLoading || isLoadingSub;
  const currentPlanId = subscriptionData?.plan?.id;

  return (
    <section ref={sectionRef} className="w-full border-y border-[color:var(--landing-border)] bg-[color:var(--landing-page-bg)] py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-16">
        <div className="mx-auto mb-8 max-w-2xl text-center md:mb-10">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--landing-text-muted)]">
            Pricing
          </p>
          <h2 className="mb-3 text-3xl font-extrabold text-[color:var(--landing-text)] md:text-4xl">
            Simple, transparent pricing.
          </h2>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-[color:var(--landing-text-soft)]">
            Start free, upgrade when you need more. No hidden fees.
          </p>
          {showCompareLink ? (
            <p className="mt-5">
              <Link
                href="/pricing"
                className="text-sm font-semibold text-[color:var(--landing-accent)] underline-offset-4 hover:underline"
              >
                Compare all plans in detail
              </Link>
            </p>
          ) : null}
        </div>

        <PricingPlanCards
          billingInterval={billingInterval}
          onBillingIntervalChange={showIntervalToggle ? setBillingInterval : undefined}
          showIntervalToggle={showIntervalToggle}
          currentPlanId={currentPlanId}
          subscriptionData={subscriptionData}
          isLoading={isLoading}
          isAuthenticated={isAuthenticated}
          redirectToBilling={redirectToBilling}
          highlightCurrentPlan={false}
        />

      </div>
    </section>
  );
}
