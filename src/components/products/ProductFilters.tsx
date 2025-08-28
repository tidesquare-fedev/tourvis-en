
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
    <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6">
      {/* Mobile one-line categories (pills) */}
      <div className="md:hidden mb-4">
        <CategoryFilter
          value={filters.category}
          onChange={(value) => updateFilter('category', value)}
          options={dynamicCategories}
          variant="pills"
        />
      </div>
      {/* Desktop stacked */}
      <div className="hidden md:block space-y-5">
        <CategoryFilter
          value={filters.category}
          onChange={(value) => updateFilter('category', value)}
          options={dynamicCategories}
        />
        <LocationFilter
          value={filters.locations}
          onChange={(value) => updateFilter('locations', value)}
          options={dynamicLocations}
        />
        <PriceFilter
          value={filters.priceRange}
          onChange={(value) => updateFilter('priceRange', value)}
          min={priceMin}
          max={priceMax}
        />
      </div>
      {/* Mobile stacked: price then location */}
      <div className="md:hidden space-y-4">
        <PriceFilter
          value={filters.priceRange}
          onChange={(value) => updateFilter('priceRange', value)}
          min={priceMin}
          max={priceMax}
        />
        <LocationFilter
          value={filters.locations}
          onChange={(value) => updateFilter('locations', value)}
          options={dynamicLocations}
        />
      </div>
    </div>
  );
};
