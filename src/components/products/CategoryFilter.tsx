
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CategoryFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export const CategoryFilter = ({ value, onChange }: CategoryFilterProps) => {
  const categories = [
    { value: "", label: "All Categories" },
    { value: "Adventure", label: "Adventure" },
    { value: "Cultural", label: "Cultural" },
    { value: "Nature", label: "Nature" },
    { value: "Historical", label: "Historical" },
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Category
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {categories.map((category) => (
            <SelectItem key={category.value} value={category.value}>
              {category.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
