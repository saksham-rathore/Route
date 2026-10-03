'use client';

import { useState } from 'react';
import type { BillingInterval } from '@/lib/billing/config';
import { Pricing } from '@/components/landing/Pricing';
import { PricingComparison } from '@/components/landing/PricingComparison';

export function PricingPageSections() {
  const [billingInterval, setBillingInterval] = useState<BillingInterval>('monthly');

  return (
    <>
      <Pricing
        showCompareLink={false}
        billingInterval={billingInterval}
        onBillingIntervalChange={setBillingInterval}
        showIntervalToggle
      />
      <PricingComparison billingInterval={billingInterval} />
    </>
  );
}
