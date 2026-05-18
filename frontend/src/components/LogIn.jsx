import { useState, useContext } from "react";
import { ModelContext } from "../context/ModelContext";
import { AuthContext } from "../context/AuthContext";
import { logInAPI } from "../services/api";

const LogIn = () => {
  const { signupHandler, closeModelHandler } = useContext(ModelContext);
  const { setUserLoggedIn } = useContext(AuthContext);

  const [data, setData] = useState({ email: "", password: "" });
  const [passwordShow, setpasswordShow] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  function inputHandler(e) {
    setData({ ...data, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
    if (apiError) setApiError("");
  }

  async function submitHandler(e) {
    e.preventDefault();

    const newErrors = {};

    if (!data.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
      newErrors.email = "Invalid email";
    }

    if (!data.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        setLoading(true);
        setApiError("");

        const response = await logInAPI(data);

        // console.log("Login response:", response);

        const storedToken = localStorage.getItem("authToken");
        // console.log("Token stored:", storedToken ? "Yes" : "No");

        if (!storedToken) {
          throw new Error(
            "Token was not saved. Please check your backend response.",
          );
        }

        setUserLoggedIn(response.data);
        // console.log("response.data===========", response.data);
        await setUserLoggedIn();
      } catch (error) {
        console.error("Login error:", error);
        setApiError(error.message || "Invalid email or password");
      } finally {
        setLoading(false);
      }
    }
  }

  function passwordShowToggle() {
    setpasswordShow((prev) => !prev);
  }

  return (
    <div
      onClick={closeModelHandler}
      className="fixed inset-0 z-50 flex items-center text-sm bg-gray-900/40"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white py-7 px-6 w-95 m-auto rounded-lg relative shadow-2xl"
      >
        <h2 className="text-center font-bold text-3xl mb-6">Log In</h2>

        {apiError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {apiError}
          </div>
        )}

        <form
          action=""
          onSubmit={submitHandler}
          className="flex flex-col space-y-4"
        >
          <div>
            <input
              placeholder="email"
              type="email"
              name="email"
              value={data.email}
              onChange={inputHandler}
              disabled={loading}
              className="w-full focus:outline-blue-400 border-2 border-gray-300 px-3 py-2 text-sm rounded-md disabled:bg-gray-100"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div className="relative">
            <input
              placeholder="password"
              type={passwordShow ? "text" : "password"}
              name="password"
              value={data.password}
              onChange={inputHandler}
              disabled={loading}
              className="w-full focus:outline-blue-400 border-2 border-gray-300 px-3 py-2 text-sm rounded-md disabled:bg-gray-100"
            />
            <span
              onClick={passwordShowToggle}
              className="absolute right-1 top-1.5 py-1 px-2 z-20 bg-white font-bold text-gray-600 cursor-pointer"
            >
              {passwordShow ? "hide" : "show"}
            </span>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full py-3 flex items-center justify-center gap-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>

          <p className="text-center text-gray-500">
            don't have account?{" "}
            <button
              type="button"
              onClick={signupHandler}
              className="text-blue-500 font-bold cursor-pointer hover:underline"
            >
              SignUp
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LogIn;
