import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../lib/validation";
import API from "../../lib/axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import Loader from "../../components/ui/Loader";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ resolver: zodResolver(loginSchema) });

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const { setUser } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await API.post("/auth/login", data);
      toast.success("Logged in successfully");
      setUser(res.data.data);
      navigate(`/${res.data.data.role}/dashboard`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-white">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white p-8 rounded shadow space-y-5"
      >
        <h2 className="text-2xl font-bold text-center">Login</h2>

        <div className="space-y-2">
          <label>Email</label>
          <div className="flex items-center border rounded px-3">
            <Mail className="w-4" />
            <input
              {...register("email")}
              className="w-full px-2 py-2 outline-none"
              placeholder="email@example.com"
            />
          </div>
          <p className="text-red-500 text-sm">{errors.email?.message}</p>
        </div>

        <div className="space-y-2">
          <label>Password</label>
          <div className="flex items-center border rounded px-3">
            <Lock className="w-4" />
            <input
              type={show ? "text" : "password"}
              {...register("password")}
              className="w-full px-2 py-2 outline-none"
              placeholder="••••••"
            />
            <button type="button" onClick={() => setShow(!show)}>
              {show ? <EyeOff className="w-4" /> : <Eye className="w-4" />}
            </button>
          </div>
          <p className="text-red-500 text-sm">{errors.password?.message}</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded flex items-center justify-center"
        >
          {loading ? <Loader /> : "Login"}
        </button>

        <p className="text-center text-sm">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-600 underline">
            Register
          </a>
        </p>
      </form>
    </div>
  );
}
