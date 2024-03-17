import { ThemeProvider } from "@/components/theme-provider";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { Auth0Provider } from "@auth0/auth0-react";
import { lazy, Suspense } from 'react';

const AuthAdmin= lazy(() => import('@/views/admin/authadmin'))
const SermonLanding= lazy(() => import('@/views/Sermons/SermonLanding'))
function App() {
  const redirect = import.meta.env.VITE_REACT_APP_REDIRECT_URI
  const aud = import.meta.env.VITE_REACT_APP_AUD
  const scope = import.meta.env.VITE_REACT_APP_SCOPE
  const domain = import.meta.env.VITE_REACT_AUTH_DOMAIN
  const clientId = import.meta.env.VITE_REACT_APP_CLIENT_ID
 
  const queryClient = new QueryClient();
  console.log(redirect, aud, scope, domain, clientId)
  return (
   
      <Auth0Provider
        domain={domain as string}
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
              <Suspense fallback={<div>Loading...</div>}>
                  <Routes>
                    <Route path="admin/*" element={<AuthAdmin />} />
                    <Route path="/*" element={<SermonLanding />} />
                  </Routes>
                </Suspense>
              </Router>
            </ThemeProvider>
          </QueryClientProvider>
        </Provider>
      </Auth0Provider>
  
  );
}

export default App;
