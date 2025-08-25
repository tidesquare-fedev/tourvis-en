
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mountain, Landmark, Leaf, Map, List } from "lucide-react";

interface CategoryFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export const CategoryFilter = ({ value, onChange }: CategoryFilterProps) => {
  const categories = [
    { value: "all", label: "All", Icon: List },
    { value: "Adventure", label: "Adventure", Icon: Mountain },
    { value: "Cultural", label: "Cultural", Icon: Landmark },
    { value: "Nature", label: "Nature", Icon: Leaf },
    { value: "Historical", label: "Historical", Icon: Map },
  ];

  // Sidebar style category list
  return (
    <div>
      <div className="text-xs font-semibold text-gray-500 mb-2 tracking-wide">CATEGORY</div>
      <nav className="space-y-1">
        {categories.map(({ value: v, label, Icon }) => {
          const selected = (value || "all") === v || (v !== "all" && value === v)
          return (
            <button
              key={v}
              type="button"
              onClick={() => onChange(v === "all" ? "" : v)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg border text-sm transition-colors ${
                selected
                  ? "bg-blue-50 border-blue-200 text-blue-700"
                  : "bg-white border-gray-200 hover:bg-gray-50 text-gray-700"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="truncate">{label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  );
};
