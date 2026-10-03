'use client'

import Link from 'next/link'
import { useAuth } from '@/components/providers/auth-provider'
import { RouteEvents } from '@/lib/analytics/route-analytics'

const navbarCtaClassName =
  'dashboard-button-primary inline-flex h-9 px-3 text-xs font-medium sm:px-4 sm:text-sm'

/**
 * Primary CTA in the landing navbar (Get started vs Dashboard).
 */
export function NavbarAuthCta() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div
        className={`${navbarCtaClassName} w-[7.5rem] animate-pulse bg-[color:var(--landing-surface-muted)]`}
        aria-hidden
      />
    )
  }

  if (user) {
    return (
      <Link
        href="/dashboard"
        data-umami-event={RouteEvents.HERO_CTA_CLICK}
        data-umami-event-button="go_to_dashboard"
        data-umami-event-location="navbar"
        className={navbarCtaClassName}
      >
        Dashboard
      </Link>
    )
  }

  return (
    <Link
      href="/auth/sign-up"
      data-umami-event={RouteEvents.HERO_CTA_CLICK}
      data-umami-event-button="sign_up"
      data-umami-event-location="navbar"
      className={navbarCtaClassName}
    >
      Get started
    </Link>
  )
}

/**
 * Auth-aware nav button for the landing header.
 * Renders nothing until the client session is resolved, avoiding
 * hydration mismatches between server and client.
 */
export function HeaderAuthButton() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    // Render a placeholder with the same dimensions so layout doesn't shift
    return (
      <div className="h-8 w-[72px] rounded-lg bg-white/5 animate-pulse" />
    )
  }

  if (user) {
    return (
      <Link
        href="/dashboard"
        data-umami-event={RouteEvents.HERO_CTA_CLICK}
        data-umami-event-button="go_to_dashboard"
        data-umami-event-location="header"
        className="h-8 px-4 bg-[#0070f3] text-white rounded-lg text-sm font-medium flex items-center justify-center hover:opacity-90 transition-opacity"
      >
        Go to Dashboard
      </Link>
    )
  }

  return (
    <Link
      href="/auth/sign-in"
      data-umami-event={RouteEvents.AUTH_SIGN_IN}
      data-umami-event-location="header"
      className="h-8 px-4 border border-white/10 rounded-lg text-sm font-medium flex items-center justify-center hover:bg-white/5 transition-colors"
    >
      Sign In
    </Link>
  )
}

/**
 * Auth-aware CTA buttons for the landing hero.
 */
export function HeroAuthButtons() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-3 md:gap-4">
        <div className="h-11 md:h-12 w-[180px] rounded-xl bg-white/5 animate-pulse" />
      </div>
    )
  }

  if (user) {
    return (
      <div className="flex flex-wrap gap-3 md:gap-4">
        <Link
          href="/dashboard"
          data-umami-event={RouteEvents.HERO_CTA_CLICK}
          data-umami-event-button="go_to_dashboard"
          data-umami-event-location="hero"
          className="h-11 md:h-12 px-6 md:px-7 bg-white text-black rounded-xl text-sm font-semibold flex items-center justify-center hover:opacity-90 transition-opacity"
        >
          Go to Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-3 md:gap-4">
      <Link
        href="/auth/sign-up"
        data-umami-event={RouteEvents.HERO_CTA_CLICK}
        data-umami-event-button="start_monitoring_free"
        data-umami-event-location="hero"
        className="h-11 md:h-12 px-6 md:px-7 bg-white text-black rounded-xl text-sm font-semibold flex items-center justify-center hover:opacity-90 transition-opacity"
      >
        Start monitoring free
      </Link>
      <Link
        href="/auth/sign-in"
        data-umami-event={RouteEvents.HERO_CTA_CLICK}
        data-umami-event-button="request_demo"
        data-umami-event-location="hero"
        className="h-11 md:h-12 px-6 md:px-7 border border-white/10 rounded-xl text-sm font-medium flex items-center justify-center hover:bg-white/5 transition-colors"
      >
        Request demo
      </Link>
    </div>
  )
}
