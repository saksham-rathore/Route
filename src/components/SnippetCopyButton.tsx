import React from 'react'
import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export function SnippetCopyButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const code = `<script\n  defer\n  src="https://t.route.dev/script.js"\n  data-pid="YOUR_PROJECT_ID"\n  data-domain="route.dev"\n></script>`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      style={{
        background:
          "radial-gradient(circle, color(srgb 0.00784314 0.517647 0.780392 / 0.68) 0%, rgb(2, 132, 199) 64%)",
      }}
      className="mt-8 flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-lg text-[13.5px] font-semibold text-white shadow-[0_2px_8px_rgba(29,110,229,0.3)] transition-all hover:brightness-105 active:scale-[0.99]"
    >
      {copied ? (
        <>
          <Check size={14} className="text-white" />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <Copy size={14} className="text-white" />
          <span>Copy snippet</span>
        </>
      )}
    </button>
  );
}