
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LocationFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export const LocationFilter = ({ value, onChange }: LocationFilterProps) => {
  const locations = [
    { value: "", label: "All Locations" },
    { value: "Seoul", label: "Seoul" },
    { value: "Busan", label: "Busan" },
    { value: "Jeju", label: "Jeju" },
    { value: "Gyeongju", label: "Gyeongju" },
    { value: "Incheon", label: "Incheon" },
    { value: "Sokcho", label: "Sokcho" },
    { value: "Gangneung", label: "Gangneung" },
    { value: "Jeonju", label: "Jeonju" },
    { value: "Andong", label: "Andong" },
    { value: "Gapyeong", label: "Gapyeong" },
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Location
      </label>
      <Select value={value || ""} onValueChange={onChange}>
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
