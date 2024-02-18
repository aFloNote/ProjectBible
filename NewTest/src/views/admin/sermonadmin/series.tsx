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
import { setSelectedSeries } from '@/redux/selected';
import { useDispatch } from 'react-redux';
import { SeriesType } from '@/types/sermon';
export function Series() {
  const dispatch = useDispatch();

  const { data: seriesData, error:seriesError } = Fetch<SeriesType[]>('fetchseries', 'SeriesData');
  const handleSelectSeries = (series: SeriesType[]) => { // replace with your Author type
    dispatch(setSelectedSeries(series));
  };
  
  return (
    <Card className="w-[500px] mx-auto">
      <CardHeader>
        <CardTitle>Series</CardTitle>
        <CardDescription>Choose or Create an Series</CardDescription>
      </CardHeader>
      <CardContent>
        {seriesData && (
          <>
          <SelectItem items={seriesData} error={seriesError as Error} type="Series" idKey="series_id" nameKey="title" onSelect={handleSelectSeries} />
          <NewItem  items={seriesData} error={seriesError as Error} type="Series" head="title" desc="description"/>
          </>
        )}
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
export default Series;
