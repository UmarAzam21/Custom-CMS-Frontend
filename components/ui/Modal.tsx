"use client";
import Image from "next/image";

type Props = {
  open: boolean;
  title: string;
  description: string;
  primaryLabel?: string;
  onClose: () => void;
  onResend?: () => void;
  onPrimary?: () => void;
};

export default function Modal({ open, title, description, primaryLabel = "OK", onClose, onResend, onPrimary }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 h-full flex items-center justify-center bg-black/40 p-4">
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl ring-1 ring-black/10">
        <button
          type="button"
          onClick={onClose}
          className="absolute text-lg right-4 top-4 text-gray-400 hover:text-gray-700"
          aria-label="Close dialog"
        >
          ×
        </button>
        <div className="text-center">
            <Image
            width={48}
            height={48}
            src="/primary-logo.png"
            className="mx-auto mb-4"
            alt="Model"
            />
          <div className="mb-4 text-xl font-semibold text-gray-900">{title}</div>
          <p className="text-sm leading-6 text-gray-600">{description}</p>
        </div>
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={onPrimary ?? onClose}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-26 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#a50d24] transition-colors"
          >
            {primaryLabel}
          </button>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Don’t receive an email?{' '}
            <button
              type="button"
              onClick={onResend}
              className="font-semibold text-primary hover:underline"
            >
              Resend
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
