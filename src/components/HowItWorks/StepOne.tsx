"use client";

import React from "react";
import { SnippetCopyButton } from "../SnippetCopyButton";
import CodeScript from "../CodeScript";

export const StepOne = () => {
  return (
    <div className="mt-14 sm:mt-16 text-left font-instrument-sans">
      {/* Header */}
      <div>
        <p className="max-w-[720px] text-[16px] font-medium leading-[1.42] tracking-[-0.02em] text-[#77736c] sm:text-[12px] uppercase">
          STEP 01
        </p>
        <h3 className="max-w-[720px] text-[24px] font-medium leading-[1.3] tracking-[-0.04em] text-[#0284C7] sm:text-[40px] mt-1">
          Onboarding
        </h3>
        <p className="max-w-[720px] text-[15px] font-medium leading-[1.45] tracking-[-0.02em] text-[#77736c] sm:text-[16px] mt-2">
          Create your project, set your domain, and paste the snippet. The
          guided setup takes under a minute. No SDK sprawl or extra build steps.
        </p>
      </div>

      {/* Dual Cards Container */}
      <div className="mt-7 rounded-[18px] border border-[#cfd6e2] bg-[#e0e4eb] p-3 sm:p-3.5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5">
          {/* Step 1 Card: Create Project */}
          <div className="flex flex-col justify-between rounded-[14px] border border-[#d6dde8] bg-white p-5 sm:p-6 shadow-xs">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#77736c] sm:text-[12px]">
                STEP 1 OF 2
              </p>
              <h4 className="py-2 text-[18px] sm:text-[22px] font-semibold leading-[1.42] tracking-[-0.02em] text-[#0284C7]">
                Create project
              </h4>

              <div className="mt-5 space-y-6">
                <div>
                  <div className="mb-2">
                    <label className="text-[11px] sm:text-[12px] font-medium uppercase tracking-[0.04em] text-[#77736c]">
                      NAME
                    </label>
                  </div>
                  <input
                    type="text"
                    defaultValue="my-app"
                    className="w-full rounded-lg border border-[#d9e0eb] bg-[#f8fafc] px-3.5 py-2 text-[13.5px] font-medium text-[#1e293b] outline-none shadow-xs transition-colors focus:border-[#1d6ee5] focus:bg-white sm:text-[14px]"
                    placeholder="my-app"
                  />
                </div>

                <div>
                  <div className="mb-2">
                    <label className="text-[11px] sm:text-[12px] font-medium uppercase tracking-[0.04em] text-[#77736c]">
                      DOMAIN
                    </label>
                  </div>
                  <input
                    type="text"
                    defaultValue="route.dev"
                    className="w-full rounded-lg border border-[#d9e0eb] bg-[#f8fafc] px-3.5 py-2 text-[13.5px] font-medium text-[#1e293b] outline-none shadow-xs transition-colors focus:border-[#1d6ee5] focus:bg-white sm:text-[14px]"
                    placeholder="route.dev"
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              style={{
                background:
                  "radial-gradient(circle, color(srgb 0.00784314 0.517647 0.780392 / 0.68) 0%, rgb(2, 132, 199) 64%)",
              }}
              className="mt-7 w-full rounded-lg py-2.5 text-center text-[13.5px] font-semibold text-white shadow-[0_2px_8px_rgba(29,110,229,0.3)] transition-all hover:brightness-105 active:scale-[0.99]"
            >
              Create project
            </button>
          </div>

          {/* Step 2 Card: Install snippet */}
          <div className="flex flex-col justify-between rounded-[14px] border border-[#d6dde8] bg-white p-5 sm:p-6 shadow-xs">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#77736c] sm:text-[12px]">
                STEP 2 OF 2
              </p>
              <h4 className="py-2 text-[18px] sm:text-[22px] font-semibold leading-[1.42] tracking-[-0.02em] text-[#0284C7]">
                Install snippet
              </h4>
              <p className="py-1 text-[13px] sm:text-[14px] font-medium leading-[1.42] tracking-[-0.02em] text-[#77736c]">
                Paste in &lt;head&gt;. Live in minutes.
              </p>

              {/* Code Box Component */}
              <div className="mt-4">
                <CodeScript />
              </div>
            </div>

            <div className="mt-6">
              <SnippetCopyButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
