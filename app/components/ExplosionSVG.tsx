interface ExplosionSVGProps {
  intensity: number
  onComplete?: () => void
}

export function ExplosionSVG({ intensity, onComplete }: ExplosionSVGProps) {
  const particles = Array.from({ length: intensity * 8 }, (_, i) => ({
    id: i,
    angle: (i / (intensity * 8)) * 360,
    distance: 50 + Math.random() * 100,
    size: 5 + Math.random() * 10,
    delay: Math.random() * 0.2,
  }))

  const colors = ['#ff0000', '#ff4400', '#ff8800', '#ffcc00', '#ffffff']

  return (
    <svg
      className="fixed inset-0 pointer-events-none z-40"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      style={{
        filter: 'drop-shadow(0 0 10px rgba(255, 100, 0, 0.8))',
      }}
    >
      <defs>
        <radialGradient id="glow">
          <stop offset="0%" stopColor="#ff6600" stopOpacity="1" />
          <stop offset="100%" stopColor="#ff0000" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Central burst */}
      <circle
        cx="50"
        cy="50"
        r={intensity * 5}
        fill="url(#glow)"
        style={{
          animation: 'burst 0.5s ease-out forwards',
        }}
      >
        <animate
          attributeName="r"
          from="0"
          to={intensity * 30}
          dur="0.5s"
          fill="freeze"
        />
        <animate
          attributeName="opacity"
          from="1"
          to="0"
          dur="0.5s"
          fill="freeze"
          onAnimationEnd={onComplete}
        />
      </circle>

      {/* Particles */}
      {particles.map((p) => {
        const x = 50 + Math.cos((p.angle * Math.PI) / 180) * p.distance
        const y = 50 + Math.sin((p.angle * Math.PI) / 180) * p.distance
        const color = colors[Math.floor(Math.random() * colors.length)]

        return (
          <g key={p.id}>
            {/* Particle trail */}
            <line
              x1="50"
              y1="50"
              x2={x}
              y2={y}
              stroke={color}
              strokeWidth={p.size / 3}
              strokeOpacity="0.5"
              style={{
                animation: `trail-${p.id} 0.6s ease-out ${p.delay}s forwards`,
              }}
            />

            {/* Particle */}
            <circle
              cx={x}
              cy={y}
              r={p.size / 2}
              fill={color}
              style={{
                animation: `particle-${p.id} 0.6s ease-out ${p.delay}s forwards`,
              }}
            >
              <animate
                attributeName="cx"
                from="50"
                to={x}
                dur="0.6s"
                begin={`${p.delay}s`}
                fill="freeze"
              />
              <animate
                attributeName="cy"
                from="50"
                to={y}
                dur="0.6s"
                begin={`${p.delay}s`}
                fill="freeze"
              />
              <animate
                attributeName="opacity"
                from="1"
                to="0"
                dur="0.6s"
                begin={`${p.delay}s`}
                fill="freeze"
              />
              <animate
                attributeName="r"
                from={p.size}
                to={p.size / 4}
                dur="0.6s"
                begin={`${p.delay}s`}
                fill="freeze"
              />
            </circle>

            {/* Sparkles */}
            {[...Array(3)].map((_, i) => (
              <circle
                key={i}
                r={1}
                fill="#ffffff"
                style={{
                  animation: `sparkle-${p.id}-${i} 0.4s ease-out ${p.delay + i * 0.05}s forwards`,
                }}
              >
                <animate
                  attributeName="cx"
                  from="50"
                  to={x + (Math.random() - 0.5) * 20}
                  dur="0.4s"
                  begin={`${p.delay + i * 0.05}s`}
                  fill="freeze"
                />
                <animate
                  attributeName="cy"
                  from="50"
                  to={y + (Math.random() - 0.5) * 20}
                  dur="0.4s"
                  begin={`${p.delay + i * 0.05}s`}
                  fill="freeze"
                />
                <animate
                  attributeName="opacity"
                  from="1"
                  to="0"
                  dur="0.4s"
                  begin={`${p.delay + i * 0.05}s`}
                  fill="freeze"
                />
              </circle>
            ))}
          </g>
        )
      })}

      <style>{`
        @keyframes burst {
          0% { transform: scale(0); }
          100% { transform: scale(1); }
        }
      `}</style>
    </svg>
  )
}
