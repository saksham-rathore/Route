import React from 'react'

const Svg3 = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 367 282"
      width="734"
      height="564"
      role="img"
      aria-label="Fast enough to stay out of the way. Route collects useful analytics without turning your website into a heavy tracking system."
      {...props}
    >
      <title>Lightweight analytics card</title>
      <defs>
        <clipPath id="card">
          <rect x="18" y="10" width="342" height="252" rx="30" />
        </clipPath>
        <linearGradient id="chip" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#b6f56e" />
          <stop offset="1" stopColor="#97e84f" />
        </linearGradient>
        <linearGradient id="bolt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff9a3c" />
          <stop offset="1" stopColor="#f0553a" />
        </linearGradient>
        <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset=".5" stopColor="#fff" stopOpacity=".55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <style>{`
        text{font-family:"Segoe UI",system-ui,-apple-system,Inter,Roboto,sans-serif}
        .in{opacity:0;animation:rise .7s cubic-bezier(.2,.7,.2,1) forwards}
        .d1{animation-delay:.15s}.d2{animation-delay:.35s}.d3{animation-delay:.5s}
        .d4{animation-delay:.7s}.d5{animation-delay:.85s}.d6{animation-delay:1s}
        @keyframes rise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .chip{transform-origin:67px 59px;animation:pop .6s cubic-bezier(.3,1.5,.5,1) both}
        @keyframes pop{from{opacity:0;transform:scale(.4)}to{opacity:1;transform:scale(1)}}
        .bolt{transform-origin:67px 59px;animation:zap 2.6s ease-in-out 1s infinite}
        @keyframes zap{0%,60%,100%{transform:scale(1);opacity:1}66%{transform:scale(1.18);opacity:1}70%{transform:scale(.95);opacity:.75}76%{transform:scale(1.1);opacity:1}84%{transform:scale(1)}}
        .halo{transform-origin:67px 59px;animation:halo 2.6s ease-out 1s infinite}
        @keyframes halo{0%,60%{opacity:0;transform:scale(.9)}66%{opacity:.55}100%{opacity:0;transform:scale(1.9)}}
        .streak{opacity:0;animation:streak 2.6s ease-out 1s infinite}
        @keyframes streak{0%,62%{opacity:0;transform:translateX(0)}70%{opacity:.8}100%{opacity:0;transform:translateX(-16px)}}
        .sheen{animation:sweep 5.5s ease-in-out 1.6s infinite}
        @keyframes sweep{0%{transform:translateX(-120px) skewX(-18deg)}35%,100%{transform:translateX(480px) skewX(-18deg)}}
        .dot{animation:blink 1.8s ease-in-out infinite}
        @keyframes blink{0%,100%{opacity:.35}50%{opacity:1}}
        @media (prefers-reduced-motion:reduce){*{animation:none!important;opacity:1!important}.halo,.streak,.sheen{opacity:0!important}}
      `}</style>

      <rect width="367" height="282" fill="#f5f2ec" />
      <rect x="18" y="10" width="342" height="252" rx="30" fill="#effedb" stroke="#e1f3c6" strokeWidth="1.5" />

      <g clipPath="url(#card)">
        <rect className="sheen" x="0" y="0" width="70" height="282" fill="url(#sheen)" />
      </g>

      {/* icon chip */}
      <circle className="halo" cx="67" cy="59" r="17" fill="none" stroke="#7fd32f" strokeWidth="2" />
      <g stroke="#7fd32f" strokeWidth="2" strokeLinecap="round">
        <line className="streak" x1="46" y1="52" x2="38" y2="52" />
        <line className="streak" style={{ animationDelay: "1.08s" }} x1="46" y1="59" x2="34" y2="59" />
        <line className="streak" style={{ animationDelay: "1.16s" }} x1="46" y1="66" x2="39" y2="66" />
      </g>
      <g className="chip">
        <rect x="52" y="44" width="30" height="30" rx="9" fill="url(#chip)" />
        <path className="bolt" d="M69.5 49.5 L61.5 60.5 H66.2 L64.6 68.8 L72.8 57.4 H68 Z" fill="url(#bolt)" stroke="#f0553a" strokeWidth=".8" strokeLinejoin="round" />
      </g>

      {/* label */}
      <g className="in d1">
        <text x="92" y="64" fontSize="11.5" fontWeight="600" fill="#58693f">lightweight analytics</text>
      </g>
      <circle className="dot" cx="212" cy="60.5" r="2.4" fill="#6cc22a" />

      {/* heading */}
      <g className="in d2">
        <text x="189" y="118" textAnchor="middle" fontSize="27" fontWeight="600" fill="#4b7a17" letterSpacing="-.4">Fast enough to</text>
      </g>
      <g className="in d3">
        <text x="189" y="150" textAnchor="middle" fontSize="27" fontWeight="600" fill="#4b7a17" letterSpacing="-.4">stay out of the way.</text>
      </g>

      {/* body */}
      <g className="in d4">
        <text x="189" y="182" textAnchor="middle" fontSize="14.5" fill="#6c6c60">Route collects useful analytics without</text>
      </g>
      <g className="in d5">
        <text x="189" y="203" textAnchor="middle" fontSize="14.5" fill="#6c6c60">turning your website into a heavy</text>
      </g>
      <g className="in d6">
        <text x="189" y="224" textAnchor="middle" fontSize="14.5" fill="#6c6c60">tracking system.</text>
      </g>
    </svg>
  )
}

export default Svg3