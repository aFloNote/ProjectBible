
import Nav from '@/views/admin/adminnav'
import {Author} from '@/views/admin/author/author'
function Admin() {
  return (
    <>
      <div >
      <Nav />
      </div>
      
        <div className="flex-1 overflow-auto pt-20">
          <Author />
        </div>
        <div className="flex-1 overflow-auto">
       
     
    
    </div>
    </>
  );
}

export default Admin;
