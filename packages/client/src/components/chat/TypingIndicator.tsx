import React from 'react';

const TypingIndicator = () => {
  return (
    <div className="flex gap-1 px-3 py-3 rounded-xl bg-gray-100 text-black self-start">
      <Dot />
      <Dot additionalClassName="[animation-delay:0.2s]" />
      <Dot additionalClassName="[animation-delay:0.4s]" />
    </div>
  );
};

type DotProps = {
  additionalClassName?: string;
};

const Dot = ({ additionalClassName }: DotProps) => (
  <div
    className={`w-2 h-2 rounded-full bg-gray-800 animate-pulse ${additionalClassName}`}
  ></div>
);
export default TypingIndicator;
