import React from 'react'

const Svg1 = () => {
  return (
    <div className="relative isolate h-full min-h-[190px] overflow-hidden rounded-[24px] border border-black/[0.045] bg-[#f0f9ff] p-5 text-[#121212] sm:min-h-[220px] sm:rounded-[32px] sm:p-8">
      <div className="relative z-10 h-full">
        <picture>
          <img
            className="pointer-events-none absolute hidden h-64 w-64 object-contain object-left-top lg:-top-1 lg:left-2 lg:block"
            alt=""
            src="https://make.design/graphics/second_card/top.png"
          />
        </picture>
        <div className="relative grid h-full gap-5 py-2 sm:gap-6 sm:py-0 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div>
            <div className="[&_h3]:leading-[1.18]">
              <h3 className="font-instrument text-[22px] font-medium leading-[1.08] tracking-[-0.04em] text-[#151515] sm:text-[28px] sm:leading-[1.05] sm:tracking-[-0.045em]">
                <span className="block text-sky-600">Edit your design</span>
                <span className="block text-[#17152A]">through chat.</span>
              </h3>
            </div>
            <p className="mt-3 max-w-[360px] text-[13.5px] font-medium leading-[1.42] tracking-[-0.02em] text-[#373737]/70 sm:text-[15px] sm:leading-[1.45] sm:tracking-[-0.025em]">
              Ask to write a headline, change a layout, update a button, or turn the same idea into marketing assets.
            </p>
          </div>

          <div className="flex w-full max-w-[560px] min-w-0 flex-col gap-3 justify-self-center lg:max-w-none lg:justify-self-auto">
            <div className="flex w-full min-w-0 items-start justify-end gap-1.5 sm:gap-2">
              <span className="shrink-0">
                <svg viewBox="0 0 36 36" className="h-8 w-8 sm:h-9 sm:w-9" aria-hidden="true">
                  <defs>
                    <clipPath id="user-avatar-clip">
                      <circle cx="18" cy="18" r="17" />
                    </clipPath>
                  </defs>
                  <circle cx="18" cy="18" r="17" fill="#FDE8D3" />
                  <g clipPath="url(#user-avatar-clip)">
                    <circle cx="18" cy="14.4" r="6.6" fill="#FBD3B3" stroke="#111111" strokeWidth="1.5" />
                    <path
                      d="M11.4 12.4 Q11.4 7 18 7 Q24.6 7 24.6 12.4 Q22.4 10.2 18 10.2 Q13.6 10.2 11.4 12.4 Z"
                      fill="#3A2A1F"
                    />
                    <circle cx="15.9" cy="14.3" r="0.95" fill="#111111" />
                    <circle cx="20.1" cy="14.3" r="0.95" fill="#111111" />
                    <path
                      d="M15.9 16.7 Q18 18.1 20.1 16.7"
                      stroke="#111111"
                      strokeWidth="1.1"
                      fill="none"
                      strokeLinecap="round"
                    />
                    <path d="M1.5 36 C1.5 27.8 9 20 18 20 C27 20 34.5 27.8 34.5 36 Z" fill="#A8C8F0" />
                    <path
                      d="M1.5 36 C1.5 27.8 9 20 18 20 C27 20 34.5 27.8 34.5 36"
                      fill="none"
                      stroke="#111111"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </g>
                  <circle cx="18" cy="18" r="17" fill="none" stroke="#111111" strokeWidth="2" />
                </svg>
              </span>
            </div>

            <div className="flex w-full min-w-0 items-start gap-1.5 sm:gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white sm:h-9 sm:w-9">
                <img
                  className="h-6 w-6 object-contain sm:h-7 sm:w-7"
                  alt=""
                  src="https://make.design/icon.png"
                />
              </div>
            </div>

            <div className="flex min-w-0 items-end gap-2 sm:gap-3">
              <picture className="shrink-0">
                <img
                  className="h-16 w-16 object-contain sm:h-24 sm:w-24"
                  alt=""
                  src="https://make.design/graphics/second_card/character.png"
                />
              </picture>
              <picture className="min-w-0 flex-1">
                <img
                  className="w-full rounded-xl object-contain"
                  alt=""
                  src="https://make.design/graphics/second_card/dashboard.png"
                />
              </picture>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Svg1