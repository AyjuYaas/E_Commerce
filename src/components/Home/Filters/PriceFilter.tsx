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
import { BadgeIndianRupee } from "lucide-react";

const priceFilterData: string[] = ["high-to-low", "low-to-high"];

export default function PriceFilter() {
  const priceFilter = useProductStore((state) => state.filterPrice);
  const setPriceFilter = useProductStore((state) => state.setFilterPrice);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-[13rem] relative">
          <BadgeIndianRupee className="absolute left-1" />
          {priceFilter ? `Price: ${priceFilter}` : "Filter by Price"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Filter by Price</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={priceFilter}
          onValueChange={setPriceFilter}
        >
          <DropdownMenuRadioItem value={""}>All</DropdownMenuRadioItem>
          {priceFilterData.map((filter, idx) => (
            <DropdownMenuRadioItem key={idx} value={filter}>
              {filter}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
