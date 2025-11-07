import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Navbar from "../../Components/Common/Admin/Navbar.common";
import Sidebar from "../../Components/Common/Admin/Sidebar.common";
import { useSelector, useDispatch } from "react-redux";

const Admin = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { permissions, isLoading, error, role } = useSelector(
    (state) => state.userPermissions
  );

  return (
    <div className="min-h-screen flex bg-bggray">
      {/* Sidebar Toggle Button for Mobile */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-md bg-white shadow-md"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} role={permissions.role} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Navbar */}
        <div className="h-16 fixed top-0 left-0 right-0 lg:left-64 z-30 bg-white ">
          <Navbar />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto mt-16  scrollbar-hide">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Admin;
