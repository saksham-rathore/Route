import React from "react";

const Svg1 = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 420 250"
      width="420"
      height="250"
      role="img"
      aria-label="Route analytics: requests, errors, latency, regions and devices flowing into a central route hub"
      {...props}
    >
      <title>Route analytics hub</title>
      <defs>
        <filter id="shadow" x="-30%" y="-40%" width="160%" height="200%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#7c2d12" floodOpacity="0.13" />
        </filter>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#ea580c" floodOpacity="0.35" />
        </filter>
        <linearGradient id="hex" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff8f66" />
          <stop offset="1" stopColor="#f06a3c" />
        </linearGradient>
      </defs>
      <style>{`
        .flow{stroke:#f08a66;stroke-width:1.8;stroke-linecap:round;stroke-dasharray:1.6 6;fill:none;animation:dash 1.4s linear infinite}
        .flow.rev{animation-direction:reverse}
        .float{animation:float 4.2s ease-in-out infinite}
        .label{font:600 12.5px ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;fill:#1c1917}
        .hex{transform-origin:210px 102px;animation:breathe 3.2s ease-in-out infinite}
        .plus{animation:twinkle 2.8s ease-in-out infinite}
        .dot{animation:twinkle 3.6s ease-in-out infinite}
        @keyframes dash{to{stroke-dashoffset:-15.2}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-3.5px)}}
        @keyframes breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
        @keyframes twinkle{0%,100%{opacity:.25}50%{opacity:.7}}
        @media (prefers-reduced-motion:reduce){*{animation:none!important}}
      `}</style>

      <g fill="#c64e27">
        <circle className="dot" style={{ animationDelay: "0.00s" }} cx="14" cy="200" r="1.3" opacity=".2" />
        <circle className="dot" style={{ animationDelay: "0.25s" }} cx="14" cy="207" r="1.3" opacity=".2" />
        <circle className="dot" style={{ animationDelay: "0.50s" }} cx="14" cy="214" r="1.3" opacity=".2" />
        <circle className="dot" style={{ animationDelay: "0.75s" }} cx="14" cy="221" r="1.3" opacity=".2" />
        <circle className="dot" style={{ animationDelay: "0.25s" }} cx="21" cy="200" r="1.3" opacity=".2" />
        <circle className="dot" style={{ animationDelay: "0.50s" }} cx="21" cy="207" r="1.3" opacity=".2" />
        <circle className="dot" style={{ animationDelay: "0.75s" }} cx="21" cy="214" r="1.3" opacity=".2" />
        <circle className="dot" style={{ animationDelay: "1.00s" }} cx="21" cy="221" r="1.3" opacity=".2" />
        <circle className="dot" style={{ animationDelay: "0.50s" }} cx="28" cy="200" r="1.3" opacity=".2" />
        <circle className="dot" style={{ animationDelay: "0.75s" }} cx="28" cy="207" r="1.3" opacity=".2" />
        <circle className="dot" style={{ animationDelay: "1.00s" }} cx="28" cy="214" r="1.3" opacity=".2" />
        <circle className="dot" style={{ animationDelay: "1.25s" }} cx="28" cy="221" r="1.3" opacity=".2" />
        <circle className="dot" style={{ animationDelay: "0.75s" }} cx="35" cy="200" r="1.3" opacity=".2" />
        <circle className="dot" style={{ animationDelay: "1.00s" }} cx="35" cy="207" r="1.3" opacity=".2" />
        <circle className="dot" style={{ animationDelay: "1.25s" }} cx="35" cy="214" r="1.3" opacity=".2" />
        <circle className="dot" style={{ animationDelay: "1.50s" }} cx="35" cy="221" r="1.3" opacity=".2" />
        <circle className="dot" style={{ animationDelay: "1.00s" }} cx="42" cy="200" r="1.3" opacity=".2" />
        <circle className="dot" style={{ animationDelay: "1.25s" }} cx="42" cy="207" r="1.3" opacity=".2" />
        <circle className="dot" style={{ animationDelay: "1.50s" }} cx="42" cy="214" r="1.3" opacity=".2" />
        <circle className="dot" style={{ animationDelay: "1.75s" }} cx="42" cy="221" r="1.3" opacity=".2" />
      </g>
      <g className="plus" stroke="#e11d48" strokeWidth="1.6" strokeLinecap="round">
        <line x1="368" y1="206" x2="368" y2="216" />
        <line x1="363" y1="211" x2="373" y2="211" />
      </g>
      <circle cx="210" cy="102" r="26" fill="none" stroke="#ff7d54" strokeWidth="1.5">
        <animate attributeName="r" values="26;62" dur="3.2s" begin="0s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.55;0" dur="3.2s" begin="0s" repeatCount="indefinite" />
      </circle>
      <circle cx="210" cy="102" r="26" fill="none" stroke="#ff7d54" strokeWidth="1.5">
        <animate attributeName="r" values="26;62" dur="3.2s" begin="1.6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.55;0" dur="3.2s" begin="1.6s" repeatCount="indefinite" />
      </circle>
      <path id="p0" className="flow" d="M92,38 L210,102" />
      <path id="p1" className="flow" d="M328,38 L210,102" />
      <path id="p2" className="flow" d="M78,138 L210,102" />
      <path id="p3" className="flow" d="M344,138 L210,102" />
      <path id="p4" className="flow" d="M210,214 L210,102" />
      <circle r="3" fill="#ea580c">
        <animateMotion dur="2.6s" begin="0.0s" repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="linear">
          <mpath href="#p0" />
        </animateMotion>
        <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.15;.85;1" dur="2.6s" begin="0.0s" repeatCount="indefinite" />
      </circle>
      <circle r="3" fill="#e11d48">
        <animateMotion dur="2.8s" begin="0.5s" repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="linear">
          <mpath href="#p1" />
        </animateMotion>
        <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.15;.85;1" dur="2.8s" begin="0.5s" repeatCount="indefinite" />
      </circle>
      <circle r="3" fill="#2563eb">
        <animateMotion dur="3.0s" begin="1.0s" repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="linear">
          <mpath href="#p2" />
        </animateMotion>
        <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.15;.85;1" dur="3.0s" begin="1.0s" repeatCount="indefinite" />
      </circle>
      <circle r="3" fill="#7c3aed">
        <animateMotion dur="3.2s" begin="1.5s" repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="linear">
          <mpath href="#p3" />
        </animateMotion>
        <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.15;.85;1" dur="3.2s" begin="1.5s" repeatCount="indefinite" />
      </circle>
      <circle r="3" fill="#0d9488">
        <animateMotion dur="3.4s" begin="2.0s" repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="linear">
          <mpath href="#p4" />
        </animateMotion>
        <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.15;.85;1" dur="3.4s" begin="2.0s" repeatCount="indefinite" />
      </circle>
      <g className="hex" filter="url(#glow)">
        <polygon
          points="235.0,102.0 222.5,123.7 197.5,123.7 185.0,102.0 197.5,80.3 222.5,80.3"
          fill="url(#hex)"
          stroke="url(#hex)"
          strokeWidth="10"
          strokeLinejoin="round"
        />
        <g transform="translate(198,90)" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="6" cy="19" r="3" />
          <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
          <circle cx="18" cy="5" r="3" />
        </g>
      </g>
      <g transform="translate(92,38)">
        <g className="float" style={{ animationDelay: "0.0s" }}>
          <rect x="-54.0" y="-19" width="108" height="38" rx="11" fill="#fff" filter="url(#shadow)" />
          <rect x="-45.0" y="-11" width="22" height="22" rx="7" fill="#ffedd5" />
          <g transform="translate(-40.5,-6.5) scale(.5)" fill="none" stroke="#ea580c" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </g>
          <text className="label" x="-16.0" y="4.5">Requests</text>
        </g>
      </g>
      <g transform="translate(328,38)">
        <g className="float" style={{ animationDelay: "-0.8s" }}>
          <rect x="-46.0" y="-19" width="92" height="38" rx="11" fill="#fff" filter="url(#shadow)" />
          <rect x="-37.0" y="-11" width="22" height="22" rx="7" fill="#ffe4e6" />
          <g transform="translate(-32.5,-6.5) scale(.5)" fill="none" stroke="#e11d48" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </g>
          <text className="label" x="-8.0" y="4.5">Errors</text>
        </g>
      </g>
      <g transform="translate(78,138)">
        <g className="float" style={{ animationDelay: "-1.6s" }}>
          <rect x="-50.0" y="-19" width="100" height="38" rx="11" fill="#fff" filter="url(#shadow)" />
          <rect x="-41.0" y="-11" width="22" height="22" rx="7" fill="#dbeafe" />
          <g transform="translate(-36.5,-6.5) scale(.5)" fill="none" stroke="#2563eb" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </g>
          <text className="label" x="-12.0" y="4.5">Latency</text>
        </g>
      </g>
      <g transform="translate(344,138)">
        <g className="float" style={{ animationDelay: "-2.4s" }}>
          <rect x="-52.0" y="-19" width="104" height="38" rx="11" fill="#fff" filter="url(#shadow)" />
          <rect x="-43.0" y="-11" width="22" height="22" rx="7" fill="#ede9fe" />
          <g transform="translate(-38.5,-6.5) scale(.5)" fill="none" stroke="#7c3aed" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </g>
          <text className="label" x="-14.0" y="4.5">Regions</text>
        </g>
      </g>
      <g transform="translate(210,214)">
        <g className="float" style={{ animationDelay: "-3.2s" }}>
          <rect x="-52.0" y="-19" width="104" height="38" rx="11" fill="#fff" filter="url(#shadow)" />
          <rect x="-43.0" y="-11" width="22" height="22" rx="7" fill="#ccfbf1" />
          <g transform="translate(-38.5,-6.5) scale(.5)" fill="none" stroke="#0d9488" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="2" width="14" height="20" rx="2" />
            <line x1="12" y1="18" x2="12.01" y2="18" />
          </g>
          <text className="label" x="-14.0" y="4.5">Devices</text>
        </g>
      </g>
    </svg>
  );
};

export default Svg1;