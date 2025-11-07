import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  return (
    <div className="flex h-screen">
      {/* Left Side - Gradient Background */}
      <div
        style={{
          backgroundImage: `url(${"./common/loginBg.svg"})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
        className="hidden lg:flex lg:w-1/2 items-center justify-center p-12"
      >
        <div className="text-center">
          <img
            src="./common/Logo.svg"
            alt="Cappah International"
            className="w-64 h-auto mb-4"
          />
        </div>
      </div>

      {/* Right Side - Sky Blue Background */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col min-h-screen">
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-md w-full p-8">
            <h2 className="text-3xl font-bold text-center font-sans text-[#323232] mb-8">
              SIGN UP
            </h2>
            <form>
              {/* Form content remains the same */}
              {/* Username */}
              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="block text-text text-sm font-sans mb-2"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  className="w-full px-3 bg-white py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-seagreen"
                  placeholder="Username"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-text text-sm font-sans mb-2"
                >
                  Email
                </label>
                <input
                  type="text"
                  id="email"
                  className="w-full px-3 bg-white py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-seagreen"
                  placeholder="Email"
                />
              </div>

              {/* Password */}
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-text text-sm font-normal font-sans mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="w-full px-3 bg-white py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-seagreen"
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forget Password */}
              <div className="flex items-center justify-between mb-4">
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="custom-checkbox"
                  />
                  <span className="ml-2">Remember Me</span>
                </label>

                <button
                  type="button"
                  className="text-sm text-text font-sans font-normal hover:underline"
                >
                  Forget Password?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full text-white bg-seagreen py-2 px-4 rounded-md hover:bg-text focus:outline-none focus:ring-2 focus:ring-seagreen focus:ring-opacity-50 mb-4"
              >
                Login
              </button>

              {/* Sign Up */}
              <p className="text-center text-sm text-gray-700">
                Already have an account?
                <button className="text-primary font-semibold hover:underline">
                  Login
                </button>
              </p>
            </form>
          </div>
        </div>

        {/* Footer Section - Adjusted positioning */}
        <div className="flex mb-10 flex-col items-center space-y-0.5">
          <p className="text-center text-sm text-primary">DCW_AD_V 1.0</p>
          <p className="text-center text-sm text-gray-700 font-light">
            Powered By Digital Stationz
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
