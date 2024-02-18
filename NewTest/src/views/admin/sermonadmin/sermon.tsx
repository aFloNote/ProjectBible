import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { NewItem } from "@/views/admin/sermonadmin/newItem";
import { Fetch } from "@/hooks/sermonhooks";
interface Series{
  id: string;
  name: string;
  imagePath: string;
}

export function Sermon() {
  const { data: seriesData, error:seriesError } = Fetch<Series[]>('fetchseries', 'SeriesData');

  
  return (
    <Card className="w-[500px] mx-auto">
      <CardHeader>
        <CardTitle>Sermons</CardTitle>
        <CardDescription>Create a Sermon</CardDescription>
      </CardHeader>
      <CardContent>
        {seriesData && (
          <>
       
          <NewItem  items={seriesData} error={seriesError as Error} type="Series" head="title" desc="description"/>
          </>
        )}
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
export default Sermon;
