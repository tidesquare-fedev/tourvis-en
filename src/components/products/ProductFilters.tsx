
import { LocationFilter } from "./LocationFilter";
import { CategoryFilter } from "./CategoryFilter";
import { PriceFilter } from "./PriceFilter";

interface FiltersState {
  location: string;
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
    <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6">
      <div className="space-y-5">
        <CategoryFilter
          value={filters.category}
          onChange={(value) => updateFilter('category', value)}
          options={dynamicCategories}
        />
        <LocationFilter
          value={filters.location}
          onChange={(value) => updateFilter('location', value)}
          options={dynamicLocations}
        />
        <PriceFilter
          value={filters.priceRange}
          onChange={(value) => updateFilter('priceRange', value)}
          min={priceMin}
          max={priceMax}
        />
      </div>
    </div>
  );
};
