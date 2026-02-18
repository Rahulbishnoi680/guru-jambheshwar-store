import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="flex gap-4 bg-blue-200 flex-col">
      <NavLink to="/">Home</NavLink>
      <NavLink to="/about">About</NavLink>
      <NavLink to="/contact-us">Conatct us</NavLink>
    </div>
  );
};

export default Sidebar;
