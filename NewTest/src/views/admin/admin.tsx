import Nav from "@/views/admin/adminnav";
import { Author } from "@/views/admin/sermonadmin/author";
import { Series } from "@/views/admin/sermonadmin/series";
import { Sermon } from "@/views/admin/sermonadmin/sermon";
function Admin() {
  return (
    <>
        <div className="">
        <Nav />
        </div>

      <div className="container mx-auto">
      
   
        <div className="flex flex-row">
        
            <Author />
         

          
            <Series />
        
        </div>

        <div className="pt-10">
          <Sermon />
        </div>
      
      </div>
    </>
  );
}

export default Admin;
