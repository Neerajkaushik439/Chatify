import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MessageSquare,
  Phone, // changed label to Mobile
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaLinkedin } from "react-icons/fa";
const backendURL = import.meta.env.MODE === "development" ? 'http://localhost:3000' : import.meta.env.VITE_BACKEND_URL;


const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginWithMobile, setLoginWithMobile] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    mobile: "",
    password: "",
  });

  const { login, isLogginIn } = useAuthStore();


  const handleGoogleLogin = () => {
    window.location.href = `${backendURL}/api/auth/oauth/google`;
  };
  const handleFacebookLogin = () => {
    window.location.href = `${backendURL}/api/auth/oauth/facebook`;
  };
  const handleLinkedInLogin = () => {
    window.location.href = `${backendURL}/api/auth/oauth/linkedin`;
  };

  const validateForm = () => {
    if (loginWithMobile) {
      if (!formData.mobile.trim())
        return toast.error("Mobile number is required");
      const sanitizedMobile = formData.mobile.replace(/\D/g, "");
      if (sanitizedMobile.length !== 10)
        return toast.error("Enter a valid 10-digit mobile number");
    } else {
      if (!formData.email.trim()) return toast.error("Email is required");
      if (!/\S+@\S+\.\S+/.test(formData.email))
        return toast.error("Invalid email format");
    }
    if (!formData.password) return toast.error("Password is required");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = validateForm();
    if (success === true) {
      const payload = loginWithMobile
        ? { mobile: formData.mobile, password: formData.password }
        : { email: formData.email, password: formData.password };

      login(payload);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-xl p-8 space-y-8">
        {/* LOGO */}
        <div className="text-center mb-4">
          <div className="flex flex-col items-center gap-2 group">
            <div
              className="size-12 rounded-full bg-primary/10 flex items-center justify-center
              group-hover:bg-primary/20 transition-colors shadow-md"
            >
              <MessageSquare className="size-6 text-primary" />
            </div>
            <h1 className="text-3xl font-extrabold mt-3 text-primary">
              Welcome Back
            </h1>
            <p className="text-base-content/70">Log in to continue</p>
          </div>
        </div>

        {/* Social Login Buttons */}
        {/*
        <div className="space-y-3">
          <button
            onClick={handleGoogleLogin}
            className="btn w-full flex items-center gap-2 bg-blue-600 text-white rounded-lg shadow-sm"
          >
            <FcGoogle size={22} /> Continue with Google
          </button>
          
        </div>

        <div className="divider">Or log in with email / mobile</div>
        */}

        {/* Email/Mobile Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Toggle: Email / Mobile */}
          <div className="flex justify-center gap-4 mb-4">
            <button
              type="button"
              onClick={() => setLoginWithMobile(false)}
              className={`px-4 py-2 rounded-lg ${
                !loginWithMobile ? "bg-primary text-white" : "bg-base-200"
              }`}
            >
              Email
            </button>
            <button
              type="button"
              onClick={() => setLoginWithMobile(true)}
              className={`px-4 py-2 rounded-lg ${
                loginWithMobile ? "bg-primary text-white" : "bg-base-200"
              }`}
            >
              Mobile
            </button>
          </div>

          {/* Email Input */}
          {!loginWithMobile && (
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className="input input-bordered w-full pl-10 rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>
          )}

          {/* Mobile Input */}
          {loginWithMobile && (
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Mobile</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="size-5 text-base-content/40" />
                </div>
                <input
                  type="tel"
                  inputMode="tel"
                  className="input input-bordered w-full pl-10 rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="9876543210"
                  value={formData.mobile}
                  onChange={(e) =>
                    setFormData({ ...formData, mobile: e.target.value })
                  }
                />
              </div>
            </div>
          )}

          {/* Password */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Password</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="size-5 text-base-content/40" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className="input input-bordered w-full pl-10 rounded-lg focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="size-5 text-base-content/40" />
                ) : (
                  <Eye className="size-5 text-base-content/40" />
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary w-full rounded-lg shadow-md"
            disabled={isLogginIn}
          >
            {isLogginIn ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Logging in...
              </>
            ) : (
              "Log In"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center">
          <p className="text-base-content/70">
            New here?{" "}
            <Link to="/signup" className="link link-primary font-semibold">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
