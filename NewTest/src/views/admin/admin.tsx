import Nav from "@/views/admin/adminnav";

import { Sermon } from "@/views/admin/sermonadmin/sermon";
import { Separator } from "@/components/ui/separator";
import { Fetch } from "@/hooks/sermonhooks";
import { AuthorSeries } from "@/views/admin/sermonadmin/author";

import { SeriesType, AuthorsType } from "@/types/sermon";
function Admin() {
  const { data: seriesData, error: seriesError } = Fetch<SeriesType[]>(
    "fetchseries",
    "SeriesData"
  );
  const { data: authorsData, error: authorsError } = Fetch<AuthorsType[]>(
    "fetchauthors",
    "AuthorData"
  );
  return (
    <>
      <div className="container">
        <div className="flex sticky top-0  pt-2 pb-1 pl-1 bg-background shadow-lg dark:shadow-blue-500/50">
          <Nav />
        </div>
        <div className="container px-4">
          <div className="columns-2 pt-4">
            <div className="flex justify-start">
              <AuthorSeries
                items={authorsData}
                error={authorsError as Error}
                type="Author"
                nameKey="name"
                idKey="author_id"
                desc="ministry"
              />
            </div>
            <div className="flex justify-end">
              <AuthorSeries
                items={seriesData}
                error={seriesError as Error}
                type="Series"
                nameKey="title"
                idKey="series_id"
                desc="description"
              />
            </div>
          </div>
          <Separator className="" />
          <div className="">
            <Sermon />
          </div>
          <div className="">
            <Sermon />
          </div>
          <div className="">
            <Sermon />
          </div>
          <div className="">
            <Sermon />
          </div>
          <div className="">
            <Sermon />
          </div>
          <div className="">
            <Sermon />
          </div>
          <div className="">
            <Sermon />
          </div>
        </div>
      </div>
    </>
  );
}

export default Admin;
