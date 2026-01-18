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
import TemplatePayment from "./pages/templatePayment";
import RenderProductionMenu from "./pages/renderProductionMenu";


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
            <Route path="/payment-template" element={<TemplatePayment />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/:type/template/:id" element={<TemplatePage />} /> 
            <Route path="/tryon/menu/:type/template/:id" element={<RenderProductionMenu />} /> 
            
          </Routes>
        </main>
      </BrowserRouter>
    </UserProvider>
  );
}

// https://www.canva.com/design/DAG-s06k6QU/bF-91urykVfp8HFFlzRSqg/edit?ui=eyJBIjp7fX0
