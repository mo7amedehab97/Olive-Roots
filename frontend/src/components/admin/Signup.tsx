import { useAuth } from "@hooks/useAuth";
import axiosInstance from "@utils/axiosInstance";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  type RegisterFormInputs,
  registerSchema,
} from "@validations/registerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { type AxiosError } from "axios";

const INITIAL_STATE: RegisterFormInputs = {
  name: "",
  email: "",
  password: "",
};

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    defaultValues: INITIAL_STATE,
    resolver: zodResolver(registerSchema),
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values: RegisterFormInputs) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.post("/v1/auth/register", values);
      if (data.success) {
        login({ user: data.user, accessToken: data.accessToken });
        toast.success(data.message || "Signup successful");
        navigate("/admin", { replace: true });
      }
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>;
      const message =
        axiosErr.response?.data?.message || "Something went wrong!";
      console.error(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid h-screen p-2 border place-items-center md:p-0">
      <div className="w-full max-w-sm p-6 border rounded-lg shadow-xl max-md:m-6 border-primary/30 shadow-primary/15">
        <div className="py-8 text-center">
          <h1 className="mb-1 text-4xl font-semibold">
            {" "}
            <span className="text-primary">Admin</span> Signup
          </h1>
          <p className="text-gray-600">Create your admin account</p>
        </div>
        <form
          className="flex flex-col gap-y-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col">
            <label htmlFor="name" className="text-gray-700">
              Name
            </label>
            <input
              type="text"
              {...register("name")}
              placeholder="Your name"
              className={`py-3 transition-all border-b-2 outline-none focus:border-primary/90 focus:caret-primary/90 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 mt-1.5 font-light text-sm">
                {errors.name.message}
              </p>
            )}
          </div>
          <div className="flex flex-col">
            <label htmlFor="email" className="text-gray-700">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              placeholder="Your email id"
              className={`py-3 transition-all border-b-2 outline-none focus:border-primary/90 focus:caret-primary/90 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 mt-1.5 font-light text-sm">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="flex flex-col">
            <label htmlFor="password" className="text-gray-700">
              Password
            </label>
            <input
              type="password"
              {...register("password")}
              placeholder="Your password"
              className={`py-3 transition-all border-b-2 outline-none focus:border-primary/90 focus:caret-primary/90 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 font-light mt-1.5 text-sm">
                {errors.password.message}
              </p>
            )}
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 shadow-sm transition hover:opacity-95 cursor-pointer text-white rounded-md bg-primary disabled:bg-primary/70"
            >
              {loading ? "Signing up..." : "Signup"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
