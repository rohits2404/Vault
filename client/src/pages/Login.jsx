import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout.jsx";
import { FormField } from "../components/FormField.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  
    const { login } = useAuth();
  
    const navigate = useNavigate();
  
    const location = useLocation();
    const from = location.state?.from?.pathname || "/dashboard";

    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    function handleChange(e) {
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        try {
            await login(form);
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || "Couldn't sign you in. Try again.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <AuthLayout eyebrow="Welcome back" title="Sign in to Vault" subtitle="Access your dashboard with your credentials.">
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <FormField
                label="Email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                />
                <FormField
                label="Password"
                type="password"
                name="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                />

                {error && (
                    <div className="rounded-lg border border-signal-bad/40 bg-signal-bad/10 px-3.5 py-2.5 text-sm text-signal-bad">
                        {error}
                    </div>
                )}

                <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-amber text-base-bg font-semibold text-sm py-2.5 transition-all
                    hover:bg-amber-soft hover:shadow-glow disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {submitting ? "Signing in…" : "Sign in"}
                </button>
            </form>

            <p className="mt-6 text-sm text-ink-muted">
                Don't have an account?{" "}
                <Link to="/signup" className="text-amber hover:text-amber-soft font-medium">
                Create one
                </Link>
            </p>
        </AuthLayout>
    );
}
