interface AuthStatCardProps {
  value: string;
  label: string;
}

export function AuthStatCard({ value, label }: AuthStatCardProps) {
  return (
    <div className="rounded-auth-control border border-auth-border bg-auth-terminal-tile px-4 py-3 text-left">
      <p className="font-auth-title text-lg font-bold leading-none text-auth-text-primary">
        {value}
      </p>
      <p className="mt-1 font-auth-label text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-auth-text-muted">
        {label}
      </p>
    </div>
  );
}
