import { useContext } from "react";
import { ModelContext } from "../context/ModelContext";
import { AuthConetext } from "../context/AuthContext";
import { RxCross2 } from "react-icons/rx";
import { BiEditAlt } from "react-icons/bi";
import { MdLogout } from "react-icons/md";

import defaultUser from "../assets/defaultUser.jpg";

const UserProfile = () => {
  const { closeModelHandler } = useContext(ModelContext);
  const { currentUser, handleLogout } = useContext(AuthConetext);

  function logoutHandler() {
    if (window.confirm("Are you sure you want to logout?")) {
      handleLogout();
    }
  }

  console.log(currentUser)

  // Format date
  function formatDate(dateString) {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div
      onClick={closeModelHandler}
      className="fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center text-sm bg-black/40"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white py-7 px-6 w-115 m-auto rounded-lg relative"
      >
        <div className="flex flex-col">
          <div className="flex items-center gap-6 border-b-2 pb-5 border-gray-200">
            <div className="cursor-pointer relative w-18 h-18 hover:brightness-90 transition-all">
              <img
                src={defaultUser}
                alt="user pfp"
                className="w-full h-full object-cover rounded-full shadow-lg"
              />
              <span className="absolute right-0 bottom-0 shadow-md z-20 bg-gray-100 rounded-full p-1 text-lg text-gray-600">
                <BiEditAlt />
              </span>
            </div>

            <div className="flex flex-col text-gray-500/90 font-semibold text-[15px]">
              <p className="text-[16px] font-bold text-gray-600">
                {currentUser.user_profile.name || "User"}
              </p>
              <p>{currentUser?.email || "email@example.com"}</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-gray-500/90 font-semibold text-md border-b-2 py-5 border-gray-200/50">
            <p className="text-[15.5px] text-gray-500 font-bold">Name</p>
            <span>{currentUser.user_profile.name || "N/A"}</span>
          </div>
          <div className="flex items-center justify-between text-gray-500/90 font-semibold text-md border-b-2 py-5 border-gray-200/50">
            <p className="text-[15.5px] text-gray-500 font-bold">Email</p>
            <p>{currentUser?.email || "N/A"}</p>
          </div>
          <div className="flex items-center justify-between text-gray-500/90 font-semibold text-md border-b-2 py-5 border-gray-200/50">
            <p className="text-[15.5px] text-gray-500 font-bold">Created At</p>
            <span>{formatDate(currentUser?.createdAt)}</span>
          </div>
          <div className="flex items-center justify-between text-gray-500/90 font-semibold text-md border-b-2 py-5 mb-5 border-gray-200/50">
            <p className="text-[15.5px] text-gray-500 font-bold">Updated At</p>
            <span>{formatDate(currentUser.user_profile.updatedAt)}</span>
          </div>
        </div>

        <div className="flex justify-end items-center gap-4">
          <button
            onClick={logoutHandler}
            className="flex items-center gap-1 mt-4 py-2 px-3 text-center bg-gray-800 rounded-lg text-white hover:bg-gray-700"
          >
            <span className="text-lg">
              <MdLogout />
            </span>
            LogOut
          </button>
        </div>

        <span
          onClick={closeModelHandler}
          className="cursor-pointer absolute top-1 right-1 text-md font-extrabold p-1 rounded-full hover:bg-gray-100 text-2xl text-gray-400 transition-all"
        >
          <RxCross2 />
        </span>
      </div>
    </div>
  );
};

export default UserProfile;