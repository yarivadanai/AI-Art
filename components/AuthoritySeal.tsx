"use client";

export function AuthoritySeal({ size = 80 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block"
    >
      {/* Outer ring */}
      <circle
        cx="100"
        cy="100"
        r="95"
        fill="none"
        stroke="#4a9eff"
        strokeWidth="2"
      />
      <circle
        cx="100"
        cy="100"
        r="85"
        fill="none"
        stroke="#4a9eff"
        strokeWidth="1"
        opacity="0.4"
      />

      {/* Tick marks around the ring */}
      {Array.from({ length: 36 }).map((_, i) => {
        const angle = (i * 10 * Math.PI) / 180;
        const inner = i % 3 === 0 ? 86 : 89;
        const outer = 95;
        return (
          <line
            key={i}
            x1={100 + inner * Math.cos(angle)}
            y1={100 + inner * Math.sin(angle)}
            x2={100 + outer * Math.cos(angle)}
            y2={100 + outer * Math.sin(angle)}
            stroke="#4a9eff"
            strokeWidth={i % 3 === 0 ? "1.5" : "0.5"}
            opacity={i % 3 === 0 ? "0.8" : "0.3"}
          />
        );
      })}

      {/* Inner circle */}
      <circle
        cx="100"
        cy="100"
        r="60"
        fill="none"
        stroke="#4a9eff"
        strokeWidth="1"
        opacity="0.3"
      />

      {/* Crosshair lines */}
      <line
        x1="40"
        y1="100"
        x2="160"
        y2="100"
        stroke="#4a9eff"
        strokeWidth="0.5"
        opacity="0.2"
      />
      <line
        x1="100"
        y1="40"
        x2="100"
        y2="160"
        stroke="#4a9eff"
        strokeWidth="0.5"
        opacity="0.2"
      />

      {/* HIT text */}
      <text
        x="100"
        y="88"
        textAnchor="middle"
        fontFamily="monospace"
        fontSize="28"
        fontWeight="bold"
        fill="#4a9eff"
        letterSpacing="4"
      >
        HIT
      </text>

      {/* Divider */}
      <line
        x1="60"
        y1="98"
        x2="140"
        y2="98"
        stroke="#4a9eff"
        strokeWidth="1"
        opacity="0.5"
      />

      {/* ARC text */}
      <text
        x="100"
        y="122"
        textAnchor="middle"
        fontFamily="monospace"
        fontSize="28"
        fontWeight="bold"
        fill="#4a9eff"
        letterSpacing="4"
      >
        ARC
      </text>

      {/* Subtitle around bottom */}
      <text
        x="100"
        y="150"
        textAnchor="middle"
        fontFamily="monospace"
        fontSize="7"
        fill="#4a9eff"
        opacity="0.6"
        letterSpacing="2"
      >
        ABSTRACTION RESEARCH CENTER
      </text>
    </svg>
  );
}
