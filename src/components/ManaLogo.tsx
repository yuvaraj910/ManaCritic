type ManaLogoProps = {
  size?: number;
  className?: string;
  title?: string;
};

/** A compact energy mark: an ascending M held in a faceted mana crystal. */
export function ManaLogo({ size = 32, className = "", title = "Mana Critic" }: ManaLogoProps) {
  const gradientId = "mana-mark-gradient";
  return <svg className={`mana-logo ${className}`} width={size} height={size} viewBox="0 0 40 40" role="img" aria-label={title} focusable="false">
    <defs><linearGradient id={gradientId} x1="6" y1="34" x2="34" y2="5" gradientUnits="userSpaceOnUse"><stop stopColor="#7652dc" /><stop offset=".48" stopColor="#9b67e8" /><stop offset="1" stopColor="#ff6b35" /></linearGradient></defs>
    <path d="M20 2.8 35.1 11v18L20 37.2 4.9 29V11L20 2.8Z" fill={`url(#${gradientId})`} />
    <path d="M10.5 26.8 16.7 13l3.3 7.3 3.3-7.3 6.2 13.8" fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.3" />
  </svg>;
}
