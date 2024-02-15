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

 export function Author() {
return(
  <Card className='w-[600px] mx-auto'>
    <CardHeader>
      <CardTitle>Authors</CardTitle>
      <CardDescription>Choose or Create a Author</CardDescription>
    </CardHeader>
    <CardContent>
      <SelectAuthor/>
      <NewAuthor/>
    </CardContent>
    <CardFooter>
   
    </CardFooter>
  </Card>
    )
}
