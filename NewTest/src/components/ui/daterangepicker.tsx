import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import {  format } from "date-fns";
import { DateRange } from "react-day-picker";
import { AiOutlineReload } from 'react-icons/ai';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerWithRangeProps extends React.HTMLAttributes<HTMLDivElement> {
  onDateChange?: (date: DateRange | undefined) => void;
}

export function DatePickerWithRange({
  className,
  onDateChange,
}: DatePickerWithRangeProps) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [isClicked, setIsClicked] = React.useState(false);

  const handleButtonClick = () => {
    setIsClicked(false);
    onDateChange?.(date);
  };

  const handleResetClick = () => {
    setDate(undefined);
    onDateChange?.(undefined);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isClicked} onOpenChange={setIsClicked}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-4 h-4  justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 -translate-x-14 -translate-y-32"
          align="end"
        >
          <div className="text-center pt-2 text-primary">
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>No date selected</span>
            )}
          </div>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={window.innerWidth < 768 ? 1 : 2}
          />
          <div className="flex justify-end pb-1 px-1">
			<div className='pr-1'>
		  <Button className="right-0 h-4 w-4 ml-2 " onClick={handleResetClick}>
			<AiOutlineReload size={20} />
            </Button>
			</div>
            <Button className="right-0 h-4" onClick={handleButtonClick}>
              Filter
            </Button>
           
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}