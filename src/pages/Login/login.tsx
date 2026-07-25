import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import axiosInstance from "../../api/axiosInstance";

type Errors = {
  email?: string;
  password?: string;
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: Errors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const toastId = toast.loading("Logging in...");
    setLoading(true);

    try {
      const response = await axiosInstance.post(
        "/user/signin",
        {
          email: email.trim(),
          password,
        },
      );

      if (response.data.status === "SUCCESS") {
        toast.success("Login Successful 🎉", { id: toastId });

        localStorage.setItem("user", JSON.stringify(response.data.data.user));

        localStorage.setItem(
          "token",
          response.data.data.token || response.data.data.user.token,
        );

        localStorage.setItem("qrCode", response.data.data.qrCode);

        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        toast.error("Invalid email or password", {
          id: toastId,
        });
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Invalid email or password";

      if (
        message.toLowerCase().includes("password") ||
        message.toLowerCase().includes("invalid")
      ) {
        setErrors((prev) => ({
          ...prev,
          password: "Incorrect password",
        }));
      }

      toast.error(message, {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (hasError?: boolean) =>
    `w-full bg-[var(--bg-surface)] text-[var(--text-primary)] border px-4 py-3 rounded-xl outline-none transition ${
      hasError
        ? "border-red-400 focus:ring-2 focus:ring-red-400"
        : "border-[var(--border-card)] focus:ring-2 focus:ring-emerald-500"
    }`;

  return (
    <div className="h-full flex items-center justify-center p-8 text-[var(--text-primary)]">
      <div className="w-full max-w-sm">
        <h2 className="text-3xl font-bold text-center text-emerald-600 mb-2">
          Welcome Back
        </h2>

        <p className="text-center text-[var(--text-muted)] text-sm mb-6">
          Login to continue to your dashboard
        </p>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);

                if (errors.email) {
                  setErrors((prev) => ({
                    ...prev,
                    email: "",
                  }));
                }
              }}
              className={inputClass(!!errors.email)}
            />

            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);

                if (errors.password) {
                  setErrors((prev) => ({
                    ...prev,
                    password: "",
                  }));
                }
              }}
              className={inputClass(!!errors.password)}
            />

            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <motion.button
            whileHover={!loading ? { scale: 1.03 } : undefined}
            whileTap={!loading ? { scale: 0.97 } : undefined}
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-3 rounded-xl font-medium hover:bg-emerald-700 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>
      </div>
    </div>
  );
}
