import { Logo } from "./Logo.jsx";
import { TokenFlowDiagram } from "./TokenFlowDiagram.jsx";

export function AuthLayout({ eyebrow, title, subtitle, children }) {
    return (
        <div className="min-h-screen bg-base-bg flex">
            <div className="hidden lg:flex lg:w-[46%] relative overflow-hidden border-r border-base-border bg-grid">
                <div className="absolute inset-0 bg-linear-to-b from-base-bg via-transparent to-base-bg" />
                <div className="relative z-10 flex flex-col justify-between p-12 w-full">
                    <Logo />
                    <div className="flex flex-col items-start gap-8">
                        <TokenFlowDiagram />
                        <div className="max-w-sm">
                            <p className="font-mono text-[11px] tracking-[0.18em] text-amber uppercase mb-2">
                                Two-token session model
                            </p>
                            <h2 className="font-display text-2xl font-semibold text-ink leading-snug">
                                A short-lived key in memory. A long-lived key the browser can't touch.
                            </h2>
                            <p className="mt-3 text-sm text-ink-muted leading-relaxed">
                                The access token authorizes each request and expires in minutes. The refresh
                                token lives in an httpOnly cookie, rotates on every use, and is the only thing
                                that can mint a new session.
                            </p>
                        </div>
                    </div>
                    <p className="text-xs text-ink-faint font-mono">MERN Auth · Internship Assessment</p>
                </div>
            </div>

            {/* Right: form */}
            <div className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-sm animate-fade_up">
                    <div className="lg:hidden mb-8">
                        <Logo />
                    </div>
                    <p className="font-mono text-[11px] tracking-[0.18em] text-amber uppercase mb-2">
                        {eyebrow}
                    </p>
                    <h1 className="font-display text-[28px] font-semibold text-ink mb-1.5">{title}</h1>
                    {subtitle && <p className="text-sm text-ink-muted mb-8">{subtitle}</p>}
                    {!subtitle && <div className="mb-8" />}
                    {children}
                </div>
            </div>
        </div>
    );
}
