import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  User,
  Phone,
} from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaLinkedin } from "react-icons/fa";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    mobile: "", // changed from phone
  });

  const { signup, isSigningUp } = useAuthStore();

  const backendURL = "http://localhost:3000"; // update if deployed

  const handleGoogleLogin = () => {
    window.location.href = `${backendURL}/api/auth/oauth/google`;
  };
  const handleFacebookLogin = () => {
    window.location.href = `${backendURL}/auth/facebook`;
  };
  const handleLinkedInLogin = () => {
    window.location.href = `${backendURL}/auth/linkedin`;
  };

  const validateForm = () => {
    if (!formData.fullname.trim()) return toast.error("Full name is required");
    if (!formData.mobile.trim()) return toast.error("Mobile number is required");
    const sanitizedMobile = formData.mobile.replace(/\D/g, "");
    if (sanitizedMobile.length !== 10)
      return toast.error("Enter a valid 10-digit mobile number");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 characters");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = validateForm();
    if (success === true) {
      signup(formData);
    }
    
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-xl p-8 space-y-8">
        {/* LOGO */}
        <div className="text-center mb-4">
          <div className="flex flex-col items-center gap-2 group">
            <h1 className="text-3xl font-extrabold mt-3 text-primary">
              Sign Up
            </h1>
            <p className="text-base-content/70">
              Create your free account and get started
            </p>
          </div>
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleGoogleLogin}
            className="btn w-full flex items-center gap-2 bg-blue-600 text-white rounded-lg shadow-sm"
          >
            <FcGoogle size={22} /> Continue with Google
          </button>
          
        </div>

        <div className="divider">Or sign up with email</div>

        {/* Email/Mobile Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Fullname */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Full Name</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="size-5 text-base-content/40" />
              </div>
              <input
                type="text"
                className="input input-bordered w-full pl-10 rounded-lg focus:ring-2 focus:ring-primary"
                placeholder="John Doe"
                value={formData.fullname}
                onChange={(e) =>
                  setFormData({ ...formData, fullname: e.target.value })
                }
              />
            </div>
          </div>

          {/* Mobile */}
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
            <p className="text-xs text-base-content/50 mt-1">
              We use a 10-digit mobile number (no country code).
            </p>
          </div>

          {/* Email */}
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
            disabled={isSigningUp}
          >
            {isSigningUp ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center">
          <p className="text-base-content/70">
            Already have an account?{" "}
            <Link to="/login" className="link link-primary font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
