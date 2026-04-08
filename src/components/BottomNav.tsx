import { useState } from "react";
import { FaBoxOpen, FaUser } from "react-icons/fa";
import { IoIosList } from "react-icons/io";
import { LuNotebookPen } from "react-icons/lu";
import { NavLink, useNavigate } from "react-router-dom";
import { logoutLocal } from "../utils/auth";
import ConfirmModal from "./ConfirmModal";
import { Tooltip } from "@mui/material";

const BottomNav = () => {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    logoutLocal();
    navigate("/login", { replace: true });
    setShowLogoutConfirm(false);
  };

  const baseClass =
    "flex items-center justify-center px-4 py-2 rounded-md transition";

  const activeClass = "text-indigo-600 font-semibold";
  const inactiveClass = "text-gray-600 hover:text-indigo-500";

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-sm z-50">
      <ul className="flex justify-around items-center h-14 text-xl">

        {/* Add */}
        <li>
          <Tooltip title="Add Product" arrow>
            <NavLink
              to="/add"
              className={({ isActive }) =>
                `${baseClass} ${isActive ? activeClass : inactiveClass}`
              }
            >
              <FaBoxOpen />
            </NavLink>
          </Tooltip>
        </li>

        {/* List */}
        <li>
          <Tooltip title="Product List" arrow>
            <NavLink
              to="/list"
              className={({ isActive }) =>
                `${baseClass} ${isActive ? activeClass : inactiveClass}`
              }
            >
              <IoIosList />
            </NavLink>
          </Tooltip>
        </li>

        {/* Notes */}
        <li>
          <Tooltip title="Notes" arrow>
            <NavLink
              to="/notes"
              className={({ isActive }) =>
                `${baseClass} ${isActive ? activeClass : inactiveClass}`
              }
            >
              <LuNotebookPen />
            </NavLink>
          </Tooltip>
        </li>

        {/* Profile / Logout */}
        <li>
          <Tooltip title="Logout" arrow>
            <button
              className={`${baseClass} ${inactiveClass}`}
              onClick={() => setShowLogoutConfirm(true)}
            >
              <FaUser />
            </button>
          </Tooltip>
        </li>
      </ul>

      <ConfirmModal
        open={showLogoutConfirm}
        title="Logout Confirmation"
        description="Are you sure you want to logout?"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
        confirmText="Logout"
      />
    </nav>
  );
};

export default BottomNav;