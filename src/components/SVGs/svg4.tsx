import React from "react";

const Svg4 = ({
  className = "h-auto w-full",
  ...props
}: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 520 396"
      className={className}
      role="img"
      aria-label="From snippet to live insights"
      {...props}
    >
      <title>From snippet to live insights</title>
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f8ecff" />
          <stop offset="1" stopColor="#efe4ff" />
        </linearGradient>
        <linearGradient id="hd" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7a35ee" />
          <stop offset="1" stopColor="#a557ff" />
        </linearGradient>
        <linearGradient id="pm" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d3a0ff" />
          <stop offset="1" stopColor="#a460ee" />
        </linearGradient>
        <linearGradient id="ln" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#6d3ae8" />
          <stop offset="1" stopColor="#a45bff" />
        </linearGradient>
        <linearGradient id="ar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8b4dff" stopOpacity=".28" />
          <stop offset="1" stopColor="#8b4dff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset=".5" stopColor="#fff" stopOpacity=".7" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <filter id="sh" x="-10%" y="-10%" width="120%" height="135%">
          <feDropShadow
            dx="0"
            dy="5"
            stdDeviation="6"
            floodColor="#6d2fe8"
            floodOpacity=".16"
          />
        </filter>
        <clipPath id="cc">
          <rect x="1" y="1" width="518" height="394" rx="34" />
        </clipPath>
        <clipPath id="dc">
          <rect x="243" y="68" width="215" height="127" rx="9" />
        </clipPath>
      </defs>
      <style>{`
        text{font-family:Inter,'Segoe UI',system-ui,-apple-system,Roboto,sans-serif}
        .tw{animation:tw 2.4s ease-in-out infinite}
        @keyframes tw{0%,100%{opacity:.2}50%{opacity:1}}
        .bob{animation:bob 3.2s ease-in-out infinite}
        @keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
        .wave{transform-box:fill-box;transform-origin:100% 0%;animation:wave 1.6s ease-in-out infinite}
        @keyframes wave{0%,100%{transform:rotate(0)}50%{transform:rotate(-24deg)}}
        .blink{transform-box:fill-box;transform-origin:center;animation:blink 4s infinite}
        @keyframes blink{0%,92%,100%{transform:scaleY(1)}96%{transform:scaleY(.1)}}
        .caret{animation:caret 1s steps(1) infinite}
        @keyframes caret{50%{opacity:0}}
        .arrow{stroke-dasharray:1;stroke-dashoffset:1;animation:arrow 6s ease-in-out infinite}
        @keyframes arrow{0%{stroke-dashoffset:1;opacity:1}30%,85%{stroke-dashoffset:0;opacity:1}100%{stroke-dashoffset:0;opacity:0}}
        .head{opacity:0;animation:head 6s ease-in-out infinite}
        @keyframes head{0%,28%{opacity:0}34%,85%{opacity:1}100%{opacity:0}}
        .draw{stroke-dasharray:1;stroke-dashoffset:1;animation:draw 6s ease-in-out infinite}
        @keyframes draw{0%,20%{stroke-dashoffset:1;opacity:1}60%,88%{stroke-dashoffset:0;opacity:1}100%{stroke-dashoffset:0;opacity:0}}
        .area{opacity:0;animation:area 6s ease-in-out infinite}
        @keyframes area{0%,40%{opacity:0}62%,88%{opacity:1}100%{opacity:0}}
        .sweep{animation:sweep 5s ease-in-out infinite}
        @keyframes sweep{0%{transform:translateX(-80px) skewX(-18deg)}40%,100%{transform:translateX(320px) skewX(-18deg)}}
        .ring{transform-box:fill-box;transform-origin:center;animation:ring 1.8s ease-out infinite}
        @keyframes ring{0%{opacity:.8;transform:scale(.6)}100%{opacity:0;transform:scale(3)}}
        .glowb{animation:gb 2.4s ease-in-out infinite}
        @keyframes gb{0%,100%{opacity:.08}50%{opacity:.45}}
        .blob{animation:drift 9s ease-in-out infinite}
        @keyframes drift{0%,100%{transform:translate(0,0)}50%{transform:translate(10px,-8px)}}
        @media (prefers-reduced-motion:reduce){*{animation:none!important}.arrow,.draw{stroke-dashoffset:0}.head,.area{opacity:1}}
      `}</style>
      <rect
        x="1"
        y="1"
        width="518"
        height="394"
        rx="34"
        fill="url(#bg)"
        stroke="#e6d4fb"
      />
      <g clipPath="url(#cc)">
        <circle
          className="blob"
          cx="470"
          cy="340"
          r="90"
          fill="#c58bff"
          opacity=".22"
        />
        <circle
          className="blob"
          style={{ animationDelay: "-4s" }}
          cx="30"
          cy="30"
          r="70"
          fill="#8fb4ff"
          opacity=".2"
        />
      </g>

      {/* sparkles */}
      <path
        className="tw"
        style={{ animationDelay: "0s" }}
        d="M47,56 Q47,62 53,62 Q47,62 47,68 Q47,62 41,62 Q47,62 47,56Z"
        fill="#9a55f5"
      />
      <path
        className="tw"
        style={{ animationDelay: "0.6s" }}
        d="M57,72.5 Q57,76 60.5,76 Q57,76 57,79.5 Q57,76 53.5,76 Q57,76 57,72.5Z"
        fill="#9a55f5"
      />
      <g
        stroke="#5a3ad8"
        strokeWidth="1.3"
        strokeLinecap="round"
        className="tw"
      >
        <line x1="437" y1="50" x2="437" y2="42" />
        <line x1="428" y1="52" x2="424" y2="46" />
        <line x1="446" y1="52" x2="450" y2="46" />
      </g>
      <g
        stroke="#5a3ad8"
        strokeWidth="1.3"
        strokeLinecap="round"
        className="tw"
        style={{ animationDelay: "1s" }}
      >
        <line x1="432" y1="213" x2="432" y2="221" />
        <line x1="423" y1="211" x2="419" y2="217" />
        <line x1="441" y1="211" x2="445" y2="217" />
      </g>

      {/* label */}
      <circle className="ring" cx="116" cy="55" r="2.4" fill="#7a3df0" />
      <circle cx="116" cy="55" r="2.4" fill="#7a3df0" />
      <text x="123" y="58" fontSize="7.5" fontWeight="600" fill="#7a3df0">
        Beacon is live!
      </text>

      {/* mascot */}
      <g className="bob">
        <path
          d="M68 148 v13 M66 161 h6 M92 148 v13 M90 161 h6"
          stroke="#1d1b2e"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        <g className="wave">
          <path
            d="M56 112 q-12 4 -12 18"
            stroke="#1d1b2e"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
        </g>
        <path
          d="M104 112 q12 4 12 18"
          stroke="#1d1b2e"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        <ellipse cx="80" cy="122" rx="26" ry="28" fill="url(#pm)" />
        <ellipse cx="72" cy="108" rx="9" ry="5" fill="#fff" opacity=".25" />
        <g className="blink">
          <path
            d="M67 118 q4 -5 8 0 M85 118 q4 -5 8 0"
            stroke="#2a1a55"
            strokeWidth="1.7"
            fill="none"
            strokeLinecap="round"
          />
        </g>
        <path
          d="M77 129 q4 5 8 0"
          stroke="#2a1a55"
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="64" cy="127" r="3.5" fill="#ff9ccf" opacity=".5" />
        <circle cx="96" cy="127" r="3.5" fill="#ff9ccf" opacity=".5" />
      </g>

      {/* prompt bubble */}
      <rect
        x="113"
        y="67"
        width="112"
        height="85"
        rx="16"
        fill="#fff"
        filter="url(#sh)"
      />
      <g fontSize="10.5" fontWeight="500" fill="#1d1b2e">
        <text x="127" y="92">
          Show visitors and
        </text>
        <text x="127" y="107">
          clicks for my
        </text>
        <text x="127" y="122">
          pricing page
          <tspan className="caret" fill="#7a3df0">
            |
          </tspan>
        </text>
        <text x="127" y="137" fill="#8a8798" fontSize="9">
          in real time
        </text>
      </g>

      {/* curly arrow */}
      <path
        className="arrow"
        pathLength={1}
        d="M186 160 C176 172 192 182 198 171 C204 160 190 154 188 167 C200 184 224 180 242 169"
        fill="none"
        stroke="#1d1b2e"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        className="head"
        d="M234 164 L243 169 L233 174"
        fill="none"
        stroke="#1d1b2e"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* dashboard */}
      <rect
        x="243"
        y="68"
        width="215"
        height="127"
        rx="9"
        fill="#fff"
        filter="url(#sh)"
      />
      <g clipPath="url(#dc)">
        <rect x="243" y="68" width="215" height="18" fill="#fff" />
        <line
          x1="243"
          y1="86"
          x2="458"
          y2="86"
          stroke="#eee9f8"
          strokeWidth=".8"
        />
        <rect x="253" y="73" width="8" height="8" rx="2.4" fill="#7a3df0" />
        <text x="264" y="79.5" fontSize="5.2" fontWeight="600" fill="#1d1b2e">
          Route
        </text>
        <g fontSize="4.6" fill="#7b7890">
          <text x="332" y="79.3">
            Product
          </text>
          <text x="358" y="79.3">
            Features
          </text>
          <text x="386" y="79.3">
            Pricing
          </text>
        </g>
        <rect x="412" y="73" width="38" height="10" rx="3" fill="#7a3df0" />
        <text
          x="431"
          y="79.7"
          textAnchor="middle"
          fontSize="4.6"
          fontWeight="600"
          fill="#fff"
        >
          Add snippet
        </text>

        <text x="253" y="108" fontSize="9.2" fontWeight="600"  fill="#17152a">
          See every route
        </text>
        <text x="253" y="120" fontSize="9.2" fontWeight="600" fill="#17152a">
          your visitors take
        </text>
        <g fontSize="4.8" fill="#8a8798">
          <text x="253" y="132">
            Simple analytics for visitors,
          </text>
          <text x="253" y="140">
            sessions and events in one
          </text>
          <text x="253" y="148">
            lightweight snippet.
          </text>
        </g>
        <rect x="253" y="158" width="36" height="12" rx="3.5" fill="#7a3df0" />
        <text
          x="271"
          y="166"
          textAnchor="middle"
          fontSize="5"
          fontWeight="600"
          fill="#fff"
        >
          Get started
        </text>
        <circle cx="299" cy="164" r="2.6" fill="#17152a" opacity=".85" />
        <path d="M298.2 162.8 L300.8 164 L298.2 165.2Z" fill="#fff" />
        <text x="305" y="166" fontSize="5" fontWeight="600" fill="#17152a">
          Live demo
        </text>

        <rect
          x="338"
          y="94"
          width="112"
          height="94"
          rx="6"
          fill="#fbfaff"
          stroke="#ece6fa"
          strokeWidth=".8"
        />
        <text x="345" y="104" fontSize="5" fontWeight="600" fill="#17152a">
          Overview
        </text>
        <circle className="ring" cx="441" cy="102" r="1.8" fill="#34c759" />
        <circle cx="441" cy="102" r="1.8" fill="#34c759" />
        <rect
          x="344"
          y="109"
          width="24"
          height="19"
          rx="3.5"
          fill="#fff"
          stroke="#ece6fa"
          strokeWidth=".7"
        />
        <text
          x="356"
          y="118.5"
          textAnchor="middle"
          fontSize="6"
          fontWeight="600"
          fill="#672ed8ff"
        >
          12.4k
        </text>
        <text
          x="356"
          y="124.5"
          textAnchor="middle"
          fontSize="3.8"
          fill="#8a8798"
        >
          Visitors
        </text>
        <rect
          x="370"
          y="109"
          width="24"
          height="19"
          rx="3.5"
          fill="#fff"
          stroke="#ece6fa"
          strokeWidth=".7"
        />
        <text
          x="382"
          y="118.5"
          textAnchor="middle"
          fontSize="6"
          fontWeight="600"
          fill="#672ed8ff"
        >
          8.7k
        </text>
        <text
          x="382"
          y="124.5"
          textAnchor="middle"
          fontSize="3.8"
          fill="#8a8798"
        >
          Sessions
        </text>
        <rect
          x="396"
          y="109"
          width="24"
          height="19"
          rx="3.5"
          fill="#fff"
          stroke="#ece6fa"
          strokeWidth=".7"
        />
        <text
          x="408"
          y="118.5"
          textAnchor="middle"
          fontSize="6"
          fontWeight="600"
          fill="#672ed8ff"
        >
          32.8k
        </text>
        <text
          x="408"
          y="124.5"
          textAnchor="middle"
          fontSize="3.8"
          fill="#8a8798"
        >
          Events
        </text>
        <rect
          x="422"
          y="109"
          width="24"
          height="19"
          rx="3.5"
          fill="#fff"
          stroke="#ece6fa"
          strokeWidth=".7"
        />
        <text
          x="434"
          y="118.5"
          textAnchor="middle"
          fontSize="6"
          fontWeight="600"
          fill="#672ed8ff"
        >
          90%
        </text>
        <text
          x="434"
          y="124.5"
          textAnchor="middle"
          fontSize="3.8"
          fill="#8a8798"
        >
          Uptime
        </text>
        <text x="345" y="136" fontSize="4.6" fontWeight="600" fill="#17152a">
          Traffic overview
        </text>
        <g stroke="#eee9f8" strokeWidth=".6">
          <line x1="346" y1="144" x2="444" y2="144" />
          <line x1="346" y1="154" x2="444" y2="154" />
          <line x1="346" y1="164" x2="444" y2="164" />
          <line x1="346" y1="176" x2="444" y2="176" />
        </g>
        <path
          className="area"
          d="M346,176 C348.0,175.3 354.0,172.3 358,172 C362.0,171.7 366.0,175.0 370,174 C374.0,173.0 378.0,167.0 382,166 C386.0,165.0 390.0,169.3 394,168 C398.0,166.7 402.0,159.3 406,158 C410.0,156.7 414.0,161.3 418,160 C422.0,158.7 425.7,152.3 430,150 C434.3,147.7 441.7,146.7 444,146 L444,176 L346,176Z"
          fill="url(#ar)"
        />
        <path
          className="draw"
          pathLength={1}
          d="M346,176 C348.0,175.3 354.0,172.3 358,172 C362.0,171.7 366.0,175.0 370,174 C374.0,173.0 378.0,167.0 382,166 C386.0,165.0 390.0,169.3 394,168 C398.0,166.7 402.0,159.3 406,158 C410.0,156.7 414.0,161.3 418,160 C422.0,158.7 425.7,152.3 430,150 C434.3,147.7 441.7,146.7 444,146"
          fill="none"
          stroke="url(#ln)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle className="ring" cx="444" cy="146" r="2.4" fill="#8b4dff" />
        <circle
          cx="444"
          cy="146"
          r="2.2"
          fill="#fff"
          stroke="#7a3df0"
          strokeWidth="1.3"
        />
        <rect
          className="sweep"
          x="200"
          y="60"
          width="40"
          height="140"
          fill="url(#sheen)"
        />
      </g>

      {/* text */}
      <text
        x="32"
        y="258"
        fontSize="29"
        fontWeight="500"
        letterSpacing="-.6"
        fill="url(#hd)"
      >
        From snippet
      </text>
      <text
        x="32"
        y="288"
        fontSize="29"
        fontWeight="500"
        letterSpacing="-.6"
        fill="#17152a"
      >
        to live insights
      </text>
      <g fontSize="13.5" fill="#6d6a7c">
        <text x="32" y="326">
          Paste one script and watch visitors, sessions and
        </text>
        <text x="32" y="346">
          events appear instantly across every route, with
        </text>
        <text x="32" y="366">
          zero setup and a tiny footprint.
        </text>
      </g>
    </svg>
  );
};

export default Svg4;
