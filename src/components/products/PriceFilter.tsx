
import { Slider } from "@/components/ui/slider";

interface PriceFilterProps {
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

export const PriceFilter = ({ value, onChange }: PriceFilterProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Price Range
      </label>
      <div className="px-3">
        <Slider
          value={value}
          onValueChange={onChange}
          max={200}
          min={0}
          step={5}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>${value[0]}</span>
          <span>${value[1]}</span>
        </div>
      </div>
    </div>
  );
};
