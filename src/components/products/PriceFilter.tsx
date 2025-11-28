import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';

interface PriceFilterProps {
  value: [number, number];
  onChange: (value: [number, number]) => void;
  min?: number;
  max?: number;
  step?: number;
}

export const PriceFilter = ({
  value,
  onChange,
  min: minProp,
  max: maxProp,
  step: stepProp,
}: PriceFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempValue, setTempValue] = useState<[number, number]>(value);

  const min = Number.isFinite(minProp as number) ? (minProp as number) : 0;
  const max =
    Number.isFinite(maxProp as number) && (maxProp as number) > min
      ? (maxProp as number)
      : Math.max(min + 1, 200);
  const step =
    typeof stepProp === 'number' && stepProp > 0
      ? stepProp
      : Math.max(1, Math.round((max - min) / 40));
  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  const display = (n: number) => `$${clamp(n).toLocaleString()}`;

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setTempValue(value);
    }
  };

  const handleApply = () => {
    onChange(tempValue);
    setIsOpen(false);
  };

  const handleReset = () => {
    setTempValue([min, max]);
  };

  const isDefault = value[0] === min && value[1] === max;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between text-xs h-8 px-3"
        >
          <span className="flex items-center gap-1">
            <Filter className="w-3 h-3" />
            Price
          </span>
          <span className="text-gray-500">
            {isDefault ? 'ALL' : `${display(value[0])} - ${display(value[1])}`}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg">Price</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="px-4">
            <Slider
              value={[clamp(tempValue[0]), clamp(tempValue[1])]}
              onValueChange={v =>
                setTempValue([clamp(v[0] ?? min), clamp(v[1] ?? max)])
              }
              max={max}
              min={min}
              step={step}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-3">
              <span className="font-medium">{display(tempValue[0])}</span>
              <span className="font-medium">{display(tempValue[1])}</span>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={handleReset}>
              Reset
            </Button>
            <Button size="sm" onClick={handleApply}>
              Apply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
