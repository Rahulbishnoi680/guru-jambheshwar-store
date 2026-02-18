
import { getUserName } from "../../utils/auth";

const Header = () => {
  const name = getUserName();
  return (
    <div className="bg-orange-600 text-white">
      <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col md:flex-row  justify-between gap-2">
        <div className="font-semibold items-center">
          Guru Jambheswer Kiryana Store
        </div>
        <div className="text-sm flex items-start gap-3">
          {name && <span className="opacity-90 text-xs">Hi, {name}</span>}
          {/* <button
            className="px-3 py-1 rounded-md bg-indigo-500 hover:bg-indigo-700"
            onClick={() => {
              logoutLocal();
              navigate("/login", { replace: true });
            }}
          >
            Logout
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default Header;
