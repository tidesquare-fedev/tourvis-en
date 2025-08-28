
import { Slider } from "@/components/ui/slider";

interface PriceFilterProps {
  value: [number, number];
  onChange: (value: [number, number]) => void;
  min?: number;
  max?: number;
  step?: number;
}

export const PriceFilter = ({ value, onChange, min: minProp, max: maxProp, step: stepProp }: PriceFilterProps) => {
  const min = Number.isFinite(minProp as number) ? (minProp as number) : 0
  const max = Number.isFinite(maxProp as number) && (maxProp as number) > min ? (maxProp as number) : Math.max(min + 1, 200)
  const step = typeof stepProp === 'number' && stepProp > 0 ? stepProp : Math.max(1, Math.round((max - min) / 40))
  const clamp = (n: number) => Math.min(max, Math.max(min, n))
  const display = (n: number) => `$${clamp(n).toLocaleString()}`

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Price Range
      </label>
      <div className="px-3">
        <Slider
          value={[clamp(value[0]), clamp(value[1])]}
          onValueChange={(v) => onChange([clamp(v[0] ?? min), clamp(v[1] ?? max)])}
          max={max}
          min={min}
          step={step}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>{display(value[0])}</span>
          <span>{display(value[1])}</span>
        </div>
      </div>
    </div>
  );
};
