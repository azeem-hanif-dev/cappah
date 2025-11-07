import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  CalendarRange,
  Users,
  Settings,
  CircleHelp,
  ShoppingCart,
  Notebook,
} from "lucide-react";
import logo from "/common/Logo.svg";

const Sidebar = ({ isOpen, onClose, role }) => {
  const allNavLinks = [
    { title: "Dashboard", path: "/admin", icon: <LayoutDashboard size={20} /> },
    { title: "Category", path: "/admin/category", icon: <Package size={20} /> },
    {
      title: "Products",
      path: "/admin/products",
      icon: <ShoppingCart size={20} />,
    },
    {
      title: "Exhibition",
      path: "/admin/exhibition",
      icon: <CalendarRange size={20} />,
    },
    {
      title: "Enquiry",
      path: "/admin/enquiry",
      icon: <CircleHelp size={20} />,
    },
  ];

  // Additional links for SuperAdmin
  const superAdminLinks = [
    {
      title: "User Management",
      path: "/admin/usermanagement",
      icon: <Users size={20} />,
    },
    {
      title: "Privilege",
      path: "/admin/privilege",
      icon: <Notebook size={20} />,
    },
    { title: "Logs", path: "/admin/logs", icon: <Settings size={20} /> },
  ];

  // Final links based on role
  const navLinks =
    role === "superAdmin" ? [...allNavLinks, ...superAdminLinks] : allNavLinks;

  return (
    <>
      <aside
        className={`fixed top-0 left-0 z-40 h-screen bg-white shadow-lg transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } w-64 flex flex-col min-h-screen`}
      >
        {/* Logo Area */}
        <div className="py-6 px-10">
          <img src={logo} alt="Logo" />
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto">
          <nav className="px-4 space-y-2 minicontent">
            {navLinks.map((link) => (
              <NavLink
                key={link.title}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-lg transition-colors font-semibold ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-admintext hover:bg-primary hover:text-white"
                  }`
                }
                end
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    onClose();
                  }
                }}
              >
                {link.icon}
                <span>{link.title}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer (Fixed to Bottom) */}
        <div className="py-6 px-10 flex flex-col items-center">
          <p className="microcontent text-primary font-light">
            DSZ.CPI.AP.1.00
          </p>
          <p className="text-sm font-light">Powered By Digital Stationz</p>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
};

export default Sidebar;
