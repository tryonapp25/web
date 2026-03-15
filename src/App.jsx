import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import { notificationMessageListener } from "./firebase";
import { useEffect, useRef } from "react";

import { UserProvider } from "./ApiContext/userContext";
import { SocketProvider } from "./ApiContext/socketContext";
import { BusinessProvider } from "./ApiContext/businessContext";
import { ThemeProvider } from "./ApiContext/themeContext";
import ProtectedRoute from "./ApiContext/protectedRoute";
import AdminProtection from "./ApiContext/adminProtection";
import BusinessProtection from "./ApiContext/businessProtection";
import ProductionProtection from "./ApiContext/productionProtection";


import Login from "./pages/login";
import Signup from "./pages/signup";
import Onboarding from "./pages/onboarding";
import Demo from "./pages/demo";
import Payment from "./pages/payment";
import Profile from "./pages/profile";
import MenuPage from "./pages/menu";
import RenderProductionMenu from "./pages/renderProductionMenu";
import RenderProductionPoster from "./pages/renderProductionPoster";
import RenderProductionMenuBook from "./pages/renderProductionMenuBook";
import TemplateWraper from "./pages/templateWraper";
import MenuBookWraper from "./pages/menuBookWrapper";
import PosterTemplateWraper from "./pages/posterTemplateWrapper";
import MyCollection from "./pages/collection";
import Receipt from "./pages/receipt";
import CheckoutPage from "./pages/checkoutPage";


// Admin //
import AdminPage from "./admin";
import Features from "./admin/features";
import EditTemplate from "./admin/editTemplate";
import EditMenuBook from "./admin/editMenuBook";
import EditPosterTemplate from "./admin/editPosterTemplate";
import EditPricing from "./admin/editPricing";

// Business //
import BusinessPage from "./business/index";
import BusinessProducts from "./business/businessProducts";
import BusinessOrders from "./business/businessOrders";
import BusinessPayment from "./business/businessPayments";
import BusinessSetting from "./business/businessSetting";
import BusinessSummary from "./business/summary";
import BusinessLogin from "./business/businessLogin";
import BusinessPaymentMethod from "./business/businessPaymentMethod";


/* import TestTemplate from "./templates/testTemplate";  */
/*import TestPage from "./test/testPage";*/

export default function App() {
  const startRef = useRef(false);
  useEffect(() => {
    if(startRef.current) return;
    startRef.current = true;
    notificationMessageListener();
  }, []);

  return (
    <ThemeProvider>
      <UserProvider>
        <BusinessProvider>
          <SocketProvider>
            <main>
              <Routes>
              <Route path="/" element={<Onboarding />} />
              <Route path="/login" element={<Login />} />
              <Route path="/business/login" element={<BusinessLogin />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/demo" element={<Demo />} />

              <Route path="/poster/:type/template/:id" element={<RenderProductionPoster />} />
              <Route path="/receipt/:type" element={<Receipt />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route element={<ProductionProtection />}>
                <Route path="/menu/:type/template/:id" element={<RenderProductionMenu />} />  
                <Route path="/menubook/:type/template/:id" element={<RenderProductionMenuBook />} /> 
              </Route>
              {/* <Route path="/test" element={<TestTemplate />} /> */}
              {/*<Route path="/test" element={<TestPage />} /> */}
        
              {/*Protect routers */}
              <Route element={<ProtectedRoute />}>
                <Route path="/menu" element={<MenuPage />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/business/payment" element={<BusinessPayment />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/collection" element={<MyCollection />} />
                <Route path="/:type/template/:id" element={<TemplateWraper />} /> 
                <Route path="/:type/poster/template/:id" element={<PosterTemplateWraper />} />
                <Route path="/:type/menuBook/:id" element={<MenuBookWraper />} />
                {/* Admin route */}
                <Route element={<AdminProtection />}>
                  <Route path="/admin" element={<AdminPage />} />
                  <Route path="/admin/edit/template" element={<EditTemplate />} />
                  <Route path="/admin/edit/menubook" element={<EditMenuBook />} />
                  <Route path="/admin/edit/poster" element={<EditPosterTemplate />} />
                  <Route path="/admin/edit/pricing-business" element={<EditPricing />} />
                  <Route path="/admin/features" element={<Features />} />
                </Route>

                {/* Business route */}
                <Route element={<BusinessProtection />}>
                  <Route path="/business" element={<BusinessPage />} />
                  <Route path="/business/orders" element={<BusinessOrders />} />
                  <Route path="/business/products" element={<BusinessProducts />} />
                  <Route path="/business/summary" element={<BusinessSummary />} />
                  <Route path="/business/setting" element={<BusinessSetting />} />
                  <Route path="/business/payment-method" element={<BusinessPaymentMethod />} />
                </Route>
              </Route>
              
            </Routes>
          </main>
        </SocketProvider>
      </BusinessProvider>
    </UserProvider>
  </ThemeProvider>
  );
}

// https://www.canva.com/design/DAG-s06k6QU/bF-91urykVfp8HFFlzRSqg/edit?ui=eyJBIjp7fX0
