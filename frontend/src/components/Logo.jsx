import React from 'react';

// Simple reusable logo component for M-GPT / ManuGPT
// Uses the user-provided logo image hosted on Emergent
const LOGO_IMAGE_URL = "https://customer-assets.emergentagent.com/job_smart-dialogue-32/artifacts/o8w6x6tg_M-GPT%20Image%20Nov%2030%2C%202025%2C%2010_09_49%20AM.png";

const sizeClasses = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-24 h-24',
};

/**
 * Logo component
 *
 * Props:
 * - size: 'xs' | 'sm' | 'md' | 'lg' (default: 'md')
 * - showText: whether to show the "M-GPT / AI INTELLIGENCE" text (default: true)
 */
const Logo = ({ size = 'md', showText = true }) => {
  const sizeClass = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`inline-flex items-center ${size === 'lg' ? 'gap-4 flex-col sm:flex-row' : 'gap-2'}`}>
      <div
        className={`${sizeClass} rounded-2xl bg-[#F5EFE3] flex items-center justify-center overflow-hidden shadow-md`}
      >
        <img
          src={LOGO_IMAGE_URL}
          alt="M-GPT logo"
          className="w-full h-full object-contain"
        />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span
            className={`font-semibold tracking-tight text-white ${
              size === 'lg' ? 'text-2xl' : 'text-sm'
            }`}
          >
            M-GPT
          </span>
          <span
            className={`${
              size === 'lg' ? 'text-xs' : 'text-[10px]'
            } text-gray-400 uppercase tracking-[0.18em]`}
          >
            AI INTELLIGENCE
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
