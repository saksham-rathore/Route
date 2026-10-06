import React from 'react'

const Svg3 = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 350 160"
      className="w-full h-auto"
      role="img"
      aria-label="Fast enough to feel playful. Generate, react, refine, and ship while your idea still feels exciting."
      {...props}
    >
      <title>Fast enough to stay out of the way.</title>
      <defs>
        <linearGradient id="starBox" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#96ee3d" />
          <stop offset="100%" stopColor="#82e729" />
        </linearGradient>
        <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="50%" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <style>{`
        text { font-family: "Instrument Sans", system-ui, -apple-system, Inter, Roboto, sans-serif; }
        .in { opacity: 0; animation: rise .65s cubic-bezier(.2, .7, .2, 1) forwards; }
        .d1 { animation-delay: .1s; }
        .d2 { animation-delay: .25s; }
        .d3 { animation-delay: .4s; }
        .d4 { animation-delay: .55s; }
        @keyframes rise {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .chip { transform-origin: 14px 14px; animation: pop .5s cubic-bezier(.34, 1.56, .64, 1) both; }
        @keyframes pop {
          from { opacity: 0; transform: scale(.4); }
          to { opacity: 1; transform: scale(1); }
        }
        .star-icon { transform-origin: 14px 14px; animation: twinkle 3s ease-in-out infinite; }
        @keyframes twinkle {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.12); }
        }
        .sheen { animation: sweep 6s ease-in-out 1.2s infinite; }
        @keyframes sweep {
          0% { transform: translateX(-150px) skewX(-18deg); }
          35%, 100% { transform: translateX(500px) skewX(-18deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; opacity: 1 !important; }
          .sheen { display: none !important; }
        }
      `}</style>

      {/* Sweep sheen effect */}
      <rect className="sheen" x="0" y="0" width="80" height="160" fill="url(#sheen)" pointerEvents="none" />

      {/* Top Badge: Star Chip & Text */}
      <g className="chip">
        <rect x="0" y="0" width="28" height="28" rx="8" fill="url(#starBox)" />
        <path
          className="star-icon"
          d="M14 6.8 L15.9 10.7 L20.2 11.3 L17.1 14.3 L17.8 18.6 L14 16.6 L10.2 18.6 L10.9 14.3 L7.8 11.3 L12.1 10.7 Z"
          fill="#111812"
        />
      </g>
      <g className="in d1">
        <text x="38" y="19" fontSize="13.5" fontWeight="500" fill="#2d4715">
          buttery workflow
        </text>
      </g>

      {/* Heading */}
      <g className="in d2">
        <text
          x="0"
          y="68"
          fontSize="26"
          fontWeight="600"
          fill="#2e6e14"
          letterSpacing="-0.4"
        >
          Fast enough to stay.
        </text>
      </g>

      {/* Subtitle / Description */}
      <g className="in d3">
        <text x="0" y="106" fontSize="15" fill="#4d5e40">
          Route collects useful analytics without turning your
        </text>
      </g>
      <g className="in d4">
        <text x="0" y="128" fontSize="15" fill="#4d5e40">
          website into a heavy tracking system.
        </text>
      </g>
    </svg>
  )
}

export default Svg3