
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LocationFilterProps {
  value: string;
  onChange: (value: string) => void;
  options?: string[];
}

export const LocationFilter = ({ value, onChange, options }: LocationFilterProps) => {
  const base = (Array.isArray(options) && options.length > 0) ? options : [
    "Seoul","Busan","Jeju","Gyeongju","Incheon","Sokcho","Gangneung","Jeonju","Andong","Gapyeong",
  ]
  const locations = [{ value: "all", label: "All Locations" }, ...base.map((l) => ({ value: l, label: l }))]

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Location
      </label>
      <Select value={value || "all"} onValueChange={(val) => onChange(val === "all" ? "" : val)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="All Locations" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {locations.map((location) => (
            <SelectItem key={location.value} value={location.value}>
              {location.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
