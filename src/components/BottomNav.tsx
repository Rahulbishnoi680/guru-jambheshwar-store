import { FaBoxOpen, FaUser } from "react-icons/fa";
import { IoIosList } from "react-icons/io";
import { LuNotebookPen } from "react-icons/lu";
import { NavLink, useNavigate } from "react-router-dom";
import { logoutLocal } from "../utils/auth";

const BottomNav = () => {
  const navigate = useNavigate();
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-sm">
      <ul className="flex justify-around items-center h-14 text-sm">
        <li>
          <NavLink
            to="/add"
            className={({ isActive }) =>
              `px-4 py-2 rounded-md ${isActive ? "text-indigo-600 font-semibold" : "text-gray-700"}`
            }
          >
            <FaBoxOpen />
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/list"
            className={({ isActive }) =>
              `px-4 py-2 rounded-md ${isActive ? "text-indigo-600 font-semibold" : "text-gray-700"}`
            }
          >
            <IoIosList />
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/notes"
            className={({ isActive }) =>
              `px-4 py-2 rounded-md ${isActive ? "text-indigo-600 font-semibold" : "text-gray-700"}`
            }
          >
            <LuNotebookPen />

          </NavLink>
        </li>
        <li> <button
          // className="px-3 py-1 rounded-md bg-indigo-500 hover:bg-indigo-700"
          onClick={() => {
            logoutLocal();
            navigate("/login", { replace: true });
          }}
        >
          <FaUser />

        </button></li>
      </ul>
    </nav>
  );
};

export default BottomNav;

