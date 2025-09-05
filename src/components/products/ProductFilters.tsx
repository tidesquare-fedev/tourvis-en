
import { LocationFilter } from "./LocationFilter";
import { CategoryFilter } from "./CategoryFilter";
import { PriceFilter } from "./PriceFilter";

interface FiltersState {
  locations: string[];
  category: string;
  priceRange: [number, number];
}

interface ProductFiltersProps {
  filters: FiltersState;
  onFiltersChange: (filters: FiltersState) => void;
  dynamicCategories?: string[];
  dynamicLocations?: string[];
  priceMin?: number;
  priceMax?: number;
}

export const ProductFilters = ({ filters, onFiltersChange, dynamicCategories, dynamicLocations, priceMin, priceMax }: ProductFiltersProps) => {
  const updateFilter = (key: keyof FiltersState, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-3">
      {/* 카테고리는 그대로, 가격과 위치는 모달팝업으로 */}
      <div className="space-y-4">
        {/* 카테고리 필터 - 전체 너비 */}
        <CategoryFilter
          value={filters.category}
          onChange={(value) => updateFilter('category', value)}
          options={dynamicCategories}
          variant="pills"
        />
        
        {/* 가격과 위치 필터 - 한 줄로 배치 */}
        <div className="flex gap-3">
          <div className="flex-1">
            <PriceFilter
              value={filters.priceRange}
              onChange={(value) => updateFilter('priceRange', value)}
              min={priceMin}
              max={priceMax}
            />
          </div>
          <div className="flex-1">
            <LocationFilter
              value={filters.locations}
              onChange={(value) => updateFilter('locations', value)}
              options={dynamicLocations}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
