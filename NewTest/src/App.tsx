import { ThemeProvider } from "@/components/theme-provider";
import Sermon from "@/views/Sermons/SermonLanding";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthAdmin from "@/views/admin/authadmin";
import { QueryClient, QueryClientProvider  } from 'react-query'
import { Provider } from 'react-redux';
import {store} from '@/redux/store';
import { Auth0Provider } from "@auth0/auth0-react";

function App() {
  const redirect = import.meta.env.VITE_REACT_APP_REDIRECT_URI;
  const aud =import.meta.env.VITE_REACT_APP_AUD;
  const scope= import.meta.env.VITE_REACT_APP_SCOPE;
  const domain=import.meta.env.VITE_REACT_APP_DOMAIN;
  const clientId=import.meta.env.VITE_REACT_APP_CLIENT_ID;
 const queryClient = new QueryClient()


  return (
    <div id="root" className="flex items-center justify-center min-h-screen">
    <Auth0Provider
      domain= {domain as string}
      clientId={clientId as string}
      useRefreshTokens={true}
      cacheLocation="localstorage"
      authorizationParams={{
        redirect_uri: redirect,
        audience: aud,
        scope: scope,
      }}
    >
      <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <Router>
            <Routes>
              <Route path="admin" element={<AuthAdmin />} />
              <Route path="/" element={<Sermon />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </QueryClientProvider>
      </Provider>
    </Auth0Provider>
    </div>
  );
}

export default App;


