import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, User, ShieldCheck, LogOut, CreditCard, Trash2 } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { pageAnimation } from "../../animations/PageAnimation";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../component/ui/dialog";
import { Button } from "../../component/ui/button";

type UserType = {
  name: string;
  email: string;
};

type ApiResponse = {
  status: string;
  message: string;
  data: UserType;
};

export default function Profile() {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (!user || !user.email) return;
    setIsDeleting(true);
    try {
      await axiosInstance.delete("/user/delete", {
        data: { email: user.email },
      });
      toast.success("Account deleted successfully");
      localStorage.clear();
      window.location.href = "/";
    } catch (error: any) {
      console.error("Error deleting account:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete account. Please try again."
      );
    } finally {
      setIsDeleting(false);
      setOpenDeleteDialog(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          window.location.href = "/login";
          return;
        }

        const res = await axiosInstance.get<ApiResponse>("/user/userData");
        setUser(res.data.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-surface)] p-6 flex items-center justify-center text-[var(--text-primary)]">
        <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-3xl shadow-xl p-8 w-full max-w-3xl">
          <div className="flex flex-col items-center">
            <div className="skeleton-shimmer w-28 h-28 rounded-full mb-6" />
            <div className="skeleton-shimmer h-7 w-44 rounded-lg mb-3" />
            <div className="skeleton-shimmer h-4 w-64 rounded-lg" />
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-10">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton-shimmer h-24 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={pageAnimation}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-[var(--bg-surface)] p-4 sm:p-6 lg:p-10 text-[var(--text-primary)]"
    >
      <div className="max-w-5xl mx-auto space-y-7">
        <div className="mb-10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <User size={28} />
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">Profile</h1>
            <p className="text-[var(--text-secondary)] mt-2">
              Manage your account information and session
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-[var(--bg-card)] rounded-3xl shadow-xl border border-[var(--border-card)] p-8 text-center">
            <div className="relative w-32 h-32 mx-auto">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 blur opacity-30" />
              <div className="relative w-32 h-32 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center text-white text-5xl font-bold shadow-lg">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </div>

            <h2 className="text-2xl font-bold mt-6 text-[var(--text-primary)]">
              {user?.name}
            </h2>

            <p className="text-[var(--text-secondary)] mt-2">{user?.email}</p>

            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-500 text-sm font-medium">
              <ShieldCheck size={16} />
              Verified Account
            </div>

            <button
              onClick={handleLogout}
              className="mt-8 w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl transition duration-200 shadow-md cursor-pointer"
            >
              <LogOut size={18} />
              Log Out
            </button>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[var(--bg-card)] rounded-3xl shadow-xl border border-[var(--border-card)] p-8">
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6">
                Account Information
              </h3>

              <div className="grid md:grid-cols-2 gap-5">
                <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-card)]">
                  <div className="flex items-center gap-3 text-[var(--text-secondary)] mb-3">
                    <User size={18} />
                    <span className="text-sm">Full Name</span>
                  </div>
                  <p className="font-semibold text-[var(--text-primary)]">{user?.name}</p>
                </div>

                <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-card)]">
                  <div className="flex items-center gap-3 text-[var(--text-secondary)] mb-3">
                    <Mail size={18} />
                    <span className="text-sm">Email Address</span>
                  </div>
                  <p className="font-semibold text-[var(--text-primary)] break-all">
                    {user?.email}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-card)]">
                  <div className="flex items-center gap-3 text-[var(--text-secondary)] mb-3">
                    <ShieldCheck size={18} />
                    <span className="text-sm">Account Status</span>
                  </div>
                  <p className="font-semibold text-emerald-500">Active</p>
                </div>

                <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-card)]">
                  <div className="flex items-center gap-3 text-[var(--text-secondary)] mb-3">
                    <CreditCard size={18} />
                    <span className="text-sm">Service</span>
                  </div>
                  <p className="font-semibold text-[var(--text-primary)]">CentralPay</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl shadow-xl p-8 text-white flex items-start gap-4 shadow-emerald-550/20">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur">
                <ShieldCheck size={28} />
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2">Account Security</h3>
                <p className="text-emerald-50">
                  Your session is protected using your account token.
                </p>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-[var(--bg-card)] rounded-3xl shadow-xl border border-rose-500/20 p-8">
              <div className="flex items-start gap-4">
                <div className="bg-rose-500/10 p-3 rounded-xl text-rose-500">
                  <Trash2 size={28} />
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-bold text-rose-500 mb-2">Danger Zone</h3>
                  <p className="text-[var(--text-secondary)] text-sm mb-6">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  
                  <Button
                    variant="destructive"
                    onClick={() => setOpenDeleteDialog(true)}
                    className="cursor-pointer font-semibold"
                  >
                    Delete Account
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-500">
              <Trash2 className="h-5 w-5" />
              Delete Account
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm text-[var(--text-secondary)]">
              Are you absolutely sure you want to delete your account? This action is permanent and all your data will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 justify-end mt-4">
            <Button
              variant="outline"
              onClick={() => setOpenDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete My Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
