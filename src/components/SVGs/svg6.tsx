import React from 'react'

const Svg6 = () => {
  return (
    <div className="flex h-full flex-col justify-between">
      <div>
        <div className="[&_h3]:leading-[1.18]">
          <h3 className="font-instrument-sans text-[22px] font-medium leading-[1.08] tracking-[-0.04em] sm:text-[28px] sm:leading-[1.05] sm:tracking-[-0.045em]">
            <span className="block text-[#064D2A] sm:whitespace-nowrap">
              Turn activities 
            </span>
            <span className="block text-[#17834D]">
              into insights.
            </span>
          </h3>
        </div>

        <p className="font-instrument-sans mt-4 max-w-[360px] text-[13.5px] font-medium leading-[1.42] tracking-[-0.02em] text-[#373737]/70 sm:text-[15px] sm:leading-[1.45] sm:tracking-[-0.025em]">
          Understand which pages attract attention, where users drop off, and what actions matter most.
        </p>
      </div>

      <div className="relative mt-4 flex flex-1 items-center justify-center">
        <picture className="w-full flex justify-center">
          <img
            className="pointer-events-none h-auto max-h-[200px] w-full max-w-[320px] object-contain object-top"
            src="https://make.design/graphics/third_card/graphic.png"
            alt=""
          />
        </picture>
        <picture>
          <img
            className="pointer-events-none absolute left-0 top-3 h-12 w-auto -rotate-[-18deg] object-contain sm:h-14 lg:h-12"
            src=""
            alt=""
          />
        </picture>
      </div>
    </div>
  )
}

export default Svg6