import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import authRegister from "../../api/authApi";

type Errors = {
  name?: string;
  email?: string;
  password?: string;
};

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: Errors = {};

    if (!name.trim()) {
      newErrors.name = "Full name is required";
    } else if (name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

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

    const toastId = toast.loading("Creating account...");
    setLoading(true);

    try {
      await authRegister(name.trim(), email.trim(), password);

      toast.success("Account created successfully 🎉", {
        id: toastId,
      });

      setTimeout(() => {
        navigate("/verify", {
          state: { email: email.trim() },
        });
      }, 1200);
    } catch (err: any) {
      toast.error(err.message || "Registration failed", {
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
        : "border-[var(--border-card)] focus:ring-2 focus:ring-green-500"
    }`;

  return (
    <div className="h-full flex items-center justify-center p-8 text-[var(--text-primary)]">
      <div className="w-full max-w-sm">
        <h2 className="text-3xl font-bold text-center text-green-600 mb-2">
          Create Account
        </h2>

        <p className="text-center text-[var(--text-muted)] text-sm mb-6">
          Join CentralPay and start tracking your payments
        </p>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
              }}
              className={inputClass(!!errors.name)}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) {
                  setErrors((prev) => ({ ...prev, email: "" }));
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
                  setErrors((prev) => ({ ...prev, password: "" }));
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
            className="w-full bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Register"}
          </motion.button>
        </form>
      </div>
    </div>
  );
}