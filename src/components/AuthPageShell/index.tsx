import { ReactNode } from "react";

interface AuthPageShellProps {
  children: ReactNode;
}

export function AuthPageShell({ children }: AuthPageShellProps) {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[radial-gradient(ellipse_125%_110%_at_50%_28%,var(--color-auth-bg-start)_0%,var(--color-auth-bg-mid)_52%,var(--color-auth-bg-end)_100%)] px-5 py-10 font-auth-body text-auth-text-primary sm:px-8 lg:py-[86px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-14%] top-[14%] h-24 w-[520px] rotate-[-18deg] rounded-full bg-auth-violet/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-12%] top-[18%] h-28 w-[560px] rotate-[16deg] rounded-full bg-auth-magenta/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[2%] left-[40%] h-20 w-[480px] rotate-[-10deg] rounded-full bg-auth-cyan/15 blur-3xl"
      />
      <div className="relative z-10 mx-auto flex w-full max-w-[680px] justify-center">
        {children}
      </div>
    </main>
  );
}
