
import Nav from '@/views/admin/adminnav'
import Author from '@/views/admin/author/author'

function Admin() {
  return (
    <div className="flex flex-col h-screen">
      <div>
        <Nav/>
      </div>
      <div className="flex-none">
        <Author/>
      </div>
    </div>
  );
}

export default Admin;