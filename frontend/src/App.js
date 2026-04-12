import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import About from "./pages/about";
import Features from "./pages/features";
import Contacts from "./pages/contacts";
import Login from "./pages/login";
import Registration from "./pages/registration";
import DashboardLayout from "./pages/DashboardLayout";
import DashboardSensors from "./pages/DashboardSensors";
import DashboardAbout from "./pages/DashboardAbout";
import DashboardFeatures from "./pages/DashboardFeatures";
import DashboardContacts from "./pages/DashboardContacts";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardSensors />} />
          <Route path="about" element={<DashboardAbout />} />
          <Route path="features" element={<DashboardFeatures />} />
          <Route path="contacts" element={<DashboardContacts />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;