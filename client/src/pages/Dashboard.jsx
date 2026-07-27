import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../components/Logo.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { api, getAccessToken } from "../api/client.js";

export default function Dashboard() {

    const { user, logout } = useAuth();
    
    const navigate = useNavigate();
    
    const [summary, setSummary] = useState(null);
    const [loadingSummary, setLoadingSummary] = useState(true);
    const [tokenPreview, setTokenPreview] = useState("");

    useEffect(() => {
        let cancelled = false;
        api.get("/dashboard/summary").then(({ data }) => {
            if (!cancelled) setSummary(data);
        })
        .catch(() => {})
        .finally(() => {
            if (!cancelled) setLoadingSummary(false);
        });
        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        const token = getAccessToken();
        if (token) setTokenPreview(`${token.slice(0, 18)}…${token.slice(-6)}`);
    }, []);

    async function handleLogout() {
        await logout();
        navigate("/login", { replace: true });
    }

    const initials = (user?.name || "?")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

    return (
        <div className="min-h-screen bg-base-bg bg-grid">
            <header className="border-b border-base-border">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Logo />
                    <button
                        onClick={handleLogout}
                        className="text-sm text-ink-muted hover:text-signal-bad transition-colors font-medium px-3 py-1.5 rounded-md hover:bg-signal-bad/10"
                    >
                        Log out
                    </button>
                </div>
            </header>
            <main className="max-w-5xl mx-auto px-6 py-10 animate-fade_up">
                <div className="flex items-center gap-4 mb-10">
                    <div className="h-14 w-14 rounded-full bg-amber/15 border border-amber/40 flex items-center justify-center font-display font-semibold text-amber text-lg">
                        {initials}
                    </div>
                    <div>
                        <h1 className="font-display text-2xl font-semibold text-ink">Welcome back, {user?.name}</h1>
                        <p className="text-sm text-ink-muted">{user?.email}</p>
                    </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <InfoCard label="Account created" value={new Date(user?.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })} />
                    <InfoCard label="Access token" value={tokenPreview || "—"} mono />
                    <InfoCard label="Session storage" value="Refresh: httpOnly cookie" mono />
                </div>
                <div className="rounded-xl border border-base-border bg-base-surface p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-display font-semibold text-ink">Protected payload</h2>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-signal-good bg-signal-good/10 border border-signal-good/30 rounded-full px-2 py-0.5">
                        live
                        </span>
                    </div>
                    <p className="text-sm text-ink-muted mb-5">
                        This card's data came from <code className="font-mono text-xs text-amber-soft">GET /api/dashboard/summary</code>,
                        a route guarded by the access-token middleware. If the access token had expired, the
                        request would have transparently retried after a token refresh.
                    </p>
                    {loadingSummary ? (
                        <div className="h-16 flex items-center text-sm text-ink-faint font-mono">Loading…</div>
                    ) : summary ? (
                        <div className="grid sm:grid-cols-3 gap-3">
                            {summary.stats.map((s) => (
                                <div key={s.label} className="rounded-lg bg-base-surface2 border border-base-border p-4">
                                    <p className="text-[11px] uppercase tracking-wider text-ink-faint font-mono mb-1">{s.label}</p>
                                    <p className="text-sm text-ink font-medium">{s.value}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-signal-bad">Couldn't load protected data.</p>
                    )}
                </div>
            </main>
        </div>
    );
}

function InfoCard({ label, value, mono }) {
    return (
        <div className="rounded-xl border border-base-border bg-base-surface p-5">
            <p className="text-[11px] uppercase tracking-wider text-ink-faint font-mono mb-2">{label}</p>
            <p className={`text-sm text-ink truncate ${mono ? "font-mono" : "font-medium"}`}>{value}</p>
        </div>
    );
}
