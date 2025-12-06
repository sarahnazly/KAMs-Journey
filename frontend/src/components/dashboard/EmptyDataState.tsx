import React from "react";
import { Button } from "@/components/common/Button";
import { AlertCircle, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const EmptyDataState: React.FC = () => {
  const router = useRouter();

  const handleGoToUpload = () => {
    router.push("/input/upload-file");
  };

  return (
    <div className="w-full flex flex-col items-center justify-center py-16 min-h-[350px]">
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="rounded-full bg-[#E2E8F0] p-4 mb-2">
          <AlertCircle size={60} color="#64748B" />
        </div>
        <div className="text-[22px] font-bold text-[#64748B] text-center">No Data Yet!</div>
        <div className="text-base font-normal text-[#64748B] text-center mb-4">
          No data or result available.
        </div>
      </div>
    </div>
  );
};

export default EmptyDataState;