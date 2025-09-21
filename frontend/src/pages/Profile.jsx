import React, { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import { Camera, Mail, User, Phone, Edit2, Save } from "lucide-react";

const Profile = () => {
  const { authUser, isUpdatingPfp, updatePfp, updateUserProfile, isUpdatingProfile } = useAuthStore();

  const [selectedImg, setSelectedImg] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(authUser?.fullname || "");

  // keep the input synced if authUser changes (for example after login or refresh)
  useEffect(() => {
    setNewName(authUser?.fullname || "");
  }, [authUser]);

  // Handle Profile Picture Upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64 = reader.result;
      setSelectedImg(base64);

      await updatePfp({ pfp: base64 });
    };
  };

  // Handle Name Save
  const handleSaveName = async () => {
    try {
      // Call backend API / store method to update user fullname
      await updateUserProfile({ fullname: newName });
      // reflect locally as well
      setIsEditingName(false);
    } catch (error) {
      console.error("Error updating name:", error);
    }
  };

  return (
    <div>
      <div className="h-screen pt-20">
        <div className="max-w-2xl mx-auto p-4 py-8">
          <div className="bg-base-300 rounded-xl p-6 space-y-8">
            <div className="text-center">
              <h1 className="text-2xl font-semibold">Profile</h1>
              <p className="mt-2">Your profile information</p>
            </div>

            {/* Avatar Upload Section */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <img
                  src={selectedImg || authUser.pfp || "/avatar.png"}
                  alt="Profile"
                  className="size-32 rounded-full object-cover border-4 "
                />
                <label
                  htmlFor="avatar-upload"
                  className={`
                    absolute bottom-0 right-0 
                    bg-base-content hover:scale-105
                    p-2 rounded-full cursor-pointer 
                    transition-all duration-200
                    ${isUpdatingPfp ? "animate-pulse pointer-events-none" : ""}
                  `}
                >
                  <Camera className="w-5 h-5 text-base-200" />
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUpdatingPfp}
                  />
                </label>
              </div>
              <p className="text-sm text-zinc-400">
                {isUpdatingPfp
                  ? "Uploading..."
                  : "Click the camera icon to update your photo"}
              </p>
            </div>

            {/* User Info Section */}
            <div className="space-y-6">
              {/* Full Name with Edit Option */}
              <div className="space-y-1.5">
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </div>

                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="px-4 py-2.5 bg-base-200 rounded-lg border w-full"
                    />
                    <button
                      onClick={handleSaveName}
                      className="px-3 py-2 bg-green-600 text-white rounded-lg flex items-center gap-1"
                    >
                      <Save size={16} /> Save
                    </button>
                  </div>
                ) : (
                  <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                    {authUser?.fullname}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </div>
                <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                  {authUser?.email}
                </p>
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </div>
                <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                  {authUser?.mobile || "Not Provided"}
                </p>
              </div>
            </div>

            {/* Account Information */}
            <div className="mt-6 bg-base-300 rounded-xl p-6">
              <h2 className="text-lg font-medium mb-4">Account Information</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                  <span>Member Since</span>
                  <span>{authUser.createdAt?.split("T")[0]}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span>Account Status</span>
                  <span className="text-green-500">Active</span>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            {!isEditingName && (
              <div className="flex justify-end">
                <button
                  onClick={() => setIsEditingName(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
                >
                  <Edit2 size={16} /> Edit Name
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
