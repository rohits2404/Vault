export function TokenFlowDiagram() {
    return (
        <svg viewBox="0 0 420 300" className="w-full max-w-md" role="img" aria-label="Access and refresh token exchange diagram">
            <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#E8A33D" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#6C7EF0" stopOpacity="0.9" />
                </linearGradient>
            </defs>

            {/* connecting path */}
            <path
                d="M 90 70 C 180 70, 180 150, 90 150 C 20 150, 20 230, 90 230"
                fill="none"
                stroke="#2A3446"
                strokeWidth="1.5"
            />
            <path
                d="M 90 70 C 180 70, 180 150, 90 150 C 20 150, 20 230, 90 230"
                fill="none"
                stroke="url(#lineGrad)"
                strokeWidth="1.5"
                strokeDasharray="6 8"
                opacity="0.8"
            />

            {/* Client node */}
            <g transform="translate(90,70)">
                <circle r="30" fill="#161D2B" stroke="#2A3446" strokeWidth="1.5" />
                <circle r="30" fill="none" stroke="#E8A33D" strokeWidth="1.5" className="origin-center animate-pulse_ring" />
                <text textAnchor="middle" dy="-2" fontSize="9" fill="#EDF1F7" fontFamily="Sora, sans-serif" fontWeight="600">
                    Client
                </text>
                <text textAnchor="middle" dy="10" fontSize="7" fill="#8D97AC" fontFamily="JetBrains Mono, monospace">
                    in-memory
                </text>
            </g>

            {/* Access token label */}
            <g transform="translate(240,60)">
                <rect x="-58" y="-16" width="116" height="32" rx="8" fill="#1D2536" stroke="#E8A33D" strokeOpacity="0.5" />
                <text textAnchor="middle" dy="-1" fontSize="9" fill="#F0BE72" fontFamily="Sora, sans-serif" fontWeight="600">
                Access token
                </text>
                <text textAnchor="middle" dy="11" fontSize="7" fill="#8D97AC" fontFamily="JetBrains Mono, monospace">
                15 min · header
                </text>
            </g>

            {/* Server node */}
            <g transform="translate(90,150)">
                <rect x="-34" y="-24" width="68" height="48" rx="10" fill="#161D2B" stroke="#2A3446" strokeWidth="1.5" />
                <text textAnchor="middle" dy="-2" fontSize="9" fill="#EDF1F7" fontFamily="Sora, sans-serif" fontWeight="600">
                API
                </text>
                <text textAnchor="middle" dy="10" fontSize="7" fill="#8D97AC" fontFamily="JetBrains Mono, monospace">
                verifies
                </text>
            </g>

            {/* Refresh token label */}
            <g transform="translate(240,190)">
                <rect x="-58" y="-16" width="116" height="32" rx="8" fill="#1D2536" stroke="#6C7EF0" strokeOpacity="0.5" />
                <text textAnchor="middle" dy="-1" fontSize="9" fill="#96A2F4" fontFamily="Sora, sans-serif" fontWeight="600">
                Refresh token
                </text>
                <text textAnchor="middle" dy="11" fontSize="7" fill="#8D97AC" fontFamily="JetBrains Mono, monospace">
                7 days · httpOnly
                </text>
            </g>

            {/* DB node */}
            <g transform="translate(90,230)">
                <ellipse rx="32" ry="14" fill="#161D2B" stroke="#2A3446" strokeWidth="1.5" />
                <text textAnchor="middle" dy="3" fontSize="8" fill="#EDF1F7" fontFamily="Sora, sans-serif" fontWeight="600">
                MongoDB
                </text>
            </g>

            <text x="20" y="272" fontSize="7.5" fill="#5C6478" fontFamily="JetBrains Mono, monospace">
                every refresh rotates + re-hashes the session
            </text>
        </svg>
    );
}
