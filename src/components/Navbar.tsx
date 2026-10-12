"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "../../lib/auth-client";

const Navbar = () => {
  const { data: session } = authClient.useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLoggedIn = mounted && Boolean(session?.user);

  return (
    <div className="flex justify-center p-4">
      <nav className="flex w-full max-w-[826px] items-center justify-between gap-3 rounded-full border border-white/20 bg-white/35 px-4 py-3 text-white shadow-[0_10px_40px_rgba(0,80,150,0.15)] backdrop-blur-lg transition-[background-color,border-color,color,box-shadow,backdrop-filter] duration-700 ease-out sm:gap-4 sm:px-5 sm:py-3.5">
        <Link
          className="ml-1 flex items-center gap-2 text-[20px] leading-none tracking-[-0.02em] text-black transition-colors duration-700 ease-out sm:ml-2 sm:text-[22px]"
          href="/"
        >
          <img src="/logo.svg" alt="Route" className="h-[32px] w-[32px] shrink-0 object-contain" />
          Route
        </Link>
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
        <div className="flex items-center">
          {isLoggedIn ? (
            <Link
              className="flex items-center gap-2 overflow-hidden rounded-full bg-white px-3.5 py-1.5 text-[12.5px] font-semibold leading-none text-sky-600 shadow-sm transition-all hover:bg-sky-50 active:scale-[0.98] sm:px-4 sm:py-2 sm:text-[13px] lg:px-5 lg:py-3 lg:text-[15px]"
              href="/dashboard"
            >
              {session?.user?.image && (
                <img
                  src={session.user.image}
                  alt={session.user.name || "Avatar"}
                  className="h-4 w-4 rounded-full object-cover sm:h-5 sm:w-5"
                />
              )}
              <span className="block whitespace-nowrap">Dashboard</span>
            </Link>
          ) : (
            <Link
              className="block overflow-hidden rounded-full bg-white px-3.5 py-1.5 text-[12.5px] font-semibold leading-none text-sky-600 shadow-sm transition-colors hover:bg-sky-50 sm:px-4 sm:py-2 sm:text-[13px] lg:px-5 lg:py-3 lg:text-[15px]"
              href="/sign-in"
            >
              <span className="block whitespace-nowrap">Log In</span>
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
