import React from 'react'

const Svg2 = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 200"
      width="400"
      height="200"
      role="img"
      aria-label="Route analytics: routes, latency, errors and traffic feed into one live dashboard"
      {...props}
    >
      <title>Route analytics pipeline</title>
      <defs>
        <filter id="soft" x="-20%" y="-30%" width="140%" height="190%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#5b2fc4" floodOpacity="0.10" />
        </filter>
        <filter id="cardShadow" x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#5b2fc4" floodOpacity="0.13" />
        </filter>
        <linearGradient id="topFace" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#9b73fb" />
          <stop offset="1" stopColor="#6f3df0" />
        </linearGradient>
      </defs>
      <style>{`
        .flow{fill:none;stroke:#7b45f2;stroke-width:1.6;stroke-linecap:round;stroke-dasharray:0.1 6;animation:dash 1.2s linear infinite}
        .t{font-family:system-ui,-apple-system,Inter,'Segoe UI',sans-serif;font-weight:700;fill:#17152a}
        .bob{animation:bob 3.4s ease-in-out infinite}
        .tw{animation:tw 2.4s ease-in-out infinite}
        @keyframes dash{to{stroke-dashoffset:-12.2}}
        @keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(var(--a,-4px))}}
        @keyframes tw{0%,100%{opacity:.15}50%{opacity:.9}}
        @media (prefers-reduced-motion:reduce){*{animation:none!important}}
      `}</style>

      <g fill="#7b45f2">
        <circle className="tw" style={{ animationDelay: "0.0s" }} cx="338" cy="182" r="1.3" opacity=".28" />
        <circle className="tw" style={{ animationDelay: "0.2s" }} cx="338" cy="189" r="1.3" opacity=".28" />
        <circle className="tw" style={{ animationDelay: "0.4s" }} cx="338" cy="196" r="1.3" opacity=".28" />
        <circle className="tw" style={{ animationDelay: "0.2s" }} cx="347" cy="182" r="1.3" opacity=".28" />
        <circle className="tw" style={{ animationDelay: "0.4s" }} cx="347" cy="189" r="1.3" opacity=".28" />
        <circle className="tw" style={{ animationDelay: "0.6s" }} cx="347" cy="196" r="1.3" opacity=".28" />
        <circle className="tw" style={{ animationDelay: "0.4s" }} cx="356" cy="182" r="1.3" opacity=".28" />
        <circle className="tw" style={{ animationDelay: "0.6s" }} cx="356" cy="189" r="1.3" opacity=".28" />
        <circle className="tw" style={{ animationDelay: "0.8s" }} cx="356" cy="196" r="1.3" opacity=".28" />
        <circle className="tw" style={{ animationDelay: "0.6s" }} cx="365" cy="182" r="1.3" opacity=".28" />
        <circle className="tw" style={{ animationDelay: "0.8s" }} cx="365" cy="189" r="1.3" opacity=".28" />
        <circle className="tw" style={{ animationDelay: "1.0s" }} cx="365" cy="196" r="1.3" opacity=".28" />
        <circle className="tw" style={{ animationDelay: "0.8s" }} cx="374" cy="182" r="1.3" opacity=".28" />
        <circle className="tw" style={{ animationDelay: "1.0s" }} cx="374" cy="189" r="1.3" opacity=".28" />
        <circle className="tw" style={{ animationDelay: "1.2s" }} cx="374" cy="196" r="1.3" opacity=".28" />
        <circle className="tw" style={{ animationDelay: "1.0s" }} cx="383" cy="182" r="1.3" opacity=".28" />
        <circle className="tw" style={{ animationDelay: "1.2s" }} cx="383" cy="189" r="1.3" opacity=".28" />
        <circle className="tw" style={{ animationDelay: "1.4s" }} cx="383" cy="196" r="1.3" opacity=".28" />
      </g>
      <g stroke="#7b45f2" strokeWidth="1.6" strokeLinecap="round" fill="none">
        <line className="tw" x1="374" y1="8" x2="377" y2="1" />
        <line className="tw" style={{ animationDelay: "0.4s" }} x1="382" y1="11" x2="388" y2="6" />
        <line className="tw" style={{ animationDelay: "0.8s" }} x1="390" y1="19" x2="398" y2="17" />
      </g>
      <path className="flow" d="M134 26 L194 26" />
      <path className="flow" d="M134 70 L194 70" />
      <path className="flow" d="M134 114 L194 114" />
      <path className="flow" d="M134 158 L194 158" />
      <path className="flow" d="M194 26 L194 92" />
      <path className="flow" d="M194 158 L194 92" />
      <path className="flow" d="M194 92 L226 92" />
      <path id="r0" d="M134 26 L194 26 L194 92 L226 92" fill="none" stroke="none" />
      <circle r="3" fill="#7b45f2">
        <animateMotion dur="2.4s" begin="0.0s" repeatCount="indefinite" calcMode="linear">
          <mpath href="#r0" />
        </animateMotion>
        <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.12;.85;1" dur="2.4s" begin="0.0s" repeatCount="indefinite" />
      </circle>
      <path id="r1" d="M134 70 L194 70 L194 92 L226 92" fill="none" stroke="none" />
      <circle r="3" fill="#7b45f2">
        <animateMotion dur="2.4s" begin="0.6s" repeatCount="indefinite" calcMode="linear">
          <mpath href="#r1" />
        </animateMotion>
        <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.12;.85;1" dur="2.4s" begin="0.6s" repeatCount="indefinite" />
      </circle>
      <path id="r2" d="M134 114 L194 114 L194 92 L226 92" fill="none" stroke="none" />
      <circle r="3" fill="#7b45f2">
        <animateMotion dur="2.4s" begin="1.2s" repeatCount="indefinite" calcMode="linear">
          <mpath href="#r2" />
        </animateMotion>
        <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.12;.85;1" dur="2.4s" begin="1.2s" repeatCount="indefinite" />
      </circle>
      <path id="r3" d="M134 158 L194 158 L194 92 L226 92" fill="none" stroke="none" />
      <circle r="3" fill="#7b45f2">
        <animateMotion dur="2.4s" begin="1.8s" repeatCount="indefinite" calcMode="linear">
          <mpath href="#r3" />
        </animateMotion>
        <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.12;.85;1" dur="2.4s" begin="1.8s" repeatCount="indefinite" />
      </circle>
      <circle cx="194" cy="92" r="4" fill="none" stroke="#a98bf5" strokeWidth="1.5">
        <animate attributeName="r" values="4;13" dur="2.4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values=".7;0" dur="2.4s" repeatCount="indefinite" />
      </circle>
      <circle cx="194" cy="92" r="3.8" fill="#a98bf5" />
      <circle cx="194" cy="92" r="3.1" fill="none" stroke="#f2eeff" opacity=".8" />
      <circle cx="194" cy="92" r="1.3" fill="#d8ccfb" />
      <g>
        <rect x="6" y="8" width="128" height="36" rx="13" fill="#fff" filter="url(#soft)" />
        <rect x="6" y="8" width="128" height="36" rx="13" fill="none" stroke="#7b45f2" strokeWidth="1.5" opacity="0">
          <animate attributeName="opacity" values="0;.9;0;0" keyTimes="0;.1;.4;1" dur="2.4s" begin="0.0s" repeatCount="indefinite" />
        </rect>
        <circle cx="26" cy="26" r="12" fill="#a98bf5" />
        <g transform="translate(18.8,18.8) scale(.6)" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="6" cy="19" r="3" />
          <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
          <circle cx="18" cy="5" r="3" />
        </g>
        <text className="t" x="48" y="30.5" fontSize="13">Routes</text>
      </g>
      <g>
        <rect x="6" y="52" width="128" height="36" rx="13" fill="#fff" filter="url(#soft)" />
        <rect x="6" y="52" width="128" height="36" rx="13" fill="none" stroke="#7b45f2" strokeWidth="1.5" opacity="0">
          <animate attributeName="opacity" values="0;.9;0;0" keyTimes="0;.1;.4;1" dur="2.4s" begin="0.6s" repeatCount="indefinite" />
        </rect>
        <circle cx="20" cy="70" r="5" fill="#34c759">
          <animate attributeName="r" values="5;6;5" dur="2.4s" begin="0.0s" repeatCount="indefinite" />
        </circle>
        <circle cx="33" cy="70" r="5" fill="#ffb020">
          <animate attributeName="r" values="5;6;5" dur="2.4s" begin="0.3s" repeatCount="indefinite" />
        </circle>
        <circle cx="46" cy="70" r="5" fill="#ff4d5e">
          <animate attributeName="r" values="5;6;5" dur="2.4s" begin="0.6s" repeatCount="indefinite" />
        </circle>
        <text className="t" x="62" y="74.5" fontSize="13">Latency</text>
      </g>
      <g>
        <rect x="6" y="96" width="128" height="36" rx="13" fill="#fff" filter="url(#soft)" />
        <rect x="6" y="96" width="128" height="36" rx="13" fill="none" stroke="#7b45f2" strokeWidth="1.5" opacity="0">
          <animate attributeName="opacity" values="0;.9;0;0" keyTimes="0;.1;.4;1" dur="2.4s" begin="1.2s" repeatCount="indefinite" />
        </rect>
        <text x="13" y="120" style={{ font: "900 16px system-ui,-apple-system,Inter,'Segoe UI',sans-serif" }} fill="#a98bf5">5xx</text>
        <text className="t" x="48" y="118.5" fontSize="13">Errors</text>
      </g>
      <g>
        <rect x="6" y="140" width="128" height="36" rx="13" fill="#fff" filter="url(#soft)" />
        <rect x="6" y="140" width="128" height="36" rx="13" fill="none" stroke="#7b45f2" strokeWidth="1.5" opacity="0">
          <animate attributeName="opacity" values="0;.9;0;0" keyTimes="0;.1;.4;1" dur="2.4s" begin="1.8s" repeatCount="indefinite" />
        </rect>
        <rect x="15" y="148" width="24" height="20" rx="4" fill="#ede3fc" />
        <rect x="19.0" y="156" width="4" height="8" rx="1.5" fill="#a98bf5">
          <animate attributeName="height" values="8;12;8" dur="1.8s" begin="0s" repeatCount="indefinite" />
          <animate attributeName="y" values="156;152;156" dur="1.8s" begin="0s" repeatCount="indefinite" />
        </rect>
        <rect x="25.5" y="151" width="4" height="13" rx="1.5" fill="#a98bf5">
          <animate attributeName="height" values="13;17;13" dur="1.8s" begin="0.3s" repeatCount="indefinite" />
          <animate attributeName="y" values="151;147;151" dur="1.8s" begin="0.3s" repeatCount="indefinite" />
        </rect>
        <rect x="32.0" y="154" width="4" height="10" rx="1.5" fill="#a98bf5">
          <animate attributeName="height" values="10;14;10" dur="1.8s" begin="0.6s" repeatCount="indefinite" />
          <animate attributeName="y" values="154;150;154" dur="1.8s" begin="0.6s" repeatCount="indefinite" />
        </rect>
        <text className="t" x="48" y="162.5" fontSize="13">Traffic</text>
      </g>
      <g filter="url(#cardShadow)">
        <rect x="226" y="16" width="170" height="152" rx="14" fill="#fff" />
      </g>
      <circle cx="246" cy="36" r="8" fill="#a98bf5" />
      <text x="246" y="39.5" textAnchor="middle" style={{ font: "800 10px system-ui,-apple-system,Inter,'Segoe UI',sans-serif" }} fill="#fff">R</text>
      <text className="t" x="238" y="66" fontSize="12.5" fill="#1b1b4b">Every route,</text>
      <text className="t" x="238" y="81" fontSize="12.5" fill="#1b1b4b">measured.</text>
      <rect x="238" y="93" width="62" height="4" rx="2" fill="#e5e3ee">
        <animate attributeName="width" values="40;62;40" dur="3s" repeatCount="indefinite" />
      </rect>
      <rect x="238" y="102" width="46" height="4" rx="2" fill="#e5e3ee">
        <animate attributeName="width" values="46;28;46" dur="3.4s" repeatCount="indefinite" />
      </rect>
      <rect x="238" y="118" width="46" height="11" rx="5.5" fill="#6a3ae0" />
      <rect x="238" y="118" width="46" height="11" rx="5.5" fill="#fff" opacity="0">
        <animate attributeName="opacity" values="0;.25;0" dur="2.4s" repeatCount="indefinite" />
      </rect>
      <ellipse cx="352" cy="158" rx="40" ry="7" fill="#7b45f2" opacity=".12">
        <animate attributeName="rx" values="40;44;40" dur="3.4s" repeatCount="indefinite" />
      </ellipse>
      <g className="bob" style={{ ["--a" as any]: "0px" }}>
        <polygon points="318,134 352,151 352,160 318,143" fill="#ddd3f7" />
        <polygon points="386,134 352,151 352,160 386,143" fill="#e9e1fb" />
        <polygon points="352,117 386,134 352,151 318,134" fill="#f4f0ff" strokeLinejoin="round" />
      </g>
      <g className="bob" style={{ ["--a" as any]: "-2.5px", animationDelay: "0.15s" }}>
        <polygon points="318,122 352,139 352,148 318,131" fill="#c9ead3" />
        <polygon points="386,122 352,139 352,148 386,131" fill="#d8f1df" />
        <polygon points="352,105 386,122 352,139 318,122" fill="#e8f8ec" strokeLinejoin="round" />
      </g>
      <g className="bob" style={{ ["--a" as any]: "-5px", animationDelay: "0.3s" }}>
        <polygon points="318,108 352,125 352,134 318,117" fill="#6030d6" />
        <polygon points="386,108 352,125 352,134 386,117" fill="#4f25b8" />
        <polygon points="352,91 386,108 352,125 318,108" fill="url(#topFace)" strokeLinejoin="round" />
      </g>
    </svg>
  )
}

export default Svg2