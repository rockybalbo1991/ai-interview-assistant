import React from 'react';

// Simple "Notes" style screen shown when stealth mode is enabled.
// This screen is intentionally generic and does not expose ManuGPT or AI usage.
const StealthScreen = () => {
  return (
    <div className="flex h-screen bg-[#181818] text-gray-100">
      <div className="max-w-3xl mx-auto w-full flex flex-col justify-center px-4">
        <div className="mb-4">
          <h1 className="text-2xl font-semibold tracking-tight mb-1">Notes</h1>
          <p className="text-sm text-gray-400">
            Quick notes for the day.
          </p>
        </div>
        <div className="bg-[#202020] border border-gray-800 rounded-lg p-3 min-h-[260px]">
          <textarea
            className="w-full h-64 bg-transparent outline-none resize-none text-sm text-gray-100 placeholder:text-gray-500"
            placeholder="Write your notes here..."
          />
        </div>
        <p className="mt-3 text-[11px] text-gray-500">
          Tip: Press <span className="font-semibold">Ctrl + Shift + H</span> again to exit.
        </p>
      </div>
    </div>
  );
};

export default StealthScreen;
