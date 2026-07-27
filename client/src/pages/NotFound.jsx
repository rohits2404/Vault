import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-base-bg flex flex-col items-center justify-center gap-3 text-center px-6">
            <p className="font-mono text-amber text-sm tracking-widest">404</p>
            <h1 className="font-display text-2xl font-semibold text-ink">Page not found</h1>
            <p className="text-sm text-ink-muted max-w-xs">The page you're looking for doesn't exist or was moved.</p>
            <Link to="/" className="mt-2 text-sm text-amber hover:text-amber-soft font-medium">
                Back to Home
            </Link>
        </div>
    );
}
