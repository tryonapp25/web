import React from "react";

export default function RunningBorderTransparent({show}) {
    if(!show) return null;
    return (
        <div className="rb">
        <svg className="rb-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
            <linearGradient id="rb-grad" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#ff00cc" />
                <stop offset="50%" stopColor="#00ffff" />
                <stop offset="100%" stopColor="#ff00cc" />
            </linearGradient>
            </defs>

            <rect x="0" y="0" width="100" height="100" rx="0" className="rb-border" />
        </svg>

        <style>{`
            .rb{
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.35);

            pointer-events: none;    /* ✅ doesn't block clicks */
            z-index: 9999;
            }
            .rb-svg{
            width: 100%;
            height: 100%;
            }

            .rb-border{
            fill: none;
            stroke: url(#rb-grad);
            stroke-width: 2;

            stroke-dasharray: 25 200;
            animation: rb-run 4s linear infinite;

            filter: drop-shadow(0 0 6px #00ffff)
                    drop-shadow(0 0 12px #ff00cc);
            }

            @keyframes rb-run{
            to { stroke-dashoffset: -225; }
            }

            @media (prefers-reduced-motion: reduce) {
            .rb-border { animation: none; }
            }
        `}</style>
        </div>
    );
}