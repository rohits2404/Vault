export function FormField({ label, error, ...inputProps }) {
    return (
        <label className="block">
            <span className="block text-xs font-medium text-ink-muted mb-1.5">{label}</span>
            <input
            {...inputProps}
            className={`w-full rounded-lg bg-base-surface border px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint outline-none transition-colors focus:border-amber ${error ? "border-signal-bad" : "border-base-border"}`}
            />
            {error && <span className="mt-1.5 block text-xs text-signal-bad">{error}</span>}
        </label>
    );
}
