import { useContext } from "react";
import { RiFileList3Fill } from "react-icons/ri";
import { MdLogin, MdLogout } from "react-icons/md";
import defaultUser from "../assets/defaultUser.jpg";

import { AuthConetext } from "../context/AuthContext";
import { ModelContext } from "../context/ModelContext";
import UserProfile from "./UserProfile";
import LogIn from "./LogIn";
import SignUp from "./SignUp";

const Navbar = () => {
  const { isLoggedIn, currentUser, handleLogout } = useContext(AuthConetext);

  const {
    showLogin,
    loginHandler,
    showSignUp,
    signupHandler,
    showProfile,
    profileHandler,
  } = useContext(ModelContext);

  function logoutHandler(e) {
    e.preventDefault();
    if (window.confirm("Are you sure you want to logout?")) {
      handleLogout();
    }
  }

  // console.log(currentUser.user_profile.name)

  return (
    <header className="bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-2 text-gray-200 text-2xl font-bold">
            <span className="text-blue-500 text-3xl">
              <RiFileList3Fill />
            </span>
            ToDo List
          </span>

          <div className="flex items-center space-x-4">
            {/* user profile */}
            {isLoggedIn && (
              <div
                onClick={profileHandler}
                className="flex items-center gap-2 cursor-pointer hover:brightness-90 transition-all"
              >
                <div className="cursor-pointer relative w-8 h-8 ">
                  <img
                    src={defaultUser}
                    alt="user pfp"
                    className="w-full h-full object-cover rounded-full shadow-lg"
                  />
                </div>
                <p className="text-sm font-bold text-gray-200">
                  {currentUser?.user_profile?.name || "User"}
                </p>
              </div>
            )}

            {!isLoggedIn && (
              <a
                onClick={loginHandler}
                className="text-sm py-2 px-5 font-semibold rounded-md text-gray-300 hover:text-white transition cursor-pointer"
              >
                Login
              </a>
            )}

            <button
              onClick={isLoggedIn ? logoutHandler : signupHandler}
              className="flex items-center gap-1 text-sm py-2 px-5 font-semibold rounded-md text-white bg-blue-500 hover:bg-blue-600 transition"
            >
              <span className="text-lg">
                {isLoggedIn ? <MdLogout /> : <MdLogin />}
              </span>
              {isLoggedIn ? "LogOut" : "SignIn"}
            </button>
          </div>
        </div>
      </div>

      {showProfile && <UserProfile />}
      {showLogin && <LogIn />}
      {showSignUp && <SignUp />}
    </header>
  );
};

export default Navbar;