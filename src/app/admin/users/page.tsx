"use client";

import { useState, useEffect } from "react";
import * as adminService from "@/services/admin.service";
import Loader from "@/components/Loader";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<adminService.AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [creditModal, setCreditModal] = useState<{ userId: string; email: string } | null>(null);
  const [creditAmount, setCreditAmount] = useState(0);
  const [planModal, setPlanModal] = useState<{ userId: string; email: string } | null>(null);
  const [planValue, setPlanValue] = useState("FREE");

  const limit = 20;

  const fetchUsers = () => {
    setLoading(true);
    adminService
      .getUsers({ page, limit, search: search || undefined })
      .then((data) => {
        setUsers(data.users as adminService.AdminUser[]);
        setTotal(data.total);
      })
      .catch((err) => setError(adminService.getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const handleCredit = async () => {
    if (!creditModal || creditAmount === 0) return;
    setActionLoading(creditModal.userId);
    adminService
      .updateUserCredit(creditModal.userId, creditAmount)
      .then(() => {
        setCreditModal(null);
        setCreditAmount(0);
        fetchUsers();
      })
      .catch((err) => setError(adminService.getErrorMessage(err)))
      .finally(() => setActionLoading(null));
  };

  const handleBlock = async (userId: string) => {
    setActionLoading(userId);
    adminService
      .blockUser(userId)
      .then(fetchUsers)
      .catch((err) => setError(adminService.getErrorMessage(err)))
      .finally(() => setActionLoading(null));
  };

  const handleUnblock = async (userId: string) => {
    setActionLoading(userId);
    adminService
      .unblockUser(userId)
      .then(fetchUsers)
      .catch((err) => setError(adminService.getErrorMessage(err)))
      .finally(() => setActionLoading(null));
  };

  const handlePlanOverride = async () => {
    if (!planModal) return;
    setActionLoading(planModal.userId);
    adminService
      .planOverride(planModal.userId, planValue)
      .then(() => {
        setPlanModal(null);
        setPlanValue("FREE");
        fetchUsers();
      })
      .catch((err) => setError(adminService.getErrorMessage(err)))
      .finally(() => setActionLoading(null));
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <h1 className="text-2xl font-semibold">Users</h1>
      <p className="mt-1 text-white/60">Manage users, credits, and plans</p>

      {error && (
        <div className="mt-4 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-red-400">
          {error}
        </div>
      )}

      <div className="mt-6 flex gap-4">
        <input
          type="search"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-white/40"
        />
      </div>

      {loading ? (
        <div className="mt-8 flex justify-center">
          <Loader size="lg" />
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-white/5">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="px-4 py-3 text-left text-sm font-medium text-white/60">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-white/60">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-white/60">Plan</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-white/60">Credits</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-white/60">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-white/60">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-white/5">
                  <td className="px-4 py-3">{u.name}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">{u.plan}</td>
                  <td className="px-4 py-3">{u.credits}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded px-2 py-0.5 text-xs ${
                        u.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {u.isActive ? "Active" : "Blocked"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCreditModal({ userId: u.id, email: u.email })}
                        disabled={!!actionLoading}
                        className="rounded bg-indigo-500/20 px-2 py-1 text-xs text-indigo-400 hover:bg-indigo-500/30 disabled:opacity-50"
                      >
                        Credits
                      </button>
                      <button
                        onClick={() => setPlanModal({ userId: u.id, email: u.email })}
                        disabled={!!actionLoading}
                        className="rounded bg-amber-500/20 px-2 py-1 text-xs text-amber-400 hover:bg-amber-500/30 disabled:opacity-50"
                      >
                        Plan
                      </button>
                      {u.isActive ? (
                        <button
                          onClick={() => handleBlock(u.id)}
                          disabled={!!actionLoading}
                          className="rounded bg-red-500/20 px-2 py-1 text-xs text-red-400 hover:bg-red-500/30 disabled:opacity-50"
                        >
                          Block
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUnblock(u.id)}
                          disabled={!!actionLoading}
                          className="rounded bg-green-500/20 px-2 py-1 text-xs text-green-400 hover:bg-green-500/30 disabled:opacity-50"
                        >
                          Unblock
                        </button>
                      )}
                      <a
                        href={`/admin/jobs?userId=${u.id}`}
                        className="rounded bg-white/10 px-2 py-1 text-xs text-white/80 hover:bg-white/20"
                      >
                        Jobs
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="rounded bg-white/5 px-4 py-2 disabled:opacity-50"
          >
            Prev
          </button>
          <span className="flex items-center px-4">
            Page {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="rounded bg-white/5 px-4 py-2 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {creditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-sm rounded-xl border border-white/10 bg-[#0a0a0f] p-6">
            <h3 className="font-semibold">Add/Deduct Credits</h3>
            <p className="mt-1 text-sm text-white/60">{creditModal.email}</p>
            <input
              type="number"
              value={creditAmount}
              onChange={(e) => setCreditAmount(parseInt(e.target.value, 10) || 0)}
              className="mt-4 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white"
              placeholder="Amount (+ add, - deduct)"
            />
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleCredit}
                disabled={actionLoading === creditModal.userId}
                className="rounded-lg bg-indigo-500 px-4 py-2 font-medium disabled:opacity-50"
              >
                Apply
              </button>
              <button
                onClick={() => {
                  setCreditModal(null);
                  setCreditAmount(0);
                }}
                className="rounded-lg bg-white/10 px-4 py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {planModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-sm rounded-xl border border-white/10 bg-[#0a0a0f] p-6">
            <h3 className="font-semibold">Change Plan</h3>
            <p className="mt-1 text-sm text-white/60">{planModal.email}</p>
            <select
              value={planValue}
              onChange={(e) => setPlanValue(e.target.value)}
              className="mt-4 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white"
            >
              {["FREE", "STARTER", "CREATOR", "PRO", "ULTRA"].map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <div className="mt-4 flex gap-2">
              <button
                onClick={handlePlanOverride}
                disabled={actionLoading === planModal.userId}
                className="rounded-lg bg-indigo-500 px-4 py-2 font-medium disabled:opacity-50"
              >
                Apply
              </button>
              <button
                onClick={() => {
                  setPlanModal(null);
                  setPlanValue("FREE");
                }}
                className="rounded-lg bg-white/10 px-4 py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
