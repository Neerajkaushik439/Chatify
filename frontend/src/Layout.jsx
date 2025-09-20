// src/components/Layout.js
import React from "react";
import Navbar from "../src/components/Navbar"; // Import your existing Navbar
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex flex-col h-screen w-screen ">
      {/* Navbar at the top */}
      <Navbar />

      {/* Main content area */}
      <main className="">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
