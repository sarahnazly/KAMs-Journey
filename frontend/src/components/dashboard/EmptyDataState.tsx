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
          Upload a file and run processing to see analysis results.
        </div>
        <Button
          variant="primary"
          size="lg"
          onClick={handleGoToUpload}
          className="flex items-center gap-2 px-6 py-3 text-base font-semibold"
        >
          Go to Upload File Page
          <ArrowRight size={20} />
        </Button>
      </div>
    </div>
  );
};

export default EmptyDataState;