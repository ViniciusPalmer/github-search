interface BrandEyebrowProps {
  children: string;
}

export function BrandEyebrow({ children }: BrandEyebrowProps) {
  return (
    <p className="font-auth-label text-xs font-semibold uppercase tracking-[0.34em] text-auth-eyebrow">
      {children}
    </p>
  );
}
