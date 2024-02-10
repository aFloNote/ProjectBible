import { ThemeProvider } from "@/components/theme-provider";
import Sermon from "@/views/Sermons/SermonLanding";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { LoginForm } from '@/views/admin/login';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          <Route path="/admin" element={<LoginForm />} />
          <Route path="/" element={<Sermon />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
