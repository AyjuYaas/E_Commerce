"use client";

import * as React from "react";
import { format, getMonth, getYear, setMonth, setYear } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DatePickerProps {
  value?: Date;
  onDateChange?: (date: Date | undefined) => void;
  disableFuture?: boolean;
}

export default function CustomDatePicker({
  value,
  onDateChange,
  disableFuture = false,
}: DatePickerProps) {
  const today = new Date();
  const currentYear = getYear(today);
  const startYear = currentYear - 100;
  const endYear = disableFuture ? currentYear : currentYear + 10;

  const [internalDate, setInternalDate] = React.useState<Date | undefined>(
    value
  );

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i
  );

  const handleMonthChange = (month: string) => {
    const baseDate = internalDate ?? today;
    const newDate = setMonth(baseDate, months.indexOf(month));
    setInternalDate(newDate);
    onDateChange?.(newDate);
  };

  const handleYearChange = (year: string) => {
    const baseDate = internalDate ?? today;
    const newDate = setYear(baseDate, parseInt(year));
    setInternalDate(newDate);
    onDateChange?.(newDate);
  };

  const handleSelect = (selectedDate: Date | undefined) => {
    setInternalDate(selectedDate);
    onDateChange?.(selectedDate);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[250px] justify-start text-left font-normal",
            !internalDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {internalDate ? (
            format(internalDate, "PPP")
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="flex justify-between p-2">
          <Select
            onValueChange={handleMonthChange}
            value={internalDate ? months[getMonth(internalDate)] : ""}
          >
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            onValueChange={handleYearChange}
            value={internalDate ? getYear(internalDate).toString() : ""}
          >
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Calendar
          mode="single"
          selected={internalDate}
          onSelect={handleSelect}
          initialFocus
          month={internalDate ?? today}
          onMonthChange={(newDate) => {
            if (newDate) setInternalDate(newDate);
          }}
          fromYear={startYear}
          toYear={endYear}
          disabled={disableFuture ? { after: today } : undefined}
        />
      </PopoverContent>
    </Popover>
  );
}
