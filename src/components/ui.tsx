import type { ButtonHTMLAttributes, ReactNode } from "react";
import { X } from "lucide-react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`surface ${className}`}>{children}</section>;
}

export function IconButton({ children, className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={`icon-button ${className}`} {...props}>{children}</button>;
}

export function Button({ children, variant = "primary", className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "danger" }) {
  return <button className={`button button-${variant} ${className}`} {...props}>{children}</button>;
}

export function ProgressBar({ value, color = "orange", label, trail = true }: { value: number; color?: "orange" | "purple" | "blue" | "green" | "pink"; label?: string; trail?: boolean }) {
  const capped = Math.min(100, Math.max(0, value));
  return <div className={trail ? "progress-track" : ""} aria-label={label} title={label}><div className={`progress-fill progress-${color}`} style={{ width: `${capped}%` }} /></div>;
}

export function Ring({ value, size = 100, stroke = 9, color = "orange", children }: { value: number; size?: number; stroke?: number; color?: string; children?: ReactNode }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - Math.min(Math.max(value, 0), 100) / 100 * circumference;
  return <div className="ring" style={{ width: size, height: size }}>
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle className="ring-trail" cx={size / 2} cy={size / 2} r={radius} strokeWidth={stroke} fill="none" />
      <circle className={`ring-value ring-${color}`} cx={size / 2} cy={size / 2} r={radius} strokeWidth={stroke} fill="none" strokeDasharray={circumference} strokeDashoffset={progress} />
    </svg>
    <div className="ring-content">{children}</div>
  </div>;
}

export function Modal({ title, onClose, children, wide = false }: { title: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
    <div className={`modal ${wide ? "modal-wide" : ""}`} role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => event.stopPropagation()}>
      <div className="modal-heading"><h2>{title}</h2><IconButton aria-label="Close dialog" onClick={onClose}><X size={19} /></IconButton></div>
      {children}
    </div>
  </div>;
}

export function PageHeading({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return <div className="page-heading"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1>{description && <p className="subtle">{description}</p>}</div>{action && <div className="page-action">{action}</div>}</div>;
}

export function Pill({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "orange" | "purple" | "green" | "blue" }) {
  return <span className={`pill pill-${tone}`}>{children}</span>;
}
