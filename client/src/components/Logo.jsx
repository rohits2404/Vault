export function Logo({ className = "" }) {
    return (
        <div className={`flex items-center gap-2.5 ${className}`}>
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                <rect x="1" y="1" width="24" height="24" rx="7" stroke="#E8A33D" strokeWidth="1.5" />
                <path
                d="M13 6.5L18.5 9.3V13.6C18.5 16.9 16.1 18.9 13 19.9C9.9 18.9 7.5 16.9 7.5 13.6V9.3L13 6.5Z"
                stroke="#E8A33D"
                strokeWidth="1.4"
                strokeLinejoin="round"
                />
                <circle cx="13" cy="13" r="1.6" fill="#E8A33D" />
            </svg>
            <span className="font-display font-semibold text-[17px] tracking-tight text-ink">
                Vault
            </span>
        </div>
    );
}
