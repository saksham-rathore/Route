"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

export const CodeScript = () => {
  const [copied, setCopied] = useState(false);

  const snippetCode = `<script\n  defer\n  src="https://cdn.route.dev/script.js"\n  data-pid="YOUR_PROJECT_ID"\n  data-domain="route.dev"\n></script>`;

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(snippetCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="w-full overflow-hidden rounded-[10px] border border-[#cfd8e3] bg-white text-left font-instrument-sans shadow-xs"
      style={{
        boxShadow:
          "inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 1px 2px rgba(15, 23, 42, 0.04)",
      }}
    >
      {/* SCRIPT.JS Header */}
      <div className="flex h-9 items-center justify-between border-b border-[#e2e8f0] bg-slate-50/70 px-3.5 sm:px-4">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#738094]">
          SCRIPT.JS
        </span>
      </div>

      {/* Code Container */}
      <div className="p-2.5 sm:p-3">
        <div
          className="relative w-full rounded-[8px] border border-[#e2e8f0]/80 bg-[#f8fafc] p-3 sm:p-3.5"
          style={{
            boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.03)",
          }}
        >
          {/* Top-Right Copy Icon */}
          <button
            type="button"
            onClick={handleCopy}
            className="absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-md text-[#738094] hover:bg-slate-200/60 hover:text-[#0f172a] transition-colors cursor-pointer"
            aria-label="Copy script"
            title="Copy script"
          >
            {copied ? (
              <Check size={14} className="text-emerald-600" />
            ) : (
              <Copy size={14} />
            )}
          </button>

          {/* Syntax Highlighted Code without horizontal scrollbar */}
          <pre className="font-mono text-[11.5px] sm:text-[12px] leading-[1.65] text-[#334155] pr-7 m-0 overflow-hidden select-text">
            <code>
              <div>
                <span className="text-[#94a3b8]">&lt;</span>
                <span className="font-bold text-[#c73c4d]">script</span>
                <span className="text-amber-500 font-medium"> defer</span>
              </div>
              <div className="pl-3.5 sm:pl-4">
                <span className="text-amber-500 font-medium">src</span>
                <span className="text-[#94a3b8]">=</span>
                <span className="text-teal-600">&quot;https://t.route.dev/script.js&quot;</span>
              </div>
              <div className="pl-3.5 sm:pl-4">
                <span className="text-amber-500 font-medium">data-pid</span>
                <span className="text-[#94a3b8]">=</span>
                <span className="text-teal-600">&quot;YOUR_PROJECT_ID&quot;</span>
              </div>
              <div className="pl-3.5 sm:pl-4">
                <span className="text-amber-500 font-medium">data-domain</span>
                <span className="text-[#94a3b8]">=</span>
                <span className="text-teal-600">&quot;example.dev&quot;</span>
              </div>
              <div>
                <span className="text-[#94a3b8]">/&gt;</span>
              
                <span className="text-[#94a3b8]"></span>
              </div>
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodeScript;