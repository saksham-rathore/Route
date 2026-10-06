import React from "react";

const Svg5 = ({
  className = "h-auto w-full",
  ...props
}: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 738 396"
      className={className}
      role="img"
      aria-label="Track events through chat"
      {...props}
    >
      <title>Track events through chat</title>
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f0f9ff" />
          <stop offset="1" stopColor="#f0f9ff" />
        </linearGradient>
        <linearGradient id="hd" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0284C7" />
          <stop offset="1" stopColor="#0284C7" />
        </linearGradient>
        <linearGradient id="ub" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0284C7" />
          <stop offset="1" stopColor="#0284C7" />
        </linearGradient>
        <linearGradient id="ball" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0284C7" />
          <stop offset="1" stopColor="#0284C7" />
        </linearGradient>
        <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset=".5" stopColor="#fff" stopOpacity=".6" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <filter id="sh" x="-10%" y="-10%" width="120%" height="135%">
          <feDropShadow
            dx="0"
            dy="4"
            stdDeviation="6"
            floodColor="#2a62d8"
            floodOpacity=".14"
          />
        </filter>
        <clipPath id="cc">
          <rect x="1" y="1" width="736" height="394" rx="34" />
        </clipPath>
        <clipPath id="ubc">
          <rect x="420" y="52" width="240" height="64" rx="16" />
        </clipPath>
        <clipPath id="rc">
          <rect x="430" y="205" width="274" height="137" rx="16" />
        </clipPath>
      </defs>
      <style>{`
        text{font-family:Inter,'Segoe UI',system-ui,-apple-system,Roboto,sans-serif}
        .tw{animation:tw 2.4s ease-in-out infinite}
        @keyframes tw{0%,100%{opacity:.15}50%{opacity:.9}}
        .blob{animation:drift 9s ease-in-out infinite}
        @keyframes drift{0%,100%{transform:translate(0,0)}50%{transform:translate(-12px,10px)}}
        .u{opacity:0;animation:u 9s ease-in-out infinite}
        @keyframes u{0%{opacity:0;transform:translateY(12px)}7%,92%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(0)}}
        .a{opacity:0;animation:a 9s ease-in-out infinite}
        @keyframes a{0%,12%{opacity:0;transform:translateY(12px)}19%,92%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(0)}}
        .typing{animation:typing 9s ease-in-out infinite}
        @keyframes typing{0%,12%{opacity:0}19%,30%{opacity:1}34%,100%{opacity:0}}
        .reply{opacity:0;animation:reply 9s ease-in-out infinite}
        @keyframes reply{0%,32%{opacity:0}38%,92%{opacity:1}100%{opacity:0}}
        .r{opacity:0;animation:r 9s ease-in-out infinite}
        @keyframes r{0%,42%{opacity:0;transform:translateY(14px)}50%,92%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(0)}}
        .d1,.d2,.d3{animation:dot 1s ease-in-out infinite}
        .d2{animation-delay:.15s}.d3{animation-delay:.3s}
        @keyframes dot{0%,100%{transform:translateY(0);opacity:.4}50%{transform:translateY(-2.5px);opacity:1}}
        .spin{transform-box:fill-box;transform-origin:center;animation:spin 8s linear infinite}
        @keyframes spin{to{transform:rotate(360deg)}}
        .bob{animation:bob 3s ease-in-out infinite}
        @keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
        .armL{transform-box:fill-box;transform-origin:100% 100%;animation:aL 1.4s ease-in-out infinite}
        .armR{transform-box:fill-box;transform-origin:0% 100%;animation:aR 1.4s ease-in-out infinite}
        @keyframes aL{0%,100%{transform:rotate(0)}50%{transform:rotate(-14deg)}}
        @keyframes aR{0%,100%{transform:rotate(0)}50%{transform:rotate(14deg)}}
        .blink{transform-box:fill-box;transform-origin:center;animation:blink 4s infinite}
        @keyframes blink{0%,92%,100%{transform:scaleY(1)}96%{transform:scaleY(.1)}}
        .sweep{animation:sweep 4.5s ease-in-out infinite}
        @keyframes sweep{0%{transform:translateX(-90px) skewX(-20deg)}40%,100%{transform:translateX(330px) skewX(-20deg)}}
        .evt{animation:evt 1.6s ease-in-out infinite}
        @keyframes evt{0%,100%{opacity:1}50%{opacity:.45}}
        .ring{transform-box:fill-box;transform-origin:center;animation:ring 2s ease-out infinite}
        @keyframes ring{0%{opacity:.7;transform:scale(.8)}100%{opacity:0;transform:scale(2)}}
        .arrow{stroke-dasharray:1;stroke-dashoffset:1;animation:arrow 6s ease-in-out infinite}
        @keyframes arrow{0%{stroke-dashoffset:1;opacity:1}35%,85%{stroke-dashoffset:0;opacity:1}100%{stroke-dashoffset:0;opacity:0}}
        @media (prefers-reduced-motion:reduce){*{animation:none!important}.u,.a,.r,.reply{opacity:1!important}.typing{opacity:0!important}.arrow{stroke-dashoffset:0}}
      `}</style>
      <rect
        x="1"
        y="1"
        width="736"
        height="394"
        rx="34"
        fill="#f0f9ff"
        stroke="#e0f0fe"
      />

      {/* dot grid */}
      <g fill="#2f7be8">
        <circle
          className="tw"
          style={{ animationDelay: "0.00s" }}
          cx="55"
          cy="43.0"
          r="1.2"
          opacity=".35"
        />
        <circle
          className="tw"
          style={{ animationDelay: "0.18s" }}
          cx="55"
          cy="54.5"
          r="1.2"
          opacity=".35"
        />
        <circle
          className="tw"
          style={{ animationDelay: "0.36s" }}
          cx="55"
          cy="66.0"
          r="1.2"
          opacity=".35"
        />
        <circle
          className="tw"
          style={{ animationDelay: "0.54s" }}
          cx="55"
          cy="77.5"
          r="1.2"
          opacity=".35"
        />
        <circle
          className="tw"
          style={{ animationDelay: "0.72s" }}
          cx="55"
          cy="89.0"
          r="1.2"
          opacity=".35"
        />
        <circle
          className="tw"
          style={{ animationDelay: "0.18s" }}
          cx="73"
          cy="43.0"
          r="1.2"
          opacity=".35"
        />
        <circle
          className="tw"
          style={{ animationDelay: "0.36s" }}
          cx="73"
          cy="54.5"
          r="1.2"
          opacity=".35"
        />
        <circle
          className="tw"
          style={{ animationDelay: "0.54s" }}
          cx="73"
          cy="66.0"
          r="1.2"
          opacity=".35"
        />
        <circle
          className="tw"
          style={{ animationDelay: "0.72s" }}
          cx="73"
          cy="77.5"
          r="1.2"
          opacity=".35"
        />
        <circle
          className="tw"
          style={{ animationDelay: "0.90s" }}
          cx="73"
          cy="89.0"
          r="1.2"
          opacity=".35"
        />
        <circle
          className="tw"
          style={{ animationDelay: "0.36s" }}
          cx="91"
          cy="43.0"
          r="1.2"
          opacity=".35"
        />
        <circle
          className="tw"
          style={{ animationDelay: "0.54s" }}
          cx="91"
          cy="54.5"
          r="1.2"
          opacity=".35"
        />
        <circle
          className="tw"
          style={{ animationDelay: "0.54s" }}
          cx="91"
          cy="66.0"
          r="1.2"
          opacity=".35"
        />
        <circle
          className="tw"
          style={{ animationDelay: "0.72s" }}
          cx="91"
          cy="77.5"
          r="1.2"
          opacity=".35"
        />
        <circle
          className="tw"
          style={{ animationDelay: "1.08s" }}
          cx="91"
          cy="89.0"
          r="1.2"
          opacity=".35"
        />
        <circle
          className="tw"
          style={{ animationDelay: "0.54s" }}
          cx="109"
          cy="43.0"
          r="1.2"
          opacity=".35"
        />
        <circle
          className="tw"
          style={{ animationDelay: "0.72s" }}
          cx="109"
          cy="54.5"
          r="1.2"
          opacity=".35"
        />
        <circle
          className="tw"
          style={{ animationDelay: "0.90s" }}
          cx="109"
          cy="66.0"
          r="1.2"
          opacity=".35"
        />
        <circle
          className="tw"
          style={{ animationDelay: "1.08s" }}
          cx="109"
          cy="77.5"
          r="1.2"
          opacity=".35"
        />
        <circle
          className="tw"
          style={{ animationDelay: "1.26s" }}
          cx="109"
          cy="89.0"
          r="1.2"
          opacity=".35"
        />
        <circle
          className="tw"
          style={{ animationDelay: "0.72s" }}
          cx="127"
          cy="43.0"
          r="1.2"
          opacity=".35"
        />
        <circle
          className="tw"
          style={{ animationDelay: "0.90s" }}
          cx="127"
          cy="54.5"
          r="1.2"
          opacity=".35"
        />
        <circle
          className="tw"
          style={{ animationDelay: "1.08s" }}
          cx="127"
          cy="66.0"
          r="1.2"
          opacity=".35"
        />
        <circle
          className="tw"
          style={{ animationDelay: "1.26s" }}
          cx="127"
          cy="77.5"
          r="1.2"
          opacity=".35"
        />
        <circle
          className="tw"
          style={{ animationDelay: "1.44s" }}
          cx="127"
          cy="89.0"
          r="1.2"
          opacity=".35"
        />
        <circle
          className="tw"
          style={{ animationDelay: "0.90s" }}
          cx="145"
          cy="43.0"
          r="1.2"
          opacity=".35"
        />
        <circle
          className="tw"
          style={{ animationDelay: "1.08s" }}
          cx="145"
          cy="54.5"
          r="1.2"
          opacity=".35"
        />
        <circle
          className="tw"
          style={{ animationDelay: "1.26s" }}
          cx="145"
          cy="66.0"
          r="1.2"
          opacity=".35"
        />
        <circle
          className="tw"
          style={{ animationDelay: "1.44s" }}
          cx="145"
          cy="77.5"
          r="1.2"
          opacity=".35"
        />
        <circle
          className="tw"
          style={{ animationDelay: "1.62s" }}
          cx="145"
          cy="89.0"
          r="1.2"
          opacity=".35"
        />
        <circle
          className="tw"
          style={{ animationDelay: "1.08s" }}
          cx="163"
          cy="43.0"
          r="1.2"
          opacity=".35"
        />
        <circle
          className="tw"
          style={{ animationDelay: "1.26s" }}
          cx="163"
          cy="54.5"
          r="1.2"
          opacity=".35"
        />
        <circle
          className="tw"
          style={{ animationDelay: "1.44s" }}
          cx="163"
          cy="66.0"
          r="1.2"
          opacity=".35"
        />
        <circle
          className="tw"
          style={{ animationDelay: "1.62s" }}
          cx="163"
          cy="77.5"
          r="1.2"
          opacity=".35"
        />
        <circle
          className="tw"
          style={{ animationDelay: "1.80s" }}
          cx="163"
          cy="89.0"
          r="1.2"
          opacity=".35"
        />
      </g>

      {/* curly arrow + sparks */}
      <path
        className="arrow"
        pathLength={1}
        d="M198 100 C196 84 214 80 220 92 C226 104 210 108 210 96 C214 80 250 92 268 88"
        fill="none"
        stroke="#1d1b2e"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <g
        stroke="#2f7be8"
        strokeWidth="1.4"
        strokeLinecap="round"
        className="tw"
      >
        <line x1="270" y1="74" x2="276" y2="68" />
        <line x1="276" y1="82" x2="284" y2="80" />
        <line x1="272" y1="90" x2="278" y2="95" />
      </g>

      {/* text */}
      <text
        x="32"
        y="150"
        fontSize="30"
        fontWeight="500"
        letterSpacing="-.6"
        fill="url(#hd)"
      >
        Track events
      </text>
      <text
        x="32"
        y="181"
        fontSize="30"
        fontWeight="500"
        letterSpacing="-.6"
        fill="#12122a"
      >
        through chat.
      </text>
      <g fontSize="13" fill="#6a6f82">
        <text x="32" y="218">
          Ask to track a click, add a goal, watch a
        </text>
        <text x="32" y="238">
          route, or turn a pageview into a funnel,
        </text>
        <text x="32" y="258">
          all in plain words.
        </text>
      </g>

      {/* user message */}
      <g className="u">
        <rect
          x="420"
          y="52"
          width="240"
          height="64"
          rx="16"
          fill="url(#ub)"
          filter="url(#sh)"
        />
        <g clipPath="url(#ubc)">
          <rect
            className="sweep"
            x="380"
            y="46"
            width="44"
            height="76"
            fill="url(#sheen)"
          />
        </g>
        <text x="438" y="80" fontSize="12" fontWeight="700" fill="#fff">
          Track clicks on the
        </text>
        <text x="438" y="98" fontSize="12" fontWeight="700" fill="#fff">
          pricing button
        </text>

        <image
          href="/svg_7.svg"
          xlinkHref="/svg_7.svg"
          x="668"
          y="66"
          width="36"
          height="36"
        />
      </g>

      {/* assistant reply */}
      <g className="a">
        <g className="spin">
          <circle cx="340" cy="146" r="9" fill="#fff" />
          <g fill="#1f7cf5">
            <circle cx="340" cy="136" r="6" />
            <circle cx="350" cy="144" r="6" />
            <circle cx="346" cy="156" r="6" />
            <circle cx="334" cy="156" r="6" />
            <circle cx="330" cy="144" r="6" />
            <circle cx="340" cy="146" r="7" />
          </g>
        </g>
        <circle cx="337" cy="145" r="1.5" fill="#fff" />
        <circle cx="344" cy="145" r="1.5" fill="#fff" />
        <rect
          x="366"
          y="128"
          width="260"
          height="64"
          rx="16"
          fill="#fff"
          filter="url(#sh)"
        />
        <g className="typing">
          <circle className="d1" cx="388" cy="160" r="3.2" fill="#2f7be8" />
          <circle className="d2" cx="400" cy="160" r="3.2" fill="#2f7be8" />
          <circle className="d3" cx="412" cy="160" r="3.2" fill="#2f7be8" />
        </g>
        <g className="reply" fontSize="11.5" fill="#2a2f45">
          <text x="384" y="153">
            Done!{" "}
            <tspan className="evt" fontWeight="700" fill="#0a84d6">
              pricing_click
            </tspan>{" "}
            is now
          </text>
          <text x="384" y="171">
            being tracked on every page.
          </text>
        </g>
      </g>

      {/* result card */}
      <g className="r">
        <rect
          x="430"
          y="205"
          width="274"
          height="137"
          rx="16"
          fill="#fff"
          filter="url(#sh)"
        />
        <text
          x="567"
          y="240"
          textAnchor="middle"
          fontSize="22"
          fontWeight="600"
          letterSpacing="-.5"
          fill="#12122a"
        >
          Insights that
        </text>
        <text
          x="567"
          y="264"
          textAnchor="middle"
          fontSize="22"
          fontWeight="600"
          letterSpacing="-.5"
          fill="#12122a"
        >
          drive results
        </text>
        <text x="567" y="281" textAnchor="middle" fontSize="6.8" fill="#8b8fa0">
          Simple, privacy-friendly analytics for every route.
        </text>
        <rect x="445" y="293" width="74" height="35" rx="9" fill="#f1e8ff" />
        <text
          x="482"
          y="309"
          textAnchor="middle"
          fontSize="11"
          fontWeight="600"
          fill="#7a3df0"
        >
          12.4k
        </text>
        <text x="482" y="321" textAnchor="middle" fontSize="6.5" fill="#6a6f82">
          Visitors
        </text>
        <rect x="526" y="293" width="74" height="35" rx="9" fill="#e4f0ff" />
        <text
          x="563"
          y="309"
          textAnchor="middle"
          fontSize="11"
          fontWeight="600"
          fill="#2f7be8"
        >
          8.7k
        </text>
        <text x="563" y="321" textAnchor="middle" fontSize="6.5" fill="#6a6f82">
          Sessions
        </text>
        <rect x="607" y="293" width="74" height="35" rx="9" fill="#e2f8ea" />
        <text
          x="644"
          y="309"
          textAnchor="middle"
          fontSize="11"
          fontWeight="600"
          fill="#12a150"
        >
          32.8k
        </text>
        <text x="644" y="321" textAnchor="middle" fontSize="6.5" fill="#6a6f82">
          Events
        </text>
        <g clipPath="url(#rc)">
          <rect
            className="sweep"
            x="380"
            y="200"
            width="40"
            height="150"
            fill="url(#sheen)"
            style={{ animationDelay: "1s" }}
          />
        </g>
      </g>

      {/* blue mascot */}
      <g className="bob">
        <g className="armL">
          <path
            d="M352 280 q-14 -8 -12 -26"
            stroke="#12122a"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </g>
        <g className="armR">
          <path
            d="M392 280 q14 -8 12 -26"
            stroke="#12122a"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </g>
        <path
          d="M362 316 l-4 22 h-12 M382 316 l4 22 h12"
          stroke="#12122a"
          strokeWidth="1.8"
          fill="#fff"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <circle cx="372" cy="296" r="25" fill="url(#ball)" />
        <ellipse cx="364" cy="284" rx="8" ry="4.5" fill="#fff" opacity=".25" />
        <g className="blink">
          <circle cx="364" cy="291" r="5.4" fill="#fff" />
          <circle cx="380" cy="291" r="5.4" fill="#fff" />
          <circle cx="365" cy="292" r="2.4" fill="#12122a" />
          <circle cx="381" cy="292" r="2.4" fill="#12122a" />
        </g>
        <path d="M363 302 q9 12 18 0Z" fill="#12122a" />
        <path d="M367 306 q5 4 10 0 q-5 -3 -10 0Z" fill="#ff7a8a" />
      </g>
    </svg>
  );
};

export default Svg5;
