import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../../lib/validation";
import API from "../../lib/axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Eye, EyeOff, User, Mail, Phone, Lock } from "lucide-react";
import { useState } from "react";
import Loader from "../../components/ui/Loader";

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerSchema) });
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await API.post("/auth/register", data);
      toast.success("Registered successfully");
      setUser(res.data.data);
      navigate(`/${res.data.data.role}/dashboard`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-white">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white p-8 rounded shadow-md space-y-5"
      >
        <h2 className="text-2xl font-bold text-center">Register</h2>

        <div className="space-y-2">
          <label>Name</label>
          <div className="flex items-center border rounded px-3">
            <User className="w-4" />
            <input
              {...register("name")}
              className="w-full px-2 py-2 outline-none"
              placeholder="John Doe"
            />
          </div>
          <p className="text-red-500 text-sm">{errors.name?.message}</p>
        </div>

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
          <label>Phone</label>
          <div className="flex items-center border rounded px-3">
            <Phone className="w-4" />
            <input
              {...register("phone")}
              className="w-full px-2 py-2 outline-none"
              placeholder="9999988888"
            />
          </div>
          <p className="text-red-500 text-sm">{errors.phone?.message}</p>
        </div>

        <div className="space-y-2">
          <label>Password</label>
          <div className="flex items-center border rounded px-3">
            <Lock className="w-4" />
            <input
              type={show ? "text" : "password"}
              {...register("password")}
              className="w-full px-2 py-2 outline-none"
              placeholder="•••••••"
            />
            <button type="button" onClick={() => setShow(!show)}>
              {show ? <EyeOff className="w-4" /> : <Eye className="w-4" />}
            </button>
          </div>
          <p className="text-red-500 text-sm">{errors.password?.message}</p>
        </div>

        <div className="space-y-2">
          <label>Role</label>
          <select
            {...register("role")}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select role</option>
            <option value="admin">Admin</option>
            <option value="owner">Owner</option>
            <option value="tenant">Tenant</option>
          </select>
          <p className="text-red-500 text-sm">{errors.role?.message}</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded flex items-center justify-center"
        >
          {loading ? <Loader /> : "Register"}
        </button>

        <p className="text-center text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
