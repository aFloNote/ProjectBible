import Nav from "@/views/admin/adminnav";

import { Sermon } from "@/views/admin/sermonadmin/sermon";


function Admin() {
  
  return (
    <>
      <div className="container">
        <div className="flex sticky top-0  pt-2 pb-1 pl-1 bg-background shadow-lg dark:shadow-blue-500/50">
          <Nav />
        </div>
        <div className="container px-4">
        

     
            <Sermon />
          
       
        </div>
      </div>
    </>
  );
}

export default Admin;
