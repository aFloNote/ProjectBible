import { ThemeProvider } from "@/components/theme-provider";
import Sermon from "@/views/Sermons/SermonLanding";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import AuthAdmin from "@/views/admin/authadmin";

import { Auth0Provider } from "@auth0/auth0-react";

function App() {
  return (
    <Auth0Provider
      domain="dev-gzursgw36hm2kcsi.us.auth0.com"
      clientId="LdLlgYFRihdKp1a7bVcsjLAAHQcZcbAz"
      authorizationParams={{
        redirect_uri: "https://localhost/admin",
        audience: "https://sermon.api",
        scope: "read:author",
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
