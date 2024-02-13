import { ThemeProvider } from "@/components/theme-provider";
import Sermon from "@/views/Sermons/SermonLanding";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import AuthAdmin from "@/views/admin/authadmin";

import { Auth0Provider } from "@auth0/auth0-react";

function App() {
  const redirect = import.meta.env.VITE_REACT_APP_REDIRECT_URI;
  const aud =import.meta.env.VITE_REACT_APP_AUD;
  const scope= import.meta.env.VITE_REACT_APP_SCOPE;
  const domain=import.meta.env.VITE_REACT_APP_DOMAIN;
  const clientId=import.meta.env.VITE_REACT_APP_CLIENT_ID;
 


  return (
    <Auth0Provider
      domain= {domain as string}
      clientId={clientId as string}
      useRefreshTokens={true}
      authorizationParams={{
        redirect_uri: redirect,
        audience: aud,
        scope: scope,
      }}
    >
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Router>
          <Routes>
            <Route path="admin" element={<AuthAdmin />} />
            <Route path="/" element={<Sermon />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </Auth0Provider>
  );
}

export default App;


