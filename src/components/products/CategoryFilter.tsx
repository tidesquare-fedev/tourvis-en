import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Mountain, Landmark, Leaf, Map, List } from 'lucide-react';

interface CategoryFilterProps {
  value: string;
  onChange: (value: string) => void;
  options?: string[];
  variant?: 'list' | 'pills';
}

export const CategoryFilter = ({
  value,
  onChange,
  options,
  variant = 'list',
}: CategoryFilterProps) => {
  const categories =
    Array.isArray(options) && options.length > 0
      ? [
          { value: 'all', label: 'All', Icon: List },
          ...options.map(label => ({ value: label, label, Icon: List })),
        ]
      : [
          { value: 'all', label: 'All', Icon: List },
          { value: 'Adventure', label: 'Adventure', Icon: Mountain },
          { value: 'Cultural', label: 'Cultural', Icon: Landmark },
          { value: 'Nature', label: 'Nature', Icon: Leaf },
          { value: 'Historical', label: 'Historical', Icon: Map },
        ];

  if (variant === 'pills') {
    return (
      <div>
        <div className="text-xs font-semibold text-gray-500 mb-1.5 tracking-wide">
          Categories
        </div>
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide no-scrollbar">
          {categories.map(({ value: v, label }) => {
            const selected =
              (value || 'all') === v || (v !== 'all' && value === v);
            return (
              <button
                key={v}
                type="button"
                onClick={() => onChange(v === 'all' ? '' : v)}
                className={`whitespace-nowrap px-2.5 py-1 rounded-full border text-xs transition-colors ${
                  selected
                    ? 'bg-[#01c5fd] border-[#01c5fd] text-white'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Sidebar style list
  return (
    <div>
      <div className="text-xs font-semibold text-gray-500 mb-2 tracking-wide">
        CATEGORY
      </div>
      <nav className="space-y-1">
        {categories.map(({ value: v, label, Icon }) => {
          const selected =
            (value || 'all') === v || (v !== 'all' && value === v);
          return (
            <button
              key={v}
              type="button"
              onClick={() => onChange(v === 'all' ? '' : v)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg border text-sm transition-colors ${
                selected
                  ? 'bg-[#01c5fd] border-[#01c5fd] text-blue-700'
                  : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="truncate">{label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
