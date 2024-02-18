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
import { setSelectedAuthor } from '@/redux/selected';
import { useDispatch } from 'react-redux';
import { AuthorsType } from '@/types/sermon';

export function Author() {
  const dispatch = useDispatch();

  const handleSelectAuthor = (author: AuthorsType[]) => { // replace with your Author type
    dispatch(setSelectedAuthor(author));
  };



    const { data: authorsData, error:authorsError } = Fetch<AuthorsType[]>('fetchauthors', 'AuthorData');
    

  return (
    <Card className="w-[500px] mx-auto">
      <CardHeader>
        <CardTitle>Authors</CardTitle>
        <CardDescription>Choose or Create an Author</CardDescription>
      </CardHeader>
      <CardContent>
        {authorsData && (
          <>
            <SelectItem items={authorsData} error={authorsError as Error} type="Author" idKey="author_id" nameKey="name" onSelect={handleSelectAuthor} />
            <NewItem  items={authorsData} error={authorsError as Error} type="Author" head="name" desc="ministry"/>
          </>
        )}
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}

