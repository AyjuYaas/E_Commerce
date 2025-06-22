import CategoryFilter from "./Filters/CategoryFilter";
import PriceFilter from "./Filters/PriceFilter";
import SearchBar from "./Filters/SearchBar";

const FilterBar = () => {
  return (
    <section className="flex flex-col gap-5 sm:flex-row">
      <SearchBar />

      <CategoryFilter />

      <PriceFilter />
    </section>
  );
};
export default FilterBar;
