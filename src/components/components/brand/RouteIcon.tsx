type RouteIconProps = {
  className?: string;
  /** @deprecated Use className height (e.g. h-8) instead. Kept for call-site compatibility. */
  size?: number;
  /** Force a single logo variant instead of following dashboard theme. */
  theme?: 'light' | 'dark' | 'auto';
};

export const ROUTE_LOGO_LIGHT_URL = 'https://cdn.route.dev/images/logo-light.svg';
export const ROUTE_LOGO_DARK_URL = 'https://cdn.route.dev/images/logo-dark.svg';
export const ROUTE_STATUS_PAGE_LOGO_URL =
  'https://cdn.route.dev/images/status-page-logo.svg';

export function RouteIcon({ className = 'h-6 w-auto', size, theme = 'auto' }: RouteIconProps) {
  const sizeStyle = size != null ? { height: size, width: 'auto' as const } : undefined;

  if (theme === 'light') {
    return (
      <img
        src={ROUTE_LOGO_LIGHT_URL}
        alt="route"
        width={358}
        height={109}
        className={`shrink-0 ${className}`}
        style={sizeStyle}
        decoding="async"
      />
    );
  }

  if (theme === 'dark') {
    return (
      <img
        src={ROUTE_LOGO_DARK_URL}
        alt="route"
        width={358}
        height={109}
        className={`shrink-0 ${className}`}
        style={sizeStyle}
        decoding="async"
      />
    );
  }

  return (
    <span
      role="img"
      aria-label="route"
      className={`relative inline-flex shrink-0 items-center ${className}`}
      style={sizeStyle}
    >
      <img
        src={ROUTE_LOGO_LIGHT_URL}
        alt=""
        aria-hidden
        width={358}
        height={109}
        className="route-logo route-logo--light h-full w-auto max-w-none"
        decoding="async"
      />
      <img
        src={ROUTE_LOGO_DARK_URL}
        alt=""
        aria-hidden
        width={358}
        height={109}
        className="route-logo route-logo--dark h-full w-auto max-w-none"
        decoding="async"
      />
    </span>
  );
}
