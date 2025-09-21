import Navbar from "./components/Navbar";
import './index.css'
import Home from "./pages/Home.jsx";
import SignUp from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import Settings from "./pages/Settings.jsx";
import Profile from "./pages/Profile.jsx";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";

import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "./store/useThemeStore.js";
import Layout from "./Layout.jsx";
import AuthCallback from "./auth/callback/page.jsx";

const App = () => {
  const { theme } = useThemeStore();
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();

  console.log({ onlineUsers });
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);


  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div >
      <BrowserRouter>



        <Routes>
          <Route path="/login/success" element={<AuthCallback />} />
          <Route element={<Layout />}>
            <Route path="/" element={authUser ? <Home /> : <Navigate to="/login" />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={authUser ? <Profile /> : <Navigate to="/login" />} />
          </Route>

          <Route path="/signup" element={!authUser ? <SignUp /> : <Navigate to="/" />} />
          <Route path="/login" element={!authUser ? <Login /> : <Navigate to="/" />} />

        </Routes>

        <Toaster />
      </BrowserRouter>
    </div>
  );
};
export default App;