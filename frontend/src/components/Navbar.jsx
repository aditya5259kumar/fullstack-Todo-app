import { useContext } from "react";
import { RiFileList3Fill } from "react-icons/ri";
import { MdLogin, MdLogout } from "react-icons/md";

import { AuthContext } from "../context/AuthContext";
import { ModelContext } from "../context/ModelContext";
import UserProfile from "./UserProfile";
import LogIn from "./LogIn";
import SignUp from "./SignUp";

const Navbar = () => {
  const { isLoggedIn, currentUser, handleLogout } = useContext(AuthContext);

  const {
    showLogin,
    loginHandler,
    showSignUp,
    // signupHandler,
    showProfile,
    profileHandler,
  } = useContext(ModelContext);

  // function logoutHandler(e) {
  //   e.preventDefault();
  //   if (window.confirm("Are you sure you want to logout?")) {
  //     handleLogout();
  //   }
  // }

  // console.log(currentUser.user_profile.name)

  const UserName = currentUser?.user_profile?.name
    ?.split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="bg-gray-900 fixed top-0 left-0 right-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-2 text-gray-200 text-2xl font-bold">
            <span className="text-blue-500 text-3xl">
              <RiFileList3Fill />
            </span>
            TaskMelt
          </span>

          <div className="flex items-center space-x-4">
            {/* user profile */}
            {isLoggedIn && (
              <>
                {currentUser?.user_profile ? (
                  <div
                    onClick={profileHandler}
                    className="group flex items-center gap-2 cursor-pointer hover:brightness-90 transition-all"
                  >
                    <div className="p-2 flex items-center justify-center bg-purple-600 text-white font-bold text-[14px] relative w-10 h-10 rounded-full shadow-lg">
                      {UserName}
                    </div>

                    <p className="hidden sm:flex group-hover:underline text-white font-semibold">
                      {currentUser.user_profile.name}
                    </p>
                  </div>
                ) : (
                  <p className="text-white text-sm font-medium">Loading...</p>
                )}
              </>
            )}

            {/* {!isLoggedIn && (
              <a
                onClick={loginHandler}
                className="text-sm py-2 px-5 font-semibold rounded-md text-gray-300 hover:text-white transition cursor-pointer"
              >
                Login
              </a>
            )} */}

            <button
              onClick={loginHandler}
              className={`${isLoggedIn ? "hidden" : "flex"} items-center gap-1 text-sm py-2 px-5 font-semibold rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition`}
            >
              LogIn{" "}
              <span className="text-lg">
                <MdLogin />
              </span>
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
