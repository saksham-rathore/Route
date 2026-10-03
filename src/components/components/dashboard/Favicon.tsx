"use client";

import { useEffect, useMemo, useState } from "react";

export interface FaviconProps {
    domain: string;
    size?: number;
    className?: string;
}

function normalizeDomain(domain: string) {
    const trimmed = domain.trim().replace(/^["']|["']$/g, "");
    if (!trimmed) return null;

    try {
        const urlValue = trimmed.startsWith("//")
            ? `https:${trimmed}`
            : trimmed.startsWith("http://") || trimmed.startsWith("https://")
              ? trimmed
              : `https://${trimmed}`;

        return new URL(
            urlValue
        ).hostname.replace(/^www\./i, "");
    } catch {
        const fallback = trimmed
            .replace(/^https?:\/\//i, "")
            .replace(/^\/\//, "")
            .replace(/\/.*$/, "")
            .replace(/:\d+$/, "")
            .replace(/^www\./i, "")
            .trim();

        return fallback || null;
    }
}

function getDomainCandidates(host: string) {
    const cleanHost = host.toLowerCase();
    const labels = cleanHost.split(".").filter(Boolean);
    const domains = [cleanHost];

    for (let index = 1; index < labels.length - 1; index += 1) {
        domains.push(labels.slice(index).join("."));
    }

    return Array.from(new Set(domains));
}

function getFaviconSources(host: string) {
    const domains = getDomainCandidates(host);
    return [
        ...domains.map((domain) => `https://${domain}/favicon.ico`),
        ...domains.map((domain) => `https://${domain}/favicon.svg`),
        ...domains.map((domain) => `https://${domain}/apple-touch-icon.png`),
        ...domains.map((domain) => `https://icons.duckduckgo.com/ip3/${domain}.ico`),
        ...domains.map(
            (domain) =>
                `https://www.google.com/s2/favicons?domain_url=https://${encodeURIComponent(
                    domain
                )}&sz=64`
        ),
        ...domains.map(
            (domain) =>
                `https://www.google.com/s2/favicons?domain=${encodeURIComponent(
                    domain
                )}&sz=64`
        ),
    ];
}

export function Favicon({
    domain,
    size = 16,
    className,
}: FaviconProps) {
    const host = useMemo(() => normalizeDomain(domain), [domain]);
    const sources = useMemo(() => (host ? getFaviconSources(host) : []), [host]);
    const [sourceIndex, setSourceIndex] = useState(0);

    useEffect(() => {
        setSourceIndex(0);
    }, [host, size, sources.length]);

    if (!host || sourceIndex >= sources.length) {
        return null;
    }

    return (
        <img
            src={sources[sourceIndex]}
            alt=""
            aria-hidden="true"
            width={size}
            height={size}
            className={`object-contain ${className ?? ""}`}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={() => setSourceIndex((index) => index + 1)}
        />
    );
}
