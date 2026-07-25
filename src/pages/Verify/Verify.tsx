import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { verifyUser } from "../../api/authApi";
import toast from "react-hot-toast";

export default function Verify() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!otp.trim()) {
      toast.error("Please enter the OTP");
      return;
    }

    if (!email) {
      toast.error("Email not found. Please register again.");
      return;
    }

    try {
      setLoading(true);

      const res = await verifyUser(email, otp);

      if (res.status === "SUCCESS") {
        toast.success("Account verified successfully 🎉");

        setTimeout(() => {
          navigate("/login");
        }, 1200);
      } else {
        toast.error("Invalid OTP");
      }
    } catch (error) {
      toast.error("Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-surface)] text-[var(--text-primary)]">
      <div className="bg-[var(--bg-card)] shadow-md border border-[var(--border-card)] rounded-xl p-8 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4 text-emerald-600">
          Verify Your Email
        </h2>

        <p className="mb-6 text-[var(--text-secondary)]">
          Enter the code sent to <strong>{email}</strong>
        </p>

        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="w-full bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-card)] px-4 py-2 rounded-md mb-4 focus:ring-2 focus:ring-emerald-500 outline-none"
        />

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-2 rounded-md hover:opacity-90 disabled:opacity-50 cursor-pointer font-medium"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </div>
    </div>
  );
}