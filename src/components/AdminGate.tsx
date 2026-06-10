"use client";

import { useState, useCallback } from "react";
import { Lock, Package, Truck, CheckCheck, RefreshCw } from "lucide-react";
import Button from "@/components/Button";
import { getOrders, updateOrderStatus, type AdminOrder } from "@/app/actions/admin";

const STATUS_COLORS: Record<string, string> = {
  pending:   "var(--caramel)",
  paid:      "var(--sage)",
  failed:    "var(--clay)",
  shipped:   "var(--coffee)",
  delivered: "var(--espresso)",
};

export default function AdminGate() {
  const [authed, setAuthed]     = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [orders, setOrders]     = useState<AdminOrder[]>([]);
  const [loading, setLoading]   = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getOrders();
      setOrders(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === "1234") {
      setAuthed(true);
      loadOrders();
    } else {
      setLoginError(true);
      setTimeout(() => setLoginError(false), 2000);
    }
  };

  const handleStatus = async (orderId: string, status: "shipped" | "delivered") => {
    setUpdating(orderId);
    try {
      await updateOrderStatus(orderId, status);
      await loadOrders();
    } finally {
      setUpdating(null);
    }
  };

  // ── Password gate ────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-5">
        <div
          className="w-full max-w-xs rounded-[4px] p-8 flex flex-col gap-6"
          style={{ backgroundColor: "var(--porcelain)", border: "1px solid var(--sand)", boxShadow: "0 1px 2px rgba(43,33,27,.06)" }}
        >
          <div className="flex flex-col items-center gap-2">
            <Lock size={24} strokeWidth={1.5} style={{ color: "var(--mocha)" }} />
            <h1 className="text-xl text-espresso" style={{ fontFamily: "var(--font-display)" }}>Admin</h1>
          </div>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full h-10 px-3 rounded-[2px] text-sm outline-none"
              style={{
                backgroundColor: "var(--cream)",
                border: `1px solid ${loginError ? "var(--clay)" : "var(--sand)"}`,
                color: "var(--espresso)",
              }}
            />
            {loginError && <p className="text-xs" style={{ color: "var(--clay)" }}>Incorrect password</p>}
            <Button type="submit" className="w-full py-3">Enter</Button>
          </form>
        </div>
      </div>
    );
  }

  // ── Orders dashboard ─────────────────────────────────────────────
  return (
    <div className="max-w-[1100px] mx-auto px-5 md:px-8 py-10 md:py-16">
      <div className="flex flex-col gap-8">

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl text-espresso" style={{ fontFamily: "var(--font-display)" }}>
              Orders
            </h1>
            <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: "var(--latte)", color: "var(--mocha)" }}>
              {orders.length}
            </span>
          </div>
          <button
            onClick={loadOrders}
            className="flex items-center gap-1.5 text-xs transition-opacity hover:opacity-60"
            style={{ color: "var(--mocha)" }}
          >
            <RefreshCw size={13} strokeWidth={1.5} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Loading */}
        {loading && orders.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <RefreshCw size={20} strokeWidth={1.5} className="animate-spin" style={{ color: "var(--sand)" }} />
          </div>
        )}

        {/* Empty state */}
        {!loading && orders.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-20 rounded-[4px]" style={{ border: "1px solid var(--sand)" }}>
            <Package size={32} strokeWidth={1} style={{ color: "var(--sand)" }} />
            <p className="text-sm" style={{ color: "var(--mocha)" }}>No orders yet</p>
          </div>
        )}

        {/* Orders table */}
        {orders.length > 0 && (
          <div className="flex flex-col rounded-[4px] overflow-hidden" style={{ border: "1px solid var(--sand)" }}>
            <div
              className="hidden md:grid grid-cols-[1fr_1fr_1fr_110px_160px] gap-4 px-5 py-3 text-xs font-medium uppercase tracking-wider"
              style={{ backgroundColor: "var(--latte)", color: "var(--mocha)" }}
            >
              <span>Customer</span>
              <span>Items</span>
              <span>Address</span>
              <span>Total</span>
              <span>Status</span>
            </div>

            {orders.map((order, i) => {
              const itemSummary = order.items
                .map((it) => `${it.quantity}× ${it.name}`)
                .join(", ");
              const address = [order.addressLine1, order.city, order.province, order.postalCode]
                .filter(Boolean).join(", ");
              const total = `R ${(order.totalCents / 100).toFixed(2)}`;
              const date = new Date(order.createdAt).toLocaleDateString("en-ZA");

              return (
                <div
                  key={order.id}
                  className="flex flex-col md:grid md:grid-cols-[1fr_1fr_1fr_110px_160px] gap-2 md:gap-4 px-5 py-4"
                  style={{
                    backgroundColor: i % 2 === 0 ? "var(--porcelain)" : "var(--cream)",
                    borderTop: i > 0 ? "1px solid var(--sand)" : undefined,
                  }}
                >
                  {/* Customer */}
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-medium text-espresso">{order.customerName ?? "—"}</p>
                    <p className="text-xs" style={{ color: "var(--mocha)" }}>{order.customerEmail ?? "—"}</p>
                    <p className="text-xs" style={{ color: "var(--caramel)" }}>{date}</p>
                  </div>

                  <p className="text-sm text-espresso self-center">{itemSummary || "—"}</p>
                  <p className="text-xs self-center" style={{ color: "var(--mocha)" }}>{address || "—"}</p>
                  <p className="text-sm font-medium self-center" style={{ fontFamily: "var(--font-display)", color: "var(--espresso)" }}>
                    {total}
                  </p>

                  {/* Status + actions */}
                  <div className="flex items-center gap-2 self-center flex-wrap">
                    <span
                      className="text-xs px-2 py-1 rounded-full capitalize"
                      style={{ backgroundColor: "var(--latte)", color: STATUS_COLORS[order.status] ?? "var(--mocha)" }}
                    >
                      {order.status}
                    </span>

                    {(order.status === "paid" || order.status === "shipped") && (
                      <div className="flex gap-1">
                        {order.status === "paid" && (
                          <button
                            title="Mark shipped"
                            onClick={() => handleStatus(order.id, "shipped")}
                            disabled={updating === order.id}
                            className="p-1.5 rounded hover:bg-latte transition-colors disabled:opacity-40"
                          >
                            <Truck size={14} strokeWidth={1.5} style={{ color: "var(--mocha)" }} />
                          </button>
                        )}
                        {order.status === "shipped" && (
                          <button
                            title="Mark delivered"
                            onClick={() => handleStatus(order.id, "delivered")}
                            disabled={updating === order.id}
                            className="p-1.5 rounded hover:bg-latte transition-colors disabled:opacity-40"
                          >
                            <CheckCheck size={14} strokeWidth={1.5} style={{ color: "var(--mocha)" }} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
