interface FireExplosionSVGProps {
  intensity: number
}

export function FireExplosionSVG({ intensity }: FireExplosionSVGProps) {
  const flames = Array.from({ length: intensity * 10 }, (_, i) => ({
    id: i,
    x: 50 + (Math.random() - 0.5) * 40,
    height: 10 + Math.random() * 20 * intensity,
    width: 2 + Math.random() * 4,
    delay: Math.random() * 0.3,
    color: Math.random() > 0.5 ? '#ff4400' : '#ff8800',
  }))

  return (
    <svg className="fixed inset-0 pointer-events-none z-30" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="fireGradient" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#ff0000" stopOpacity="1" />
          <stop offset="50%" stopColor="#ff6600" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ffff00" stopOpacity="0" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Central fire burst */}
      <ellipse
        cx="50"
        cy="70"
        rx={intensity * 3}
        ry={intensity * 5}
        fill="url(#fireGradient)"
        filter="url(#glow)"
        style={{ mixBlendMode: 'screen' }}
      >
        <animate
          attributeName="ry"
          from="0"
          to={intensity * 20}
          dur="0.6s"
          fill="freeze"
        />
        <animate
          attributeName="opacity"
          from="1"
          to="0"
          dur="0.6s"
          fill="freeze"
        />
      </ellipse>

      {/* Rising flames */}
      {flames.map((flame) => (
        <g key={flame.id} filter="url(#glow)">
          <ellipse
            cx={flame.x}
            cy="70"
            rx={flame.width}
            ry={flame.height}
            fill={flame.color}
            style={{ mixBlendMode: 'screen' }}
          >
            <animate
              attributeName="cy"
              from="70"
              to={70 - flame.height * 2}
              dur="0.6s"
              begin={`${flame.delay}s`}
              fill="freeze"
            />
            <animate
              attributeName="rx"
              from={flame.width}
              to={flame.width * 0.3}
              dur="0.6s"
              begin={`${flame.delay}s`}
              fill="freeze"
            />
            <animate
              attributeName="opacity"
              from="1"
              to="0"
              dur="0.6s"
              begin={`${flame.delay}s`}
              fill="freeze"
            />
          </ellipse>
        </g>
      ))}

      {/* Ember particles */}
      {Array.from({ length: intensity * 5 }, (_, i) => (
        <circle key={`ember-${i}`} r={0.5 + Math.random()} fill="#ff6600">
          <animate
            attributeName="cx"
            from="50"
            to={50 + (Math.random() - 0.5) * 60}
            dur="0.8s"
            begin={`${Math.random() * 0.3}s`}
            fill="freeze"
          />
          <animate
            attributeName="cy"
            from="70"
            to={70 - Math.random() * 40}
            dur="0.8s"
            begin={`${Math.random() * 0.3}s`}
            fill="freeze"
          />
          <animate
            attributeName="opacity"
            from="1"
            to="0"
            dur="0.8s"
            begin={`${Math.random() * 0.3}s`}
            fill="freeze"
          />
        </circle>
      ))}
    </svg>
  )
}
