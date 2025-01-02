// src/app/dashboard/scan/page.tsx
import Scanner from '@/components/dashboard/Scanner';

export default function ScanPage() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 border-b border-slate-100 bg-white px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="mt-2 text-sm sm:text-base text-slate-600">
          </p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <Scanner />
      </div>
    </div>
  );
}