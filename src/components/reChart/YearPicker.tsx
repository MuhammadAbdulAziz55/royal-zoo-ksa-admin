import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

function CalendarYearPicker({ selected, onSelect }: any) {
  const [year, setYear] = React.useState<number>(
    selected ? new Date(selected).getFullYear() : new Date().getFullYear()
  );

  const handleYearChange = (increment: number) => {
    setYear((prevYear) => prevYear + increment);
  };

  const handleYearSelect = (year: number) => {
    onSelect(new Date(year, 0, 1));
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center justify-between mb-2 w-full">
        <Button
          variant={"ghost"}
          onClick={() => handleYearChange(-1)}
          className="p-0"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </Button>
        <div>{year}</div>
        <Button
          variant={"ghost"}
          onClick={() => handleYearChange(1)}
          className="p-0"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </Button>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {[0, 1, 2, 3].map((row) => (
          <React.Fragment key={row}>
            {[0, 1, 2, 3].map((col) => {
              const currentYear = year + row * 4 + col;
              return (
                <Button
                  key={currentYear}
                  variant={"outline"}
                  onClick={() => handleYearSelect(currentYear)}
                  className={cn(
                    "w-full",
                    selected && selected.getFullYear() === currentYear
                      ? "bg-primary-light text-primary"
                      : ""
                  )}
                >
                  {currentYear}
                </Button>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export function YearPicker({ setYear }: any) {
  const currentDate = new Date();

  const [date, setDate] = React.useState<Date>(
    new Date(currentDate.getFullYear(), 0, 1)
  );

  setYear(date);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          {date ? format(date, "yyyy") : <span>Pick a year</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <CalendarYearPicker selected={date} onSelect={setDate} />
      </PopoverContent>
    </Popover>
  );
}
