import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {SelectAuthor} from '@/views/admin/author/selectauthor'
import {NewAuthor} from '@/views/admin/author/newauthor'
import { FetchAuthor} from '@/hooks/sermonhooks'


 export function Author() {
  const { data: authorsData , error} = FetchAuthor();
  
return (
  <Card className='w-[600px] mx-auto'>
    <CardHeader>
      <CardTitle>Authors</CardTitle>
      <CardDescription>Choose or Create an Author</CardDescription>
    </CardHeader>
    <CardContent>
    {authorsData && (
    <>
      <SelectAuthor authorsData={authorsData} />
      <NewAuthor authorsData={authorsData} error={error} />
    </>
  )}
    </CardContent>
    <CardFooter></CardFooter>
  </Card>
);
}
export default Author;
