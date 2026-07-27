import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout.jsx";
import { FormField } from "../components/FormField.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Signup() {
  
    const { signup } = useAuth();
  
    const navigate = useNavigate();

    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    function handleChange(e) {
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        if (form.password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }

        setSubmitting(true);
        try {
            await signup(form);
            navigate("/dashboard", { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || "Couldn't create your account. Try again.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <AuthLayout eyebrow="Get started" title="Create your account" subtitle="Takes less than a minute.">
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <FormField
                label="Full name"
                type="text"
                name="name"
                autoComplete="name"
                placeholder="Ada Lovelace"
                value={form.name}
                onChange={handleChange}
                required
                />
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
                autoComplete="new-password"
                placeholder="At least 8 characters"
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
                    {submitting ? "Creating account…" : "Create account"}
                </button>
            </form>

            <p className="mt-6 text-sm text-ink-muted">
                Already have an account?{" "}
                <Link to="/login" className="text-amber hover:text-amber-soft font-medium">
                    Sign in
                </Link>
            </p>
        </AuthLayout>
    );
}
