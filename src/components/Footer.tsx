import React from "react";

export const Footer = () => {
  return (
    <footer className="w-full border-t border-[#edf2f7] bg-white pt-16 pb-12 px-6 sm:px-10 lg:px-16 font-instrument-sans">
      <div className="mx-auto max-w-[1180px]">
        {/* Top Grid: Contact & Nav Columns */}
        <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-16">
          {/* Left Column: Get in touch */}
          <div className="lg:max-w-[320px] shrink-0">
            <h3 className="text-[18px] sm:text-[19px] font-semibold text-[#0f172a] tracking-tight">
              Get in touch
            </h3>
            <p className="mt-2.5 text-[13.5px] leading-[1.6] text-[#64748b]">
              Sales, support, partnerships, or press. Reach out and we&apos;ll
              reply within one business day.
            </p>

            <a
              href="mailto:hello@make.design"
              className="mt-5 inline-flex items-center gap-2.5 rounded-full border border-[#e2e8f0] bg-white px-4 py-2 text-[13px] font-medium text-[#0f172a] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all hover:border-[#cbd5e1] hover:bg-[#f8fafc] active:scale-[0.99]"
            >
              <svg
                className="w-3.5 h-3.5 text-[#64748b]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <span>sammystackx@gmail.com</span>
            </a>
          </div>

          {/* Right: 5 Link Columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 sm:gap-10 flex-1">
            {/* 1. Product */}
            <div>
              <h4 className="text-[13px] font-semibold text-[#0f172a] tracking-tight">
                Product
              </h4>
              <ul className="mt-3.5 space-y-2.5">
                {["How it works", "Pricing", "Showcases", "FAQ"].map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-[13px] text-[#64748b] hover:text-[#0f172a] transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* 2. Explore */}
            <div>
              <h4 className="text-[13px] font-semibold text-[#0f172a] tracking-tight">
                Explore
              </h4>
              <ul className="mt-3.5 space-y-2.5">
                {[
                  "Web design",
                  "Marketing graphics",
                  "App design",
                  "Graphic design",
                  "AI website generator",
                  "AI poster maker",
                ].map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-[13px] text-[#64748b] hover:text-[#0f172a] transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. Resources */}
            <div>
              <h4 className="text-[13px] font-semibold text-[#0f172a] tracking-tight">
                Resources
              </h4>
              <ul className="mt-3.5 space-y-2.5">
                {["Blog", "Comparisons", "Alternatives", "Best AI tools"].map(
                  (link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-[13px] text-[#64748b] hover:text-[#0f172a] transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* 4. Company */}
            <div>
              <h4 className="text-[13px] font-semibold text-[#0f172a] tracking-tight">
                Company
              </h4>
              <ul className="mt-3.5 space-y-2.5">
                {["Careers", "Login", "Contact"].map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-[13px] text-[#64748b] hover:text-[#0f172a] transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* 5. Legal */}
            <div>
              <h4 className="text-[13px] font-semibold text-[#0f172a] tracking-tight">
                Legal
              </h4>
              <ul className="mt-3.5 space-y-2.5">
                {[
                  "Privacy Policy",
                  "Terms of Service",
                  "Cookie Policy",
                  "Acceptable Use",
                ].map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-[13px] text-[#64748b] hover:text-[#0f172a] transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Attribution */}
        <div className="mt-16 sm:mt-20 border-t border-[#edf2f7] pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-start text-[12px] text-[#8695a8] gap-2">
          <span>© 2026 Route Analytics. All rights reserved.</span>
          <span className="hidden sm:inline text-[#cbd5e1]">|</span>
          <span className="flex items-center gap-1.5">
            Made with <span className="text-[#ef4444]">❤️</span> by Sam rathore
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
