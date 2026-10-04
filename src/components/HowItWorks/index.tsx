"use client";

import React from "react";
import { StepOne } from "./StepOne";
import { StepTwo } from "./StepTwo";
import { StepThree } from "./StepThree";

export const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="w-full bg-[#edf0f5] py-20 px-4 sm:px-6 lg:px-8 font-instrument-sans"
    >
      <div className="mx-auto max-w-[880px]">
        {/* Main Section Header */}
        <div className="text-center">
          <h2 className="text-[32px] sm:text-[38px] font-bold text-[#0f172a] font-lastik ml-1 gap-2 leading-none tracking-[-0.04em]">
            How it works
          </h2>
          <p className="mx-auto mt-3 max-w-[720px] px-1 text-center text-[16px] font-medium leading-[1.42] tracking-[-0.02em] text-[#77736c] sm:mb-6 sm:px-4 sm:text-[18px]">
            From script tag to full network visibility in under a minute.
          </p>
        </div>

        {/* STEP 01: Onboarding */}
        <StepOne />

        {/* STEP 02: Flow the data through the edge */}
        <StepTwo />

        {/* STEP 03: See the experience in the dashboard */}
        <StepThree />
      </div>
    </section>
  );
};

export default HowItWorks;
export { StepOne, StepTwo, StepThree };
