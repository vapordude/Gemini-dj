import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
}

function Svg({ size = 24, className = '', children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {children}
    </svg>
  );
}

export function Send({ size, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </Svg>
  );
}

export function Music({ size, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </Svg>
  );
}

export function Sparkles({ size, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </Svg>
  );
}

export function Mic({ size, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </Svg>
  );
}

export function X({ size, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </Svg>
  );
}

export function Zap({ size, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </Svg>
  );
}

export function Play({ size, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <polygon points="6 3 20 12 6 21 6 3" />
    </Svg>
  );
}

export function Pause({ size, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <rect x="14" y="4" width="4" height="16" rx="1" />
      <rect x="6" y="4" width="4" height="16" rx="1" />
    </Svg>
  );
}

export function Disc({ size, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="3" />
    </Svg>
  );
}

export function Activity({ size, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
    </Svg>
  );
}

export function Repeat({ size, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <path d="m17 2 4 4-4 4" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <path d="m7 22-4-4 4-4" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </Svg>
  );
}

export function Search({ size, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </Svg>
  );
}

export function Plus({ size, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </Svg>
  );
}

export function List({ size, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <line x1="8" x2="21" y1="6" y2="6" />
      <line x1="8" x2="21" y1="12" y2="12" />
      <line x1="8" x2="21" y1="18" y2="18" />
      <line x1="3" x2="3.01" y1="6" y2="6" />
      <line x1="3" x2="3.01" y1="12" y2="12" />
      <line x1="3" x2="3.01" y1="18" y2="18" />
    </Svg>
  );
}

export function User({ size, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </Svg>
  );
}

export function ChevronLeft({ size, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <path d="m15 18-6-6 6-6" />
    </Svg>
  );
}

export function PlayCircle({ size, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <circle cx="12" cy="12" r="10" />
      <polygon points="10 8 16 12 10 16 10 8" />
    </Svg>
  );
}
