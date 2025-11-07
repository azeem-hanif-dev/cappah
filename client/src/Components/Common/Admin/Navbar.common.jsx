import React, { useState, useRef, useEffect } from "react";
import { User, ChevronDown, LogOut } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../Redux/reducers/authSlice";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import ProfileModal from "../../../Modals/Admin/UserProfile/ProfileModal";

const Navbar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const profileRef = useRef();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navMenuItems = [
    {
      title: "Profile",
      icon: <User className="w-5 h-5" />,
      onClick: () => setIsProfileModalOpen(true),
    },
    {
      title: "Logout",
      icon: <LogOut className="w-5 h-5" />,
      onClick: () => {
        dispatch(logout());
        navigate("/admin/login");
      },
    },
  ];

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isProfileOpen]);

  const handleProfileClick = () => {
    setIsProfileOpen((prevState) => !prevState);
  };

  // Check if the current path is not "/main" and apply the rounded-b-lg class
  const navbarClass =
    location.pathname === "/admin"
      ? "bg-navback text-white h-full isolate_bars flex justify-between items-center minicontent"
      : "bg-navback text-white h-full isolate_bars flex justify-between items-center rounded-b-lg minicontent";

  return (
    <div className={navbarClass}>
      <h2 className="subheading3">Welcome!</h2>
      <div className="flex items-center gap-4 minicontent">
        <div className="relative">
          <button
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-primary"
            onClick={handleProfileClick}
          >
            <div className=" flex items-center justify-center text-white">
              <User size={20} />
            </div>
            <span className="hidden md:inline pr-8 truncate max-w-[15ch] overflow-hidden whitespace-nowrap capitalize">
              {user?.username || "User Name"}
            </span>
            <ChevronDown size={20} />
          </button>

          {isProfileOpen && (
            <div
              ref={profileRef}
              className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-2 z-50 bg-white text-black"
            >
              {navMenuItems.map((item, index) => (
                <button
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-primary w-full hover:text-white"
                  onClick={item.onClick}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <ProfileModal
        user={user}
        isProfileModalOpen={isProfileModalOpen}
        setIsProfileModalOpen={setIsProfileModalOpen}
        onUpdate={() => {
          dispatch(logout());
          navigate("/admin/login");
        }}
      />
    </div>
  );
};

export default Navbar;
