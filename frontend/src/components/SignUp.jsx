import { useState, useContext } from "react";
import { ModelContext } from "../context/ModelContext";
import { signUpAPI } from "../services/api";
import { toast } from "react-toastify";

const SignUp = () => {
  const { loginHandler, closeModelHandler } = useContext(ModelContext);

  const [data, setData] = useState({ name: "", email: "", password: "" });
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

  function passwordShowToggle() {
    setpasswordShow((prev) => !prev);
  }

  async function submitHandler(e) {
    e.preventDefault();

    const newErrors = {};

    if (!data.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!data.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
      newErrors.email = "Invalid email";
    }

    if (!data.password) {
      newErrors.password = "Password is required";
    } else if (data.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/.test(
        data.password,
      )
    ) {
      newErrors.password =
        "Password must contain at least one lowercase letter, uppercase letter, number, and special character";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        setLoading(true);
        setApiError("");

        await signUpAPI(data);
        toast.success("Account created successfully! Please log in.");
        loginHandler(e);
      } catch (error) {
        setApiError(error.message || "Failed to sign up. Please try again.");
      } finally {
        setLoading(false);
      }
    }
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
        <h2 className="text-center font-bold text-3xl mb-6">Sign Up</h2>

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
              placeholder="name"
              type="text"
              name="name"
              value={data.name}
              autoComplete="off"
              onChange={inputHandler}
              disabled={loading}
              className="w-full focus:outline-blue-400 border-2 border-gray-300 px-3 py-2 text-sm rounded-md disabled:bg-gray-100"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <input
              placeholder="email"
              type="email"
              name="email"
              value={data.email}
              autoComplete="off"
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
              autoComplete="off"
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
                Creating Account...
              </>
            ) : (
              "SignUp"
            )}
          </button>

          <p className="text-center text-gray-500">
            Already have an account?{" "}
            <button
              type="button"
              onClick={loginHandler}
              className="text-blue-500 font-bold cursor-pointer hover:underline"
            >
              Login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
