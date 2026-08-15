"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface DropdownItemProps {
  label: string;
  icon?: LucideIcon;
  href?: string;
  onClick?: () => void;
  danger?: boolean;
}

export default function DropdownItem({
  label,
  icon: Icon,
  href,
  onClick,
  danger = false,
}: DropdownItemProps) {
  const classes = `flex w-full items-center gap-2.5 px-4 py-2 text-sm transition-colors text-xs ${
    danger ? "text-red-600 hover:bg-red-50" : "text-slate-700 hover:bg-slate-50"
  }`;

  const content = (
    <>
      {Icon && <Icon size={16} strokeWidth={1.8} />}
      {label}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {content}
    </button>
  );
}