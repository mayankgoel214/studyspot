/* The hand-drawn VT campus map. Pure presentation — no data. */
export function CampusMap() {
  return (
    <svg
      className="w-full h-full block"
      viewBox="0 0 375 420"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id="paper" width="60" height="60" patternUnits="userSpaceOnUse">
          <rect width="60" height="60" fill="#ece2c3" />
          <circle cx="3" cy="3" r="0.6" fill="#c5af93" opacity="0.4" />
          <circle cx="33" cy="17" r="0.4" fill="#c5af93" opacity="0.3" />
          <circle cx="48" cy="42" r="0.5" fill="#c5af93" opacity="0.4" />
          <circle cx="14" cy="48" r="0.4" fill="#c5af93" opacity="0.3" />
        </pattern>
        <linearGradient id="grass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a3b87f" />
          <stop offset="1" stopColor="#8aa66a" />
        </linearGradient>
        <linearGradient id="bldg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f7f1e1" />
          <stop offset="1" stopColor="#dcc99e" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#paper)" />

      {/* Streets */}
      <g stroke="#c5af93" strokeWidth="22" fill="none" opacity="0.35" strokeLinecap="round">
        <path d="M -10 90 Q 100 80 200 110 T 380 95" />
        <path d="M -10 320 Q 80 310 180 330 T 380 320" />
        <path d="M 80 -10 Q 90 130 110 220 T 130 430" />
        <path d="M 270 -10 Q 260 120 280 220 T 290 430" />
      </g>
      <g stroke="#fbf8f0" strokeWidth="14" fill="none" opacity="0.85" strokeLinecap="round">
        <path d="M -10 90 Q 100 80 200 110 T 380 95" />
        <path d="M -10 320 Q 80 310 180 330 T 380 320" />
        <path d="M 80 -10 Q 90 130 110 220 T 130 430" />
        <path d="M 270 -10 Q 260 120 280 220 T 290 430" />
      </g>
      <g stroke="#c5af93" strokeWidth="1" fill="none" strokeDasharray="4 4" opacity="0.7">
        <path d="M -10 90 Q 100 80 200 110 T 380 95" />
        <path d="M -10 320 Q 80 310 180 330 T 380 320" />
        <path d="M 80 -10 Q 90 130 110 220 T 130 430" />
        <path d="M 270 -10 Q 260 120 280 220 T 290 430" />
      </g>

      {/* Drillfield */}
      <ellipse cx="190" cy="210" rx="80" ry="48" fill="url(#grass)" opacity="0.85" />
      <ellipse cx="190" cy="210" rx="80" ry="48" fill="none" stroke="#7a9659" strokeWidth="1.4" opacity="0.4" strokeDasharray="2 3" />
      <text x="190" y="214" textAnchor="middle" fontFamily="Instrument Serif, serif" fontStyle="italic" fontSize="14" fill="#3d5a2a" opacity="0.9">
        Drillfield
      </text>

      {/* Trees */}
      <g fill="#7a9659" opacity="0.7">
        <circle cx="40" cy="180" r="6" />
        <circle cx="50" cy="200" r="5" />
        <circle cx="335" cy="180" r="6" />
        <circle cx="320" cy="200" r="5" />
        <circle cx="50" cy="40" r="5" />
        <circle cx="320" cy="50" r="6" />
        <circle cx="180" cy="385" r="5" />
        <circle cx="220" cy="395" r="5" />
      </g>

      {/* Squires */}
      <g>
        <rect x="148" y="44" width="92" height="50" rx="6" fill="url(#bldg)" stroke="#a78c70" strokeWidth="1" />
        <rect x="156" y="52" width="6" height="6" fill="#a78c70" opacity="0.4" />
        <rect x="166" y="52" width="6" height="6" fill="#a78c70" opacity="0.4" />
        <rect x="176" y="52" width="6" height="6" fill="#a78c70" opacity="0.4" />
        <rect x="156" y="62" width="6" height="6" fill="#a78c70" opacity="0.4" />
        <rect x="166" y="62" width="6" height="6" fill="#a78c70" opacity="0.4" />
        <rect x="176" y="62" width="6" height="6" fill="#a78c70" opacity="0.4" />
      </g>

      {/* Newman */}
      <g>
        <rect x="265" y="58" width="68" height="74" rx="6" fill="url(#bldg)" stroke="#a78c70" strokeWidth="1" />
        <rect x="272" y="66" width="54" height="10" rx="2" fill="#a78c70" opacity="0.3" />
        <rect x="272" y="80" width="54" height="10" rx="2" fill="#a78c70" opacity="0.3" />
        <rect x="272" y="94" width="54" height="10" rx="2" fill="#a78c70" opacity="0.3" />
      </g>

      {/* Surge */}
      <g>
        <rect x="32" y="60" width="62" height="58" rx="5" fill="url(#bldg)" stroke="#a78c70" strokeWidth="1" />
        <rect x="40" y="68" width="46" height="4" fill="#a78c70" opacity="0.35" />
        <rect x="40" y="78" width="46" height="4" fill="#a78c70" opacity="0.35" />
        <rect x="40" y="88" width="46" height="4" fill="#a78c70" opacity="0.35" />
        <rect x="40" y="98" width="46" height="4" fill="#a78c70" opacity="0.35" />
      </g>

      {/* Goodwin */}
      <g>
        <rect x="36" y="240" width="64" height="68" rx="5" fill="url(#bldg)" stroke="#a78c70" strokeWidth="1" />
        <path d="M 36 270 L 100 270" stroke="#a78c70" strokeWidth="0.8" opacity="0.4" />
        <path d="M 68 240 L 68 308" stroke="#a78c70" strokeWidth="0.8" opacity="0.4" />
      </g>

      {/* Torgersen */}
      <g>
        <rect x="280" y="240" width="62" height="74" rx="5" fill="url(#bldg)" stroke="#a78c70" strokeWidth="1" />
        <path d="M 280 268 L 342 268" stroke="#a78c70" strokeWidth="0.8" opacity="0.4" />
        <path d="M 280 290 L 342 290" stroke="#a78c70" strokeWidth="0.8" opacity="0.4" />
        <path d="M 280 250 L 333 130" stroke="#a78c70" strokeWidth="3" fill="none" opacity="0.4" strokeLinecap="round" />
      </g>

      {/* McBryde */}
      <g>
        <rect x="130" y="328" width="120" height="56" rx="6" fill="url(#bldg)" stroke="#a78c70" strokeWidth="1" />
        <rect x="180" y="328" width="20" height="20" fill="#a78c70" opacity="0.3" />
        <rect x="138" y="338" width="6" height="6" fill="#a78c70" opacity="0.4" />
        <rect x="148" y="338" width="6" height="6" fill="#a78c70" opacity="0.4" />
        <rect x="158" y="338" width="6" height="6" fill="#a78c70" opacity="0.4" />
        <rect x="208" y="338" width="6" height="6" fill="#a78c70" opacity="0.4" />
        <rect x="218" y="338" width="6" height="6" fill="#a78c70" opacity="0.4" />
        <rect x="228" y="338" width="6" height="6" fill="#a78c70" opacity="0.4" />
      </g>

      {/* You are here */}
      <g>
        <circle cx="195" cy="356" r="14" fill="rgba(46,28,10,0.15)" />
        <circle cx="195" cy="356" r="7" fill="#3a2614" />
        <circle cx="195" cy="356" r="3" fill="#fbf8f0" />
      </g>
    </svg>
  );
}
