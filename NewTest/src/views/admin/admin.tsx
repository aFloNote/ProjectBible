import Nav from "@/views/admin/adminnav";
import { Author } from "@/views/admin/sermonadmin/author";
import { Series } from "@/views/admin/sermonadmin/series";
function Admin() {
  return (
    <>
      <div>
        <Nav />
      </div>

      <div className="flex-1 overflow-auto pt-20">
        <Author />
      </div>

      <div className="flex-1 overflow-auto pt-20">
        <Series />
      </div>
    </>
  );
}

export default Admin;
