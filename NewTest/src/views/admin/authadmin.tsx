
import { withAuthenticationRequired } from '@auth0/auth0-react';
import AdminComp from '@/views/admin/admin'; // Your admin page component

export default withAuthenticationRequired(AdminComp, {
  // Optionally, you can specify a returnTo path to redirect users after login
  returnTo: '/admin',
});