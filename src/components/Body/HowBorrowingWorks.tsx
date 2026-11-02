const STEPS = [
  {
    step: "Step 1",
    title: "Find a book",
    description: "Browse the shelf and open any book you like.",
    icon: (
      <path d="m21 21-4.34-4.34" />
    ),
    extraIcon: (
      <>
        <circle cx="11" cy="11" r="8" />
      </>
    ),
  },
  {
    step: "Step 2",
    title: "Borrow it",
    description: "Confirm the borrow. The book is yours for 7 days.",
    icon: <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />,
    extraIcon: (
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    ),
  },
  {
    step: "Step 3",
    title: "Return it",
    description: "Done reading? Return it from My Borrows in one click.",
    icon: <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />,
    extraIcon: <path d="M21 3v5h-5" />,
  },
];

const HowBorrowingWorks = () => {
  return (
    <section className="w-full bg-[#131e17] py-16">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="text-center">
          <h2 className="font-serif text-4xl font-bold text-white">
            How Borrowing Works
          </h2>
          <p className="mt-3 text-sm text-white/60">
            Three steps. No library card needed.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {STEPS.map((item) => (
            <div
              key={item.step}
              className="rounded-lg border border-white/10 bg-white/[0.03] px-8 py-8 text-center"
            >
              <div className="mx-auto grid size-12 place-items-center rounded-full bg-[#8fd0a0]">
                <svg
                  className="size-6 text-[#122a1f]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {item.extraIcon}
                  {item.icon}
                </svg>
              </div>

              <p className="mt-4 text-xs font-medium text-[#ef8b69]">
                {item.step}
              </p>

              <h3 className="mt-1 font-serif text-xl font-bold text-white">
                {item.title}
              </h3>

              <p className="mt-2 text-sm text-white/60">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowBorrowingWorks;
