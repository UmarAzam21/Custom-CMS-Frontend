"use client";

import { useEffect, useState } from "react";

type Props = {
  open: boolean;
  title?: string;
  message: string;
  duration?: number; // ms, 0 to disable auto-close
  onClose?: () => void;
  variant?: "error" | "success" | "info";
};

export default function Toast({
  open,
  title,
  message,
  duration = 1500,
  onClose,
  variant = "error",
}: Props) {
  const [mounted, setMounted] = useState(open);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    let showTimer: number | undefined;
    let hideTimer: number | undefined;
    let removeTimer: number | undefined;

    if (open) {
      setMounted(true);
      // start enter animation on next tick
      showTimer = window.setTimeout(() => setShown(true), 20);

      if (duration > 0) {
        hideTimer = window.setTimeout(() => setShown(false), duration);
        removeTimer = window.setTimeout(() => {
          setMounted(false);
          onClose?.();
        }, duration + 300);
      }
    } else {
      // trigger exit
      setShown(false);
      removeTimer = window.setTimeout(() => setMounted(false), 300);
    }

    return () => {
      if (showTimer) window.clearTimeout(showTimer);
      if (hideTimer) window.clearTimeout(hideTimer);
      if (removeTimer) window.clearTimeout(removeTimer);
    };
  }, [open, duration, onClose]);

  if (!mounted) return null;

  const bgClass = variant === "error" ? "bg-primary" : variant === "success" ? "bg-primary" : "bg-primary";

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={`transform transition-all duration-300 ease-out ${
          shown ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0"
        }`}
      >
        <div className={`${bgClass} text-white px-4 py-3 rounded-lg shadow-lg max-w-xs flex items-start gap-3`}> 
          <div className="flex-1">
            {title && <div className="text-sm font-semibold">{title}</div>}
            <div className="text-sm">{message}</div>
          </div>
          <button
            aria-label="Close"
            onClick={() => {
              setShown(false);
              window.setTimeout(() => {
                setMounted(false);
                onClose?.();
              }, 300);
            }}
            className="text-white opacity-90 hover:opacity-100 text-xl leading-none"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
