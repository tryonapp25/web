import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css"
import { UserProvider } from "./ApiContext/userContext";
import Onboarding from "./pages/onboarding";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Home from "./pages/home";
import Payment from "./pages/payment";
import Profile from "./pages/profile";
import TemplatePage from "./pages/templatePage";
import MenuPage from "./pages/menu";


export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <main>
          <Routes>
            <Route path="/" element={<Onboarding />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/menuPage" element={<MenuPage />} />
            <Route path="/code/:code/template/:id" element={<TemplatePage />} />
            
          </Routes>
        </main>
      </BrowserRouter>
    </UserProvider>
  );
}
