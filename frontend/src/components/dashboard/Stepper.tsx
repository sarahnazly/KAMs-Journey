import React from "react";
import clsx from "clsx";

interface Step {
  title: string;
  description: string;
}

interface StepperProps {
  steps: Step[];
  activeStep: number;
  onStepChange?: (step: number) => void;
}

const Stepper: React.FC<StepperProps> = ({ steps, activeStep, onStepChange }) => {
  if (!steps || steps.length === 0) {
    return null;
  }

  return (
    <div className="w-full relative" style={{ height: '149.43px' }}>
      <div className="flex items-start justify-between relative">
        {steps.map((step, index) => {
          const isActive = index === activeStep;
          const isCompleted = index < activeStep;
          const isInactive = index > activeStep;

          return (
            <div
              key={index}
              className="flex flex-col items-center text-center relative"
              style={{ flex: 1, maxWidth: '315.44px' }}
            >
              {/* Circle number */}
              <div
                className={clsx(
                  "flex items-center justify-center rounded-full font-bold text-white z-10 mx-auto cursor-pointer",
                  isActive && "bg-[#02214C]",
                  isCompleted && "bg-[#02214C]",
                  isInactive && "bg-[#AAB9D5]"
                )}
                style={{ 
                  width: '53.22px', 
                  height: '55.73px',
                  fontSize: '29.72px', 
                  lineHeight: '35.67px',
                  fontWeight: '700'
                }}
                onClick={() => {
                  if (onStepChange && (isCompleted || isActive)) {
                    onStepChange(index);
                  }
                }}
              >
                {index + 1}
              </div>

              {/* Title */}
              <div
                className="font-bold text-black"
                style={{ 
                  fontSize: '22.29px', 
                  lineHeight: '26.75px',
                  fontWeight: '700',
                  marginTop: '15.27px'
                }}
              >
                {step.title}
              </div>

              {/* Description */}
              <div
                className="text-[#64748B] font-normal"
                style={{ 
                  fontSize: '16px', 
                  lineHeight: '22.29px',
                  fontWeight: '400',
                  marginTop: '7.43px'
                }}
              >
                {step.description}
              </div>
            </div>
          );
        })}
      </div>

      {/* Connecting lines */}
      <div className="absolute" style={{ top: '27.86px', left: 0, right: 0 }}>
        {steps.map((_, index) => {
          if (index === steps.length - 1) return null;
          
          const isCompleted = index < activeStep;
          const lineWidth = `calc((100% - ${steps.length * 53.22}px) / ${steps.length - 1})`;
          const leftPosition = `calc(${index} * (100% / ${steps.length}) + ${53.22 / 2}px + ${index} * ${53.22}px / ${steps.length})`;

          return (
            <div
              key={`line-${index}`}
              className={clsx(
                "absolute",
                isCompleted ? "bg-[#02214C]" : "bg-[#AAB9D5]"
              )}
              style={{
                height: '10px',
                width: lineWidth,
                left: `calc(${(index + 1) * (100 / steps.length)}% - ${(100 / steps.length) / 2}%)`,
                top: 0,
                outline: `5px solid ${isCompleted ? '#02214C' : '#AAB9D5'}`,
                outlineOffset: '-5px'
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;