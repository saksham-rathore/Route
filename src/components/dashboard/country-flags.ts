const COUNTRY_NAME_TO_CODE: Record<string, string> = {
    argentina: "AR",
    australia: "AU",
    austria: "AT",
    bangladesh: "BD",
    belgium: "BE",
    brazil: "BR",
    bulgaria: "BG",
    canada: "CA",
    chile: "CL",
    china: "CN",
    colombia: "CO",
    croatia: "HR",
    czechia: "CZ",
    "czech republic": "CZ",
    denmark: "DK",
    egypt: "EG",
    estonia: "EE",
    finland: "FI",
    france: "FR",
    germany: "DE",
    greece: "GR",
    "hong kong": "HK",
    hungary: "HU",
    india: "IN",
    indonesia: "ID",
    ireland: "IE",
    israel: "IL",
    italy: "IT",
    japan: "JP",
    kenya: "KE",
    malaysia: "MY",
    mexico: "MX",
    netherlands: "NL",
    "new zealand": "NZ",
    nigeria: "NG",
    norway: "NO",
    pakistan: "PK",
    peru: "PE",
    philippines: "PH",
    poland: "PL",
    portugal: "PT",
    romania: "RO",
    russia: "RU",
    "saudi arabia": "SA",
    singapore: "SG",
    "south africa": "ZA",
    "south korea": "KR",
    korea: "KR",
    spain: "ES",
    sweden: "SE",
    switzerland: "CH",
    taiwan: "TW",
    thailand: "TH",
    turkey: "TR",
    ukraine: "UA",
    "united arab emirates": "AE",
    uk: "GB",
    "united kingdom": "GB",
    "great britain": "GB",
    us: "US",
    usa: "US",
    "united states": "US",
    "united states of america": "US",
    vietnam: "VN",
};

/** Short labels for long country names in tight UI (stat cards, etc.). */
const COUNTRY_NAME_TO_COMPACT: Record<string, string> = {
    "united states": "US",
    "united states of america": "US",
    "united kingdom": "UK",
    "great britain": "UK",
    "united arab emirates": "UAE",
    "south korea": "KR",
    "north korea": "KP",
    "south africa": "ZA",
    "new zealand": "NZ",
    "saudi arabia": "SA",
    "hong kong": "HK",
    "czech republic": "CZ",
    "dominican republic": "DO",
    "costa rica": "CR",
    "puerto rico": "PR",
    "sri lanka": "LK",
};

const COUNTRY_CODE_TO_COMPACT: Record<string, string> = {
    US: "US",
    GB: "UK",
    AE: "UAE",
};

export function normalizeCountryDisplayName(value: string | null | undefined) {
    if (!value) return "-";
    const trimmed = value.trim();
    if (!trimmed) return "-";

    const prefixedMatch = trimmed.match(/^([A-Za-z]{2})\s+(.+)$/);
    if (prefixedMatch) {
        return prefixedMatch[2].trim();
    }

    return trimmed;
}

/** Compact label for stat cards; full name stays available via tooltip. */
export function getCountryCompactDisplayName(value: string | null | undefined) {
    const fullName = normalizeCountryDisplayName(value);
    if (!fullName || fullName === "-") return fullName;

    const normalized = fullName.toLowerCase().replace(/\s+/g, " ");
    if (COUNTRY_NAME_TO_COMPACT[normalized]) {
        return COUNTRY_NAME_TO_COMPACT[normalized];
    }

    const code = resolveCountryCode(value);
    if (code) {
        if (COUNTRY_CODE_TO_COMPACT[code]) {
            return COUNTRY_CODE_TO_COMPACT[code];
        }
        if (/\s/.test(fullName) && fullName.length > 12) {
            return code;
        }
    }

    return fullName;
}

export function resolveCountryCode(value: string | null | undefined) {
    if (!value) return null;
    const trimmed = value.trim();
    if (!trimmed || trimmed.toLowerCase() === "unknown") return null;
    if (/^[a-z]{2}$/i.test(trimmed)) return trimmed.toUpperCase();

    const prefixedMatch = trimmed.match(/^([A-Za-z]{2})\s+(.+)$/);
    if (prefixedMatch) {
        return prefixedMatch[1].toUpperCase();
    }

    const normalized = trimmed
        .toLowerCase()
        .replace(/[.'()]/g, "")
        .replace(/\s+/g, " ");

    return COUNTRY_NAME_TO_CODE[normalized] ?? null;
}

export function countryCodeToFlagEmoji(code: string) {
    return code
        .toUpperCase()
        .replace(/./g, (char) =>
            String.fromCodePoint(127397 + char.charCodeAt(0))
        );
}

export function getCountryFlagEmoji(value: string | null | undefined) {
    const code = resolveCountryCode(value);
    return code ? countryCodeToFlagEmoji(code) : "-";
}

export function getCountryCodeDisplay(value: string | null | undefined) {
    return resolveCountryCode(value) ?? "-";
}

export function getCountryFlagSrc(value: string | null | undefined) {
    const code = resolveCountryCode(value);
    return code ? `https://flagcdn.com/${code.toLowerCase()}.svg` : null;
}

export function getCountryName(value: string | null | undefined) {
    const code = resolveCountryCode(value);
    if (!code) return normalizeCountryDisplayName(value);
    
    try {
        const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
        return regionNames.of(code) || normalizeCountryDisplayName(value);
    } catch (e) {
        return normalizeCountryDisplayName(value);
    }
}
