
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
}

export const ProductFilters = ({ filters, onFiltersChange }: ProductFiltersProps) => {
  const updateFilter = (key: keyof FiltersState, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <LocationFilter
          value={filters.location}
          onChange={(value) => updateFilter('location', value)}
        />
        <CategoryFilter
          value={filters.category}
          onChange={(value) => updateFilter('category', value)}
        />
        <PriceFilter
          value={filters.priceRange}
          onChange={(value) => updateFilter('priceRange', value)}
        />
      </div>
    </div>
  );
};
