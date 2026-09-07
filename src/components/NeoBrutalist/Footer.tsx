"use client";

import Link from "next/link";

const columns = [
  {
    title: "Reach Out",
    links: [
      { label: "Gmail", href: "#about" },
      { label: "Contact", href: "#team" },
     
    ],
  },
  {
    title: "Pages",
    links: [
      { label: "All Products", href: "#services" },
      { label: "Pricing", href: "#contact" },
      { label: "Blog", href: "#work" },
      { label: "Careers", href: "#contact" },
    ],
  },
  {
    title: "Socials",
    links: [
      { label: "Instagram", href: "https://instagram.com" },
      { label: "Twitter", href: "https://twitter.com" },
      { label: "YouTube", href: "https://youtube.com" },
      { label: "LinkedIn", href: "https://linkedin.com" },
      { label: "Discord", href: "https://discord.com" },
    ],
  },
  {
    title: "Legals",
    links: [
      { label: "Privacy Policy", href: "#privacy" },
      { label: "Terms of service", href: "#terms" },
      { label: "Cookie policy", href: "#cookies" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="min-h-[calc(100svh-16px)] w-full overflow-hidden rounded-none bg-white px-6 py-14 text-[#0a0a0a] sm:px-12 lg:px-[5.8vw] lg:py-14">
      <div className="relative flex min-h-[calc(100svh-128px)] flex-col border-t border-black/10 pt-16 sm:pt-[4.7vw]">
        <div className="relative z-10 grid grid-cols-1 gap-14 lg:grid-cols-[1.35fr_1fr_1fr_1fr_1fr] lg:gap-10">
          <div className="max-w-[370px]">
            <Link
              href="/"
              className="flex items-center gap-1"
              aria-label="OG Engine home"
            >
              <span className="og-footer-logo" aria-hidden="true">
                <img src="/og.svg" alt="" />
              </span>
              <span className="font-sans text-[29px] font-light tracking-[-0.04em] text-[#0a0a0a]">
                Engine
              </span>
            </Link>
            <p className="mt-5 text-[15px] leading-6 text-zinc-500">
              © copyright for OG Engine 2024. All rights reserved.
            </p>
            <div className="mt-11">
              <p className="text-[18px] font-medium tracking-[-0.03em] text-[#0a0a0a]">
                Connect with us
              </p>
              <p className="mt-2 text-[15px] leading-6 text-zinc-500">
                Share your email/contact with us
              </p>
              <form
                onSubmit={(event) => event.preventDefault()}
                className="mt-4 flex h-[60px] w-full max-w-[368px] items-center rounded-[10px] border border-zinc-300 px-5 transition-colors focus-within:border-black"
              >
                <input
                  type="email"
                  aria-label="Your email or contact"
                  placeholder="Enter your email or contact"
                  className="min-w-0 flex-1 bg-transparent text-[16px] text-[#0a0a0a] outline-none placeholder:text-zinc-500"
                />
                <button
                  type="submit"
                  aria-label="Submit contact"
                  className="ml-4 text-[30px] font-light leading-none text-[#0a0a0a] transition-transform hover:translate-x-1"
                >
                  <span aria-hidden="true">→</span>
                </button>
              </form>
            </div>
          </div>
          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="text-[18px] font-semibold tracking-[-0.03em] text-[#0a0a0a]">
                {column.title}
              </h2>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => {
                  const external = link.href.startsWith("http");
                  return (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noopener noreferrer" : undefined}
                        className="text-[16px] leading-6 text-zinc-500 transition-colors hover:text-black"
                      >
                        {link.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          ))}
        </div>
        <div className="og-footer-watermark" aria-hidden="true" />
      </div>
    </footer>
  );
}
