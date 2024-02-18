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

export function Author() {

  interface Authors{
    author_id: number;
    name: string;
    ministry: string;
    image_path: string;
  }
  
    const { data: authorsData, error:authorsError } = Fetch<Authors[]>('fetchauthors', 'AuthorData');
    

  return (
    <Card className="w-[500px] mx-auto">
      <CardHeader>
        <CardTitle>Authors</CardTitle>
        <CardDescription>Choose or Create an Author</CardDescription>
      </CardHeader>
      <CardContent>
        {authorsData && (
          <>
            <SelectItem items={authorsData} error={authorsError as Error} type="Author" idKey="author_id" nameKey="name" />
            <NewItem  items={authorsData} error={authorsError as Error} type="Author" head="name" desc="ministry"/>
          </>
        )}
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
export default Author;
