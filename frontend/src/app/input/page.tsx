"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function InputIndexPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/input/upload-file");
  }, [router]);
  return null;
}