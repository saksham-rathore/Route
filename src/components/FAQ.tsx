"use client";

import React, { useState } from "react";
import { Plus, X } from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    id: "faq-1",
    question: "What can I track with Route?",
    answer:
      "Track page views, sessions, visitors, custom events, user behavior, and website performance from a single lightweight script.",
  },
  {
    id: "faq-2",
    question: "How does Route Analytics work?",
    answer:
      "Add the Route tracking script to your website and Route automatically collects analytics and performance data while you focus on building your product.",
  },
  {
    id: "faq-3",
    question: "Can I track custom events?",
    answer:
      "Yes. Track actions such as button clicks, signups, purchases, form submissions, and other important product events.",
  },
  {
    id: "faq-4",
    question: "Does Route track website performance?",
    answer:
      "Yes. Route collects Web Vitals such as LCP, CLS, INP, FCP, and TTFB, along with API request performance.",
  },
  {
    id: "faq-5",
    question: "Does Route track errors?",
    answer:
      "Yes. Route can capture JavaScript errors and unhandled promise rejections so you can understand when and where problems happen.",
  },
  {
    id: "faq-6",
    question: "Can I see where my users are coming from?",
    answer:
      "Route can provide the user and session context collected by your tracking setup, helping you understand how visitors interact with your website.",
  },
  {
    id: "faq-7",
    question: "Is Route an analytics or observability tool?",
    answer:
      "Both. Route combines product analytics with frontend observability, giving you insight into what users do and how your website performs.",
  },
];

export const FAQ = () => {
  // First item open by default matching the screenshot
  const [openId, setOpenId] = useState<string | null>("faq-1");

  const toggleItem = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="w-full bg-white py-24 px-4 sm:px-6 lg:px-8 font-instrument-sans">
      <div className="mx-auto max-w-[760px]">
        {/* Section Header */}
        <div className="text-center">
          <h2 className="font-lastik text-[38px] sm:text-[46px] md:text-[52px] font-medium leading-[1.08] tracking-[-0.035em] text-[#18181b]">
            Frequently Asked
          </h2>
          <p className="mx-auto mt-3.5 max-w-[480px] text-[15px] sm:text-[16px] font-normal leading-[1.5] text-[#667085]">
            A quick look at how Route works before you start, with answers to the
            most common things people ask.
          </p>
        </div>

        {/* FAQ Accordion Card */}
        <div
          className="mt-12 overflow-hidden rounded-[24px] sm:rounded-[28px] border border-[#eaedf3] bg-white divide-y divide-[#f2f4f7]"
          style={{
            boxShadow:
              "rgba(255, 255, 255, 0.85) 0px 1px 0px 0px inset, rgba(15, 23, 42, 0.04) 0px 1px 3px 0px inset, rgba(15, 23, 42, 0.04) 0px 20px 50px -10px",
          }}
        >
          {faqItems.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div key={item.id} className="transition-colors">
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  aria-expanded={isOpen}
                  className="group flex w-full items-center justify-between gap-4 px-6 py-5 sm:px-8 sm:py-6 text-left cursor-pointer transition-colors hover:bg-[#fafbfc]"
                >
                  <span className="text-[15.5px] sm:text-[16.5px] font-medium tracking-[-0.015em] text-[#101828]">
                    {item.question}
                  </span>

                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#e4e7ec] bg-white text-[#98a2b3] transition-all duration-200 group-hover:border-[#d0d5dd] group-hover:text-[#344054]">
                    {isOpen ? (
                      <X size={14} strokeWidth={2} />
                    ) : (
                      <Plus size={14} strokeWidth={2} />
                    )}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-0 sm:px-8 sm:pb-7">
                    <p className="max-w-[620px] text-[14px] sm:text-[14.5px] font-normal leading-[1.65] text-[#475467]">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Prompt */}
        <div className="mt-8 text-center text-[13.5px] text-[#667085]">
          still curious?{" "}
          <a
            href="mailto:sammystackx@gmail.com"
            className="font-medium text-[#0284c7] underline decoration-[#0284c7]/40 underline-offset-4 hover:decoration-[#0284c7] transition-colors"
          >
            say hello
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
