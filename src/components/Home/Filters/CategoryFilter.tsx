"use client";

import useProductStore from "@/app/store/useProductStore";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { categoryData } from "@/data/category.data";
import { FilterIcon } from "lucide-react";

export default function CategoryFilter() {
  const category = useProductStore((state) => state.filterCategory);
  const setCategory = useProductStore((state) => state.setFilterCategory);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-[13rem] relative">
          <FilterIcon className="absolute left-1" />
          {category ? `Category: ${category}` : "Filter by Category"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Category</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={category} onValueChange={setCategory}>
          <DropdownMenuRadioItem value={""}>All</DropdownMenuRadioItem>
          {categoryData.map((cat, idx) => (
            <DropdownMenuRadioItem key={idx} value={cat}>
              {cat}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
