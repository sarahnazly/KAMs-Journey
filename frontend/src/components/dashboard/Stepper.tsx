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

const scale = 0.89;
const circleWidth = 53.22 * scale; 
const circleHeight = 55.73 * scale; 
const fontSizeCircle = 29.72 * scale; 
const lineHeightCircle = 35.67 * scale; 
const maxWidth = 315.44 * scale; 
const fontSizeTitle = 22.29 * scale; 
const lineHeightTitle = 26.75 * scale;
const marginTopTitle = 15.27 * scale; 
const fontSizeDesc = 16 * scale;
const lineHeightDesc = 22.29 * scale;
const marginTopDesc = 7.43 * scale; 
const connectLineTop = 27.86 * scale; 
const connectLineHeight = 10 * scale; 
const outlineWidth = 5 * scale; 
const outlineOffset = -5 * scale; 

const Stepper: React.FC<StepperProps> = ({ steps, activeStep, onStepChange }) => {
  if (!steps || steps.length === 0) {
    return null;
  }

  return (
    <div className="w-full relative" style={{ height: `${149.43 * scale}px` }}>
      <div className="flex items-start justify-between relative">
        {steps.map((step, index) => {
          const isActive = index === activeStep;
          const isCompleted = index < activeStep;
          const isInactive = index > activeStep;

          return (
            <div
              key={index}
              className="flex flex-col items-center text-center relative"
              style={{ flex: 1, maxWidth: `${maxWidth}px` }}
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
                  width: `${circleWidth}px`,
                  height: `${circleHeight}px`,
                  fontSize: `${fontSizeCircle}px`,
                  lineHeight: `${lineHeightCircle}px`,
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
                  fontSize: `${fontSizeTitle}px`,
                  lineHeight: `${lineHeightTitle}px`,
                  fontWeight: '700',
                  marginTop: `${marginTopTitle}px`
                }}
              >
                {step.title}
              </div>

              {/* Description */}
              <div
                className="text-[#64748B] font-normal"
                style={{
                  fontSize: `${fontSizeDesc}px`,
                  lineHeight: `${lineHeightDesc}px`,
                  fontWeight: '400',
                  marginTop: `${marginTopDesc}px`
                }}
              >
                {step.description}
              </div>
            </div>
          );
        })}
      </div>

      {/* Connecting lines */}
      <div className="absolute" style={{ top: `${connectLineTop}px`, left: 0, right: 0 }}>
        {steps.map((_, index) => {
          if (index === steps.length - 1) return null;

          const isCompleted = index < activeStep;
          const lineWidth = `calc((100% - ${steps.length * circleWidth}px) / ${steps.length - 1})`;

          return (
            <div
              key={`line-${index}`}
              className={clsx(
                "absolute",
                isCompleted ? "bg-[#02214C]" : "bg-[#AAB9D5]"
              )}
              style={{
                height: `${connectLineHeight}px`,
                width: lineWidth,
                left: `calc(${(index + 1) * (100 / steps.length)}% - ${(100 / steps.length) / 2}%)`,
                top: 0,
                outline: `${outlineWidth}px solid ${isCompleted ? '#02214C' : '#AAB9D5'}`,
                outlineOffset: `${outlineOffset}px`
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;