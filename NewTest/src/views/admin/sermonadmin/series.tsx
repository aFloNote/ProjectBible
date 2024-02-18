import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SelectItem } from "@/views/admin/sermonadmin/selectItem";
import { NewItem } from "@/views/admin/sermonadmin/newItem";
import { Fetch } from "@/hooks/sermonhooks";
interface Series{
  id: string;
  name: string;
  imagePath: string;
}

export function Series() {
  const { data: seriesData, error:seriesError } = Fetch<Series[]>('fetchseries', 'SeriesData');

  
  return (
    <Card className="w-[500px] mx-auto">
      <CardHeader>
        <CardTitle>Series</CardTitle>
        <CardDescription>Choose or Create an Series</CardDescription>
      </CardHeader>
      <CardContent>
        {seriesData && (
          <>
          <SelectItem items={seriesData} error={seriesError as Error} type="Series" idKey="series_id" nameKey="title" />
          <NewItem  items={seriesData} error={seriesError as Error} type="Series" head="title" desc="description"/>
          </>
        )}
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
export default Series;
