import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export function ProtectedRoute({ children }) {
  
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-base-bg flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 rounded-full border-2 border-base-border border-t-amber animate-spin" />
                    <p className="font-mono text-xs text-ink-faint tracking-wider">VERIFYING SESSION…</p>
                </div>
            </div>
        );
    }

    if (!user) return <Navigate to="/login" replace />;
    return children;
}
