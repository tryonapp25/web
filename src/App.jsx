import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./ApiContext/userContext";
import Onboarding from "./pages/onboarding";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Home from "./pages/home";
import ProfileQuestionnaire from "./pages/profileQuestionnaire";
import PersonalStylish from "./pages/personalStylish";
import Profile from "./pages/profile";
import Recommendations from "./pages/recommendations";
import TryOn from "./pages/tryon";
import CreatePoses from "./pages/createPose";



export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <main>
          <Routes>
            <Route path="/" element={<Onboarding />} />
            {/* <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/q" element={<ProfileQuestionnaire />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/personalStylish" element={<PersonalStylish />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/tryon" element={<TryOn />} />
            <Route path="/createPoses" element={<CreatePoses />} /> */}
          </Routes>
        </main>
      </BrowserRouter>
    </UserProvider>
  );
}
