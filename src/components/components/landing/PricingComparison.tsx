'use client';

import { Fragment, useEffect, useMemo, useState } from 'react';
import { Check, X } from 'lucide-react';
import { BILLING_CONFIG, type BillingInterval, type PlanId } from '@/lib/billing/config';
import {
  buildPlanDisplayRows,
  formatComparisonCell,
  getPlanFeatureValue,
  isComparisonBoolean,
  PRICING_COMPARISON_GROUPS,
} from '@/lib/billing/pricing-display';
import { PlanCta } from '@/components/landing/PlanCta';
import { useAuth } from '@/components/providers/auth-provider';

interface SubscriptionData {
  plan: { id: string; name: string };
  subscription: { status: string; currentPeriodEnd: string | null } | null;
}

const PLAN_IDS = BILLING_CONFIG.planOrder as unknown as PlanId[];

function ComparisonCell({ featureKey, planId }: { featureKey: string; planId: PlanId }) {
  const value = getPlanFeatureValue(planId, featureKey);
  const isBoolean = isComparisonBoolean(featureKey);

  if (isBoolean) {
    return value ? (
      <span className="landing-pricing-matrix-check" aria-hidden>
        <Check className="h-3 w-3 stroke-[3]" />
      </span>
    ) : (
      <span className="landing-pricing-matrix-cross" aria-hidden>
        <X className="h-3 w-3 stroke-[3]" />
      </span>
    );
  }

  return (
    <span className="text-sm font-semibold text-[color:var(--landing-text)]">
      {formatComparisonCell(featureKey, value)}
    </span>
  );
}

export function PricingComparison({ billingInterval = 'monthly' }: { billingInterval?: BillingInterval }) {
  const planRows = useMemo(() => buildPlanDisplayRows(billingInterval), [billingInterval]);

  function columnClass(planId: PlanId) {
    const plan = planRows.find((row) => row.planId === planId);
    return plan?.popular ? 'landing-pricing-matrix-column--featured' : '';
  }

  const { user, isLoading: authLoading } = useAuth();
  const isAuthenticated = !!user;
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
      .then((data) => setSubscriptionData(data as SubscriptionData))
      .catch(() => {
        setSubscriptionData({
          plan: { id: 'free', name: 'Free' },
          subscription: null,
        });
      })
      .finally(() => setIsLoadingSub(false));
  }, [isAuthenticated]);

  const isLoading = authLoading || isLoadingSub;

  return (
    <section className="border-t border-[color:var(--landing-border)] bg-[color:var(--landing-page-bg)]">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-16 md:py-24">
        <div className="mb-10 text-center md:mb-14">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[color:var(--landing-text-muted)]">
            Plan comparison
          </p>
          <h2 className="mt-3 text-2xl font-extrabold text-[color:var(--landing-text)] md:text-3xl">
            Detailed plan comparison
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[color:var(--landing-text-soft)]">
            Limits, retention, alerts, and status page features at a glance so you can pick the right tier without guessing.
          </p>
        </div>

        <div className="space-y-6 lg:hidden">
          {planRows.map((plan) => (
            <article
              key={plan.planId}
              className={[
                'landing-pricing-card p-5',
                plan.popular && 'landing-pricing-card--featured',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  {plan.popular ? (
                    <span className="landing-pricing-badge landing-pricing-badge--popular mb-2 inline-block">
                      Popular
                    </span>
                  ) : null}
                  <h3 className="text-lg font-extrabold text-[color:var(--landing-text)]">{plan.name}</h3>
                  <p className="mt-1 text-sm text-[color:var(--landing-text-soft)]">{plan.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-extrabold text-[color:var(--landing-text)]">
                    {plan.price}
                    {plan.pricePeriodLabel ? (
                      <span className="text-sm font-medium text-[color:var(--landing-text-muted)]">
                        {plan.pricePeriodLabel}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>

              {PRICING_COMPARISON_GROUPS.map((group) => (
                <div
                  key={group.id}
                  className="mt-6 border-t border-[color:var(--landing-border)] pt-5 first:mt-0 first:border-0 first:pt-0"
                >
                  <h4 className="text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--landing-text-muted)]">
                    {group.title}
                  </h4>
                  <ul className="mt-3 space-y-2.5">
                    {group.features.map((feature) => {
                      const value = getPlanFeatureValue(plan.planId, feature.key);
                      const isBoolean = isComparisonBoolean(feature.key);
                      return (
                        <li key={feature.key} className="flex items-center justify-between gap-3 text-sm">
                          <span className="text-[color:var(--landing-text-soft)]">{feature.label}</span>
                          {isBoolean ? (
                            value ? (
                              <span className="landing-pricing-check" aria-hidden>
                                <Check className="h-3 w-3 stroke-[3]" />
                              </span>
                            ) : (
                              <span className="text-[color:var(--landing-text-muted)]">-</span>
                            )
                          ) : (
                            <span className="font-semibold text-[color:var(--landing-text)]">
                              {formatComparisonCell(feature.key, value)}
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}

              <div className="mt-6">
                <PlanCta
                  plan={plan}
                  isLoading={isLoading}
                  isAuthenticated={isAuthenticated}
                  subscriptionData={subscriptionData}
                />
              </div>
            </article>
          ))}
        </div>

        <div className="hidden overflow-x-auto lg:block">
          <table className="landing-pricing-matrix w-full min-w-[860px] text-left">
            <thead>
              <tr>
                <th scope="col" className="landing-pricing-matrix-head w-[28%]">
                  Product features
                </th>
                {planRows.map((plan) => (
                  <th
                    key={plan.planId}
                    scope="col"
                    className={[
                      'landing-pricing-matrix-plan w-[24%]',
                      plan.popular && 'landing-pricing-matrix-column--featured',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <div className="flex min-h-48 flex-col">
                      {plan.popular ? (
                        <span className="landing-pricing-badge landing-pricing-badge--popular mb-2 self-start">
                          Popular
                        </span>
                      ) : (
                        <span className="mb-2 block h-6" aria-hidden />
                      )}
                      <span className="text-lg font-extrabold text-[color:var(--landing-text)]">{plan.name}</span>
                      <span className="mt-1 min-h-10 text-xs leading-relaxed text-[color:var(--landing-text-soft)]">
                        {plan.description}
                      </span>
                      <div className="mt-4 flex flex-wrap items-baseline gap-x-1.5 gap-y-1">
                        <span className="text-3xl font-extrabold text-[color:var(--landing-text)]">
                          {plan.price}
                        </span>
                        {plan.pricePeriodLabel ? (
                          <span className="text-xs text-[color:var(--landing-text-muted)]">
                            {plan.pricePeriodLabel}
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-4">
                        <PlanCta
                          plan={plan}
                          isLoading={isLoading}
                          isAuthenticated={isAuthenticated}
                          subscriptionData={subscriptionData}
                          compact
                        />
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PRICING_COMPARISON_GROUPS.map((group) => (
                <Fragment key={group.id}>
                  <tr className="landing-pricing-matrix-group">
                    <th colSpan={4} scope="colgroup" className="landing-pricing-matrix-group-cell">
                      <span>{group.title}</span>
                      <small>{group.description}</small>
                    </th>
                  </tr>
                  {group.features.map((feature, rowIndex) => (
                    <tr
                      key={feature.key}
                      className={
                        rowIndex % 2 === 0
                          ? 'landing-pricing-matrix-row'
                          : 'landing-pricing-matrix-row landing-pricing-matrix-row--alt'
                      }
                    >
                      <th scope="row" className="landing-pricing-matrix-feature">
                        {feature.label}
                      </th>
                      {PLAN_IDS.map((planId) => (
                        <td
                          key={`${feature.key}-${planId}`}
                          className={[
                            'landing-pricing-matrix-cell',
                            columnClass(planId),
                          ]
                            .filter(Boolean)
                            .join(' ')}
                        >
                          <ComparisonCell featureKey={feature.key} planId={planId} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
