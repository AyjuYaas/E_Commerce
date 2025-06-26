"use client";

import useProductStore from "@/app/store/useProductStore";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { useEffect } from "react";

const SearchBar = () => {
  const filterSearch = useProductStore((state) => state.filterSearch);
  const setFilterSearch = useProductStore((state) => state.setFilterSearch);
  const fetchProducts = useProductStore((state) => state.fetchProducts);

  const debouncedSearch = useDebounce(filterSearch, 500);

  useEffect(() => {
    fetchProducts();
  }, [debouncedSearch, fetchProducts]);

  return (
    <div className="relative flex w-max">
      <Input
        type="text"
        placeholder="Search for Items"
        className="pl-8"
        value={filterSearch}
        onChange={(e) => setFilterSearch(e.target.value)}
      />
      <Search className="absolute top-1/2 -translate-y-1/2 size-4 ml-2" />
    </div>
  );
};

export default SearchBar;
