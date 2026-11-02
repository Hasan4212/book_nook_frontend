import Link from "next/link";

function BookLogo() {
  return (
    <span className="grid size-8 place-items-center rounded-lg bg-[#8fd0a0]">
      <svg
        className="size-5 text-[#122a1f]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    </span>
  );
}

const CONTACT_ITEMS = [
  {
    icon: (
      <>
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </>
    ),
    text: "hello@booknook.app",
    href: "mailto:hello@booknook.app",
  },
  {
    icon: (
      <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
    ),
    text: "+880 1700 000 000",
    href: "tel:+8801700000000",
  },
  {
    icon: (
      <>
        <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
        <circle cx="12" cy="10" r="3" />
      </>
    ),
    text: "12 Reading Lane, Dhaka",
    href: "https://maps.google.com/?q=Dhaka",
  },
];

const SOCIAL_LINKS = [
  {
    label: "X (Twitter)",
    href: "https://x.com",
    icon: (
      <svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: (
      <svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M13.5 21.888c4.783-.74 8.5-4.892 8.5-9.888 0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.996 3.657 9.148 8.438 9.888v-6.994H7.898V12h2.54V9.797c0-2.506 1.492-3.89 3.774-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.894H13.5z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect width="20" height="20" x="2" y="2" rx="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-white/10 bg-[#111a14]">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-[1.2fr_1fr_1fr]">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2">
            <BookLogo />
            <span className="font-serif text-xl font-semibold text-white">
              BookNook
            </span>
          </div>

          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
            A small neighbourhood library on the web. Share the books on your
            shelf and borrow the ones you have been meaning to read.
          </p>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-serif text-lg font-semibold text-white">
            Contact
          </h3>

          <ul className="mt-4 space-y-3">
            {CONTACT_ITEMS.map((item) => (
              <li key={item.text}>
                <a
                  href={item.href}
                  className="group flex items-center gap-2.5 text-sm text-white/60 transition-colors hover:text-white"
                >
                  <svg
                    className="size-4 shrink-0 text-white/50 transition-colors group-hover:text-[#8fd0a0]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {item.icon}
                  </svg>
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Follow us */}
        <div>
          <h3 className="font-serif text-lg font-semibold text-white">
            Follow us
          </h3>

          <div className="mt-4 flex gap-3">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                className="grid size-9 place-items-center rounded-full border border-white/20 text-white/70 transition hover:border-[#8fd0a0] hover:bg-white/10 hover:text-white"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
