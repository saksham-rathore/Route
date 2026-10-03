"use client";

import { Favicon } from "./Favicon";

interface DomainFaviconProps {
    domain: string | null | undefined;
    className?: string;
    size?: number;
}

export function DomainFavicon({
    domain,
    className,
    size = 16,
}: DomainFaviconProps) {
    if (!domain) {
        return null;
    }

    return (
        <Favicon
            domain={domain}
            size={size}
            className={className}
        />
    );
}
