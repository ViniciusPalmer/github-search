import { ReactNode } from "react";

interface SearchPageShellProps {
  children: ReactNode;
}

export function SearchPageShell({ children }: SearchPageShellProps) {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[radial-gradient(ellipse_125%_110%_at_50%_20%,var(--color-auth-bg-start)_0%,var(--color-auth-bg-mid)_54%,var(--color-auth-bg-end)_100%)] px-5 py-8 font-auth-body text-auth-text-primary sm:px-8 lg:px-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-12%] top-[16%] h-28 w-[560px] rotate-[-17deg] rounded-full bg-auth-violet/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-14%] top-[24%] h-28 w-[600px] rotate-[14deg] rounded-full bg-auth-magenta/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[4%] left-[36%] h-24 w-[520px] rotate-[-8deg] rounded-full bg-auth-cyan/15 blur-3xl"
      />
      <div className="relative z-10 mx-auto flex w-full max-w-[1240px] flex-col gap-12">
        {children}
      </div>
    </main>
  );
}
