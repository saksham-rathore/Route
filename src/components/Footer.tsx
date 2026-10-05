import React from "react";

export const Footer = () => {
  return (
    <footer className="relative w-full overflow-hidden bg-white pt-20 pb-12 px-6 sm:px-10 lg:px-16 font-instrument-sans">
      {/* Ambient background glows matching design */}
      <div className="pointer-events-none absolute -left-28 top-0 h-[460px] w-[460px] rounded-full bg-[radial-gradient(circle,rgba(224,236,255,0.75)_0%,transparent_70%)] blur-3xl opacity-70" />
      <div className="pointer-events-none absolute -right-28 top-0 h-[460px] w-[460px] rounded-full bg-[radial-gradient(circle,rgba(224,236,255,0.75)_0%,transparent_70%)] blur-3xl opacity-70" />

      <div className="relative z-10 mx-auto max-w-[1240px]">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 pb-16">
          {/* Left Brand Column (Col 1-5) */}
          <div className="lg:col-span-5 flex flex-col items-start pr-0 lg:pr-8">
            {/* Logo + Brand */}
            <div className="flex items-center gap-3">
              <img
                src="/logo.svg"
                alt="Route"
                className="h-9 w-9 shrink-0 object-contain rounded-xl shadow-[0_2px_8px_rgba(2,132,199,0.2)]"
              />
              <div className="flex flex-col">
                <span className="font-lastik text-[23px] font-normal leading-none tracking-[-0.02em] text-[#0f172a]">
                  Route
                </span>
                <span className="font-instrument-sans text-[12px] font-medium text-[#64748b] leading-tight mt-1 tracking-tight">
                  Analytics
                </span>
              </div>
            </div>

            {/* Headline */}
            <h3 className="mt-8 font-instrument-sans text-[24px] sm:text-[27px] font-bold leading-[1.18] tracking-[-0.035em] text-[#0f172a]">
              Understand your users.
              <br />
              Monitor your product.
            </h3>

            {/* Subtitle */}
            <p className="mt-3 font-instrument-sans text-[14px] sm:text-[14.5px] leading-[1.5] text-[#64748b] max-w-[340px]">
              Simple analytics and frontend observability
              <br className="hidden sm:inline" /> for modern websites.
            </p>

            {/* Button with signature button gradient & shadow border */}
            <a
              href="/auth/sign-up"
              style={{
                background:
                  "radial-gradient(circle, color(srgb 0.00784314 0.517647 0.780392 / 0.68) 0%, rgb(2, 132, 199) 64%)",
                boxShadow:
                  "0 2px 10px rgba(2, 132, 199, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.28), inset 0 -1px 2px rgba(0, 0, 0, 0.15)",
              }}
              className="group mt-6 inline-flex items-center gap-2.5 rounded-[11px] px-5 py-2.5 text-[14px] font-semibold text-white transition-all duration-200 hover:brightness-105 active:scale-[0.99] font-instrument-sans"
            >
              <span>Start tracking</span>
              <span className="text-[15px] font-normal leading-none transition-transform duration-200 group-hover:translate-x-0.5">
                →
              </span>
            </a>
          </div>

          {/* Right Navigation Columns (Col 6-12) */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-6 pt-1">
            {/* 1. Product */}
            <div>
              <h4 className="text-[14px] font-semibold text-[#0f172a] tracking-tight font-instrument-sans">
                Product
              </h4>
              <ul className="mt-4 space-y-3 font-instrument-sans">
                {["Analytics", "Observability", "Web Vitals", "Custom Events", "Pricing"].map(
                  (item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-[14px] text-[#64748b] hover:text-[#0f172a] transition-colors"
                      >
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* 2. Developers */}
            <div>
              <h4 className="text-[14px] font-semibold text-[#0f172a] tracking-tight font-instrument-sans">
                Developers
              </h4>
              <ul className="mt-4 space-y-3 font-instrument-sans">
                {[
                  "Documentation",
                  "API Reference",
                  "JavaScript SDK",
                  "Examples",
                  "GitHub",
                ].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-[14px] text-[#64748b] hover:text-[#0f172a] transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. Resources */}
            <div>
              <h4 className="text-[14px] font-semibold text-[#0f172a] tracking-tight font-instrument-sans">
                Resources
              </h4>
              <ul className="mt-4 space-y-3 font-instrument-sans">
                {["Blog", "Changelog", "FAQ", "Guides"].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-[14px] text-[#64748b] hover:text-[#0f172a] transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* 4. Company */}
            <div>
              <h4 className="text-[14px] font-semibold text-[#0f172a] tracking-tight font-instrument-sans">
                Company
              </h4>
              <ul className="mt-4 space-y-3 font-instrument-sans">
                {["About", "Contact", "Careers", "GitHub"].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-[14px] text-[#64748b] hover:text-[#0f172a] transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Socials */}
        <div className="border-t border-[#edf2f7] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-[#8695a8] font-instrument-sans">
          <div className="flex flex-wrap items-center gap-2">
            <span>© 2026 Route Analytics. All rights reserved.</span>
            <span className="hidden sm:inline text-[#cbd5e1]">|</span>
            <span className="flex items-center gap-1.5">
              Made with <span className="text-[#ef4444]">❤️</span> by Sam rathore
            </span>
          </div>

          {/* Social Icons from public/ */}
          <div className="flex items-center gap-4 text-[#64748b]">
            {/* GitHub */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-70 transition-all duration-150 hover:opacity-100 hover:scale-110 active:scale-95"
              title="GitHub"
            >
              <img
                src="/github.svg"
                alt="GitHub"
                className="h-[18px] w-[18px] object-contain"
              />
            </a>

            {/* X (Twitter) */}
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-70 transition-all duration-150 hover:opacity-100 hover:scale-110 active:scale-95"
              title="X"
            >
              <img
                src="/X.svg"
                alt="X"
                className="h-[15px] w-[15px] object-contain"
              />
            </a>

            {/* LinkedIn */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-70 transition-all duration-150 hover:opacity-100 hover:scale-110 active:scale-95"
              title="LinkedIn"
            >
              <img
                src="/LinkedIn.svg"
                alt="LinkedIn"
                className="h-[17px] w-[17px] object-contain"
              />
            </a>

            {/* Instagram (replaced YouTube) */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-70 transition-all duration-150 hover:opacity-100 hover:scale-110 active:scale-95"
              title="Instagram"
            >
              <img
                src="/Instagram.svg"
                alt="Instagram"
                className="h-[18px] w-[18px] object-contain"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
