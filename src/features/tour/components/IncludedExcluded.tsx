'use client';

import { Check, X } from 'lucide-react';

type IncludedExcludedProps = {
  included: string[];
  excluded: string[];
};

export function IncludedExcluded({
  included,
  excluded,
}: IncludedExcludedProps) {
  // 값이 있는 항목만 필터링
  const hasIncluded = included && included.length > 0;
  const hasExcluded = excluded && excluded.length > 0;

  // 둘 다 값이 없으면 컴포넌트 자체를 렌더링하지 않음
  if (!hasIncluded && !hasExcluded) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center">
          <Check className="w-4 h-4 text-gray-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">
          What's Included & Not Included
        </h3>
      </div>

      <div
        className={`grid gap-8 ${hasIncluded && hasExcluded ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}
      >
        {/* What's Included - 값이 있을 때만 렌더링 */}
        {hasIncluded && (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              What's Included
            </h4>
            <div className="space-y-3">
              {included.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-gray-900 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-base leading-relaxed">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* What's Not Included - 값이 있을 때만 렌더링 */}
        {hasExcluded && (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              What's <span style={{ color: '#ff00cc' }}>Not</span> Included
            </h4>
            <div className="space-y-3">
              {excluded.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <X className="w-4 h-4 text-gray-900 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-base leading-relaxed">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
