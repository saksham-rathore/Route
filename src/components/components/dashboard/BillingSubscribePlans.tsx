'use client';

import { useEffect, useMemo, useState } from 'react';
import type { BillingInterval } from '@/lib/billing/config';
import { PricingPlanCards } from '@/components/landing/PricingPlanCards';

type BillingSubscribePlansProps = {
  currentPlanId: string;
  currentBillingInterval?: BillingInterval;
  subscription: {
    status: string;
    billingInterval?: BillingInterval;
    currentPeriodEnd: string | null;
  } | null;
  planName: string;
};

export function BillingSubscribePlans({
  currentPlanId,
  currentBillingInterval,
  subscription,
  planName,
}: BillingSubscribePlansProps) {
  const resolvedInterval = currentBillingInterval ?? subscription?.billingInterval;
  const [billingInterval, setBillingInterval] = useState<BillingInterval>(
    () => resolvedInterval ?? 'monthly',
  );

  useEffect(() => {
    if (resolvedInterval) {
      setBillingInterval(resolvedInterval);
    }
  }, [resolvedInterval]);

  const subscriptionData = useMemo(
    () => ({
      plan: { id: currentPlanId, name: planName },
      subscription,
    }),
    [currentPlanId, planName, subscription],
  );

  return (
    <PricingPlanCards
      billingInterval={billingInterval}
      onBillingIntervalChange={setBillingInterval}
      showIntervalToggle
      currentPlanId={currentPlanId}
      currentBillingInterval={currentBillingInterval ?? subscription?.billingInterval}
      subscriptionData={subscriptionData}
      isLoading={false}
      isAuthenticated
    />
  );
}
