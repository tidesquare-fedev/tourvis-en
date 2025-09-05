
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, X } from "lucide-react";

interface LocationFilterProps {
  value: string[];
  onChange: (value: string[]) => void;
  options?: string[];
}

export const LocationFilter = ({ value, onChange, options }: LocationFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempValue, setTempValue] = useState<string[]>(value);
  
  const base = (Array.isArray(options) && options.length > 0) ? options : [
    "Seoul","Busan","Jeju","Gyeongju","Incheon","Sokcho","Gangneung","Jeonju","Andong","Gapyeong",
  ]
  const locations = base.map((l) => ({ value: l, label: l }));

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
    setTempValue([]);
  };

  const toggleLocation = (locationValue: string) => {
    if (tempValue.includes(locationValue)) {
      setTempValue(tempValue.filter(v => v !== locationValue));
    } else {
      setTempValue([...tempValue, locationValue]);
    }
  };

  const getDisplayText = () => {
    if (value.length === 0) return '전체';
    if (value.length === 1) return value[0];
    if (value.length <= 3) return value.join(', ');
    return `${value[0]} 외 ${value.length - 1}개`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full justify-between text-xs h-8 px-3"
        >
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            위치
          </span>
          <span className="text-gray-500">
            {getDisplayText()}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg">위치 선택</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* 선택된 위치들 */}
          {tempValue.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700">선택된 위치</div>
              <div className="flex flex-wrap gap-2">
                {tempValue.map((location) => (
                  <div
                    key={location}
                    className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                  >
                    {location}
                    <button
                      onClick={() => toggleLocation(location)}
                      className="hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 위치 목록 */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700">위치 목록</div>
            <div className="max-h-60 overflow-y-auto space-y-1">
              {locations.map((location) => (
                <button
                  key={location.value}
                  onClick={() => toggleLocation(location.value)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    tempValue.includes(location.value)
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {location.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={handleReset}>
              초기화
            </Button>
            <Button size="sm" onClick={handleApply}>
              적용
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

