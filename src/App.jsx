import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./ApiContext/userContext";
import Onboarding from "./pages/onboarding";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Home from "./pages/home";
import Payment from "./pages/payment";
import ProfileQuestionnaire from "./pages/profileQuestionnaire";
import PersonalStylish from "./pages/personalStylish";
import Profile from "./pages/profile";
import Recommendations from "./pages/recommendations";
import TryOn from "./pages/tryon";
import CreatePoses from "./pages/createPose";
import Products from "./pages/products";



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
            <Route path="/createPoses" element={<CreatePoses />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/tryon" element={<TryOn />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/products" element={<Products />} />
            {/*  
            <Route path="/personalStylish" element={<PersonalStylish />} />
            
             */}
          </Routes>
        </main>
      </BrowserRouter>
    </UserProvider>
  );
}
