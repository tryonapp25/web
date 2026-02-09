import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css"
import { UserProvider } from "./ApiContext/userContext";
import ProtectedRoute from "./ApiContext/protectedRoute";
import AdminProtection from "./ApiContext/adminProtection";


import Home from "./pages/home";

import Login from "./pages/login";
import Signup from "./pages/signup";
import LandingPage from "./pages/landingPage";
import Payment from "./pages/payment";
import Profile from "./pages/profile";
import MenuPage from "./pages/menu";
import RenderProductionMenu from "./pages/renderProductionMenu";
import RenderProductionMenuBook from "./pages/renderProductionMenuBook";
import TemplateWraper from "./pages/templateWraper";
import MenuBookWraper from "./pages/menuBookWrapper";
import MyCollection from "./pages/collection";


// Admin //
import AdminPage from "./admin";
import Features from "./admin/features";
import EditTemplate from "./admin/editTemplate";

import TestTemplate from "./templates/menu/testTemplate";
import DashboardPage from "./business/dashboard";



export default function App() {
  return (
    <UserProvider>
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/menu/:type/template/:id" element={<RenderProductionMenu />} />  
            <Route path="/menubook/:type/template/:id" element={<RenderProductionMenuBook />} /> 

            <Route path="/test" element={<TestTemplate />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            {/*Protect routers */}
            <Route element={<ProtectedRoute />}>
              {/* <Route path="/home" element={<Home />} /> */}
              <Route path="/payment" element={<Payment />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/collection" element={<MyCollection />} />
              <Route path="/:type/template/:id" element={<TemplateWraper />} /> 
              <Route path="/:type/menuBook/:id" element={<MenuBookWraper />} />

              {/* Admin route */}
              <Route element={<AdminProtection />}>
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/admin/edit/template" element={<EditTemplate />} />
                <Route path="/admin/features" element={<Features />} />
              </Route>
            </Route>
            
          </Routes>
        </main>
    </UserProvider>
  );
}

// https://www.canva.com/design/DAG-s06k6QU/bF-91urykVfp8HFFlzRSqg/edit?ui=eyJBIjp7fX0
