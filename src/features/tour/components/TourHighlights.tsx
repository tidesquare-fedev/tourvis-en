'use client';

import { Check } from 'lucide-react';

type TourHighlightsProps = {
  highlights: string[];
  title?: string;
  detail?: string;
};

export function TourHighlights({
  highlights,
  title,
  detail,
}: TourHighlightsProps) {
  return (
    <div className="mb-6 md:mb-8 p-3 md:p-4 bg-blue-50 rounded-lg min-w-0">
      <h3 className="text-base md:text-lg font-semibold mb-3 text-blue-950">
        Highlights
      </h3>
      {title && (
        <div className="text-blue-950 font-semibold text-sm md:text-base mb-3 break-words">
          {title}
        </div>
      )}
      {detail ? (
        <div
          className="text-blue-950/90 text-sm md:text-base leading-relaxed [&_ul]:space-y-1.5 md:[&_ul]:space-y-2 [&_li]:flex [&_li]:items-start [&_li]:gap-2 [&_li]:list-none [&_li]:leading-relaxed [&_li]:text-blue-950 [&_li]:before:content-['✓'] [&_li]:before:text-blue-950 [&_li]:before:mt-0.5"
          dangerouslySetInnerHTML={{ __html: detail }}
        />
      ) : (
        <ul className="space-y-1.5 md:space-y-2">
          {highlights.map((highlight, index) => (
            <li key={index} className="flex items-start">
              <Check className="w-4 h-4 text-blue-950 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-blue-950 text-sm md:text-base leading-relaxed">
                {highlight}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
