"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Ganti dengan cara cek status upload sesuai kebutuhan (localStorage, cookie, API, dsb)
function hasUploadedFile(): boolean {
  // Contoh: pakai localStorage
  if (typeof window !== "undefined") {
    return !!localStorage.getItem("hasUploadedExcelFile");
  }
  return false;
}

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Pengecekan status upload
    if (hasUploadedFile()) {
      router.replace("/journey");
    } else {
      router.replace("/input/upload-file");
    }
  }, [router]);

  return null;
}