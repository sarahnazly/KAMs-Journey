import React, { ReactNode } from "react";
import { Button } from "../common/Button";

interface PopUpWindowProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const PopUpWindow: React.FC<PopUpWindowProps> = ({
  title,
  isOpen,
  onClose,
  children,
}) => {
  if (!isOpen) return null;

  return ( 
    <> 
      <div className="fixed inset-0 bg-black/40 z-40 pointer-events-none"></div> 
      
      {/* Container */} 
      <div className="fixed inset-0 z-50 flex items-center justify-center"> 
        <div className="bg-white rounded-[15px] w-[90%] md:w-[60%] max-h-[90vh] overflow-y-auto p-8 shadow-lg flex flex-col"> 
          
          {/* Title */} 
          <div className="flex justify-between items-center mb-6"> 
            <h2 className="text-[#2C2966] text-2xl font-bold font-inter leading-[28.8px]"> 
              {title} 
            </h2> 
          </div> 
            
            {/* Content */} 
            <div className="flex-1">{children}</div> 
            
            {/* Close button */} 
            <div className="flex justify-end mt-6"> 
              <Button 
                onClick={onClose} 
                variant="primary"
                size="sm"
              > 
                Tutup 
              </Button> 
          </div> 
        </div> 
      </div> 
    </> 
  ); 
};

export default PopUpWindow;