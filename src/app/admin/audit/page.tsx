"use client";

import { useEffect, useState, useCallback } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import { toast } from "react-hot-toast";
import { RefreshCw } from "lucide-react";

interface AuditLog {
  id: string;
  admin_id: string;
  admin_email?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

const ENTITY_TYPES = ["", "user", "profile", "ad", "wallet"];

const actionColor = (action: string) => {
  if (action.includes("approve") || action.includes("enable")) return "text-green-400";
  if (action.includes("reject") || action.includes("disable")) return "text-rose-400";
  if (action.includes("adjust")) return "text-yellow-400";
  return "text-blue-400";
};

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [entityType, setEntityType] = useState("");
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (entityType) params.set("entity_type", entityType);
      const res = await adminFetch(`/api/admin/audit?${params}`);
      const data = await res.json();
      setLogs(data.logs ?? []);
      setTotal(data.total ?? 0);
    } catch {
      toast.error("Failed to load audit log");
    } finally {
      setIsLoading(false);
    }
  }, [page, entityType]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const fmt = (val?: string) => {
    if (!val) return "—";
    const d = new Date(val);
    return d.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-primary-text">Audit Log</h1>
          <p className="text-sm text-text-gray-opacity mt-1">{total} entries</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={entityType}
            onChange={(e) => { setEntityType(e.target.value); setPage(1); }}
            className="rounded-xl border border-dark-border bg-input-bg px-4 py-2 text-sm text-primary-text outline-none focus:border-primary"
          >
            {ENTITY_TYPES.map((t) => (
              <option key={t} value={t}>{t || "All types"}</option>
            ))}
          </select>
          <button
            onClick={fetchData}
            className="flex items-center gap-2 rounded-xl border border-dark-border px-3 py-2 text-sm text-text-gray-opacity hover:text-primary-text hover:bg-dark-surface transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-dark-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-dark-surface border-b border-dark-border">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-gray-opacity">Time</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-gray-opacity">Admin</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-gray-opacity">Action</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-gray-opacity">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-gray-opacity">Entity ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-gray-opacity">Metadata</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-border">
            {isLoading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 rounded bg-dark-surface animate-pulse w-24" />
                    </td>
                  ))}
                </tr>
              ))
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-text-gray-opacity">No audit log entries</td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-dark-surface/40 transition-colors">
                  <td className="px-4 py-3 text-text-gray-opacity whitespace-nowrap">{fmt(log.created_at)}</td>
                  <td className="px-4 py-3 text-primary-text">{log.admin_email ?? log.admin_id.slice(0, 8) + "…"}</td>
                  <td className="px-4 py-3">
                    <span className={`font-mono font-medium ${actionColor(log.action)}`}>{log.action}</span>
                  </td>
                  <td className="px-4 py-3 text-text-gray-opacity">{log.entity_type}</td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-text-gray-opacity">
                      {log.entity_id ? log.entity_id.slice(0, 12) + "…" : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {log.metadata ? (
                      <button
                        onClick={() => setExpanded(expanded === log.id ? null : log.id)}
                        className="text-xs text-primary hover:underline"
                      >
                        {expanded === log.id ? "Hide" : "Show"}
                      </button>
                    ) : (
                      <span className="text-text-gray-opacity">—</span>
                    )}
                    {expanded === log.id && log.metadata && (
                      <pre className="mt-2 text-xs text-text-gray-opacity bg-dark-surface rounded-lg p-2 max-w-xs overflow-auto">
                        {JSON.stringify(log.metadata, null, 2)}
                      </pre>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {total > 50 && (
        <div className="flex items-center justify-between text-sm text-text-gray-opacity">
          <span>Page {page} · {total} entries</span>
          <div className="flex gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="rounded-lg border border-dark-border px-3 py-1.5 hover:bg-dark-surface disabled:opacity-40 transition-colors">
              Previous
            </button>
            <button onClick={() => setPage((p) => p + 1)} disabled={logs.length < 50}
              className="rounded-lg border border-dark-border px-3 py-1.5 hover:bg-dark-surface disabled:opacity-40 transition-colors">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
