import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginUser } from "../api/user";

const schema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
});

export default function LogIn() {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = async (data) => {
    const res = await loginUser(data.username, data.password, data.remember);
    if (res.success) {
      setLoginError("");

      if (data.remember) {
        localStorage.setItem("username", res.data.username);
      } else {
        sessionStorage.setItem("username", res.data.username);
      }

      navigate("/main");
    } else {
      setLoginError(res.msg || "Login failed");
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-bgOrange font-pixelify relative px-4">
      {/* Left Image */}
      <img
        src="/assets/Deadpool.png"
        alt="Pixel Deadpool"
        className="hidden md:block w-50 lg:w-90 xl:w-100 mr-4"
      />

      {/* Center Form */}
      <div className="w-full max-w-md z-10">
        <h1 className="text-4xl text-center font-bold mb-6">Log in an account</h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-LoginBlue p-6 rounded-lg shadow-md w-full"
        >
          <label className="block mt-4">Username</label>
          <input
            {...register("username")}
            className="bg-white w-full p-2 border rounded mt-1"
            placeholder="Enter your username"
          />
          {errors.username && (
            <p className="text-yellow-500 text-sm">{errors.username.message}</p>
          )}

          <label className="block mt-4">Password</label>
          <input
            {...register("password")}
            type="password"
            className="bg-white w-full p-2 border rounded mt-1"
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="text-yellow-500 text-sm">{errors.password.message}</p>
          )}

          <div className="flex items-center mt-3">
            <input type="checkbox" {...register("remember")} className="mr-2" />
            <label className="text-sm">Remember Me</label>
          </div>

          {loginError && (
            <p className="text-yellow-500 text-sm mt-3 text-center">{loginError}</p>
          )}

          <button
            type="submit"
            className="w-full bg-LoginGrey hover:bg-black text-white p-2 mt-4 rounded font-bold border border-black"
          >
            Log In
          </button>

          <p className="mt-4 text-center">
            Doesn’t have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="text-yellow-500 hover:underline"
            >
              Sign Up
            </button>
          </p>
        </form>
      </div>

      <img
        src="/assets/Mike.png"
        alt="Pixel Green Guy"
        className="hidden md:block w-40 lg:w-60 xl:w-100 ml-4 bottom-full"
      />
    </div>
  );
}
