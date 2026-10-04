import React from "react";

const Navbar = () => {
  return (
    <div className="flex justify-center p-4">
      <nav className="flex w-full max-w-[826px] items-center justify-between gap-3 rounded-full border border-white/20 bg-white/35 px-4 py-3 text-white shadow-[0_10px_40px_rgba(0,80,150,0.15)] backdrop-blur-lg transition-[background-color,border-color,color,box-shadow,backdrop-filter] duration-700 ease-out sm:gap-4 sm:px-5 sm:py-3.5">
        <a
          className="font-lastik text-[22px] leading-none tracking-[-0.02em] snip-4f4f-0"
          style={{
            color: "rgb(8, 8, 8)",
            outlineOffset: "2px",
            background:
              "rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box",
            fontSize: "22px",
            fontWeight: 400,
            fontFamily:
              '"Lastik Regular", Caslon, "EB Garamond", "Times New Roman", Times, serif',
            lineHeight: "22px",
            letterSpacing: "-0.44px",
            textAlign: "start",
            border: "0px solid rgb(8, 8, 8)",
            borderTop: "0px solid rgb(8, 8, 8)",
            borderRight: "0px solid rgb(8, 8, 8)",
            borderBottom: "0px solid rgb(8, 8, 8)",
            borderLeft: "0px solid rgb(8, 8, 8)",
            borderColor: "rgb(8, 8, 8)",
            opacity: 1,
            zIndex: "auto",
          }}
          href=""
        >
          Route
        </a>
        <div className="hidden items-center justify-center gap-5 text-[13px] font-semibold tracking-normal sm:flex lg:gap-7 lg:text-[15px]">
          <a
            className="text-black/95 transition-colors duration-700 ease-out hover:text-black"
            href="#how-it-works"
          >
            How it works
          </a>
          <a
            className="text-black/95 transition-colors duration-700 ease-out hover:text-black"
            href="#features"
          >
            Features
          </a>
          <a
            className="text-black/95 transition-colors duration-700 ease-out hover:text-black"
            href="#docs"
          >
            Docs
          </a>
          <a
            className="text-black/95 transition-colors duration-700 ease-out hover:text-black"
            href="#blog"
          >
            Blog
          </a>
        </div>
        <div className="hidden sm:block">
          <a
            className="block overflow-hidden rounded-full bg-white px-4 py-2 text-[13px] font-semibold leading-none text-black shadow-sm transition-colors lg:px-7 lg:py-3 lg:text-[15px]"
            href="/dashboard"
          >
            <span className="block whitespace-nowrap">Log In</span>
          </a>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
