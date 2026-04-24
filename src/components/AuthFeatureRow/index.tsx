const MARKER_CLASSES = {
  violet: "bg-auth-violet shadow-[0_0_18px_var(--color-auth-violet)]",
  magenta: "bg-auth-magenta shadow-[0_0_18px_var(--color-auth-magenta)]",
  cyan: "bg-auth-cyan shadow-[0_0_18px_var(--color-auth-cyan)]",
} as const;

interface AuthFeatureRowProps {
  tone: keyof typeof MARKER_CLASSES;
  label: string;
  value: string;
}

export function AuthFeatureRow({
  tone,
  label,
  value,
}: AuthFeatureRowProps) {
  return (
    <div className="flex items-center gap-3 rounded-auth-control border border-auth-border bg-auth-terminal/70 px-3 py-2">
      <span
        aria-hidden="true"
        className={`h-2.5 w-2.5 shrink-0 rounded-full ${MARKER_CLASSES[tone]}`}
      />
      <div className="min-w-0 text-left">
        <p className="font-auth-label text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-auth-text-muted">
          {label}
        </p>
        <p className="truncate font-auth-body text-sm font-medium text-auth-text-primary">
          {value}
        </p>
      </div>
    </div>
  );
}
