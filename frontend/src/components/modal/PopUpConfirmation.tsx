"use client";

import React from "react";

interface PopupConfirmationProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  onClose?: () => void;
}

const PopupConfirmation: React.FC<PopupConfirmationProps> = ({
  open,
  title,
  message,
  confirmLabel = "Ya",
  cancelLabel = "Kembali",
  onConfirm,
  onCancel,
  onClose,
}) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center"
      style={{ 
        width: "100vw",
        height: "100vh",
        background: "rgba(0, 0, 0, 0.50)",
        fontFamily: "Inter, Arial, Helvetica, sans-serif" 
    }}
    >
      {/* Popup panel */}
      <div
        className="relative w-[377px] bg-white rounded-[15px] outline outline-1 outline-[#CBD5E1] shadow-lg flex flex-col items-center px-[30px] py-[30px] gap-[32px]"
      >
        {/* Tombol Tutup */}
        <button
          className="absolute top-4 right-4 p-1 rounded transition hover:bg-[#F1F5F9]"
          aria-label="Tutup"
          onClick={onClose || onCancel}
        >
          {/* X Icon - tailwind icon */}
          <svg width={24} height={24} fill="none" viewBox="0 0 24 24">
            <path d="M6 6L18 18M18 6L6 18" stroke="#64748B" strokeWidth={2} strokeLinecap="round" />
          </svg>
        </button>

        {/* Icon alert di atas */}
        <div className="flex items-center justify-center mb-2">
          {/* Heroicons Exclamation Circle */}
          <div className="w-[80px] h-[80px] flex items-center justify-center relative">
            <div className="absolute left-[7.5px] top-[7.5px] w-[65px] h-[65px] rounded-full bg-[#D62828]" />
            <svg
              className="relative"
              width={65}
              height={65}
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12 9v4m0 4h.01"
                stroke="#fff"
                strokeWidth={2.2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Judul dan pesan */}
        <div className="flex flex-col items-center gap-2 w-full">
          <div className="text-center text-black text-[24px] font-bold leading-[28.8px]">
            {title}
          </div>
          <div className="text-center text-[#64748B] text-[16px] font-normal leading-[24px]">
            {message}
          </div>
        </div>

        {/* Tombol aksi */}
        <div className="flex flex-row gap-[32px] w-full">
          <button
            className="flex-1 py-2 px-10 rounded-[10px] outline outline-2 outline-[#02214C] outline-offset-[-2px] bg-white text-[#0F172A] text-[16px] font-semibold leading-6 transition hover:bg-[#F1F5F9]"
            onClick={onCancel}
            type="button"
          >
            {cancelLabel}
          </button>
          <button
            className="flex-1 py-2 px-10 rounded-[10px] bg-[#02214C] text-white text-[16px] font-semibold leading-6 transition hover:bg-[#16396E]"
            onClick={onConfirm}
            type="button"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupConfirmation;