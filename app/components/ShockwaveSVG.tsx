interface ShockwaveSVGProps {
  intensity: number
}

export function ShockwaveSVG({ intensity }: ShockwaveSVGProps) {
  const waves = Array.from({ length: intensity }, (_, i) => ({
    id: i,
    delay: i * 0.1,
  }))

  return (
    <svg className="fixed inset-0 pointer-events-none z-30" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      {waves.map((wave) => (
        <g key={wave.id}>
          {/* Expanding ring */}
          <circle
            cx="50"
            cy="70"
            fill="none"
            stroke={`rgba(255, ${100 - wave.id * 20}, 0, ${1 - wave.id * 0.15})`}
            strokeWidth={intensity - wave.id * 0.5}
            style={{
              animation: `shockwave-${wave.id} 0.8s ease-out ${wave.delay}s forwards`,
            }}
          >
            <animate
              attributeName="r"
              from="0"
              to={30 + intensity * 5}
              dur="0.8s"
              begin={`${wave.delay}s`}
              fill="freeze"
            />
            <animate
              attributeName="opacity"
              from="1"
              to="0"
              dur="0.8s"
              begin={`${wave.delay}s`}
              fill="freeze"
            />
            <animate
              attributeName="stroke-width"
              from={intensity * 2}
              to={0.5}
              dur="0.8s"
              begin={`${wave.delay}s`}
              fill="freeze"
            />
          </circle>
        </g>
      ))}

      <style>{`
        @keyframes shockwave-0 { 0% { transform: scale(0); } 100% { transform: scale(1); } }
        @keyframes shockwave-1 { 0% { transform: scale(0); } 100% { transform: scale(1); } }
        @keyframes shockwave-2 { 0% { transform: scale(0); } 100% { transform: scale(1); } }
        @keyframes shockwave-3 { 0% { transform: scale(0); } 100% { transform: scale(1); } }
        @keyframes shockwave-4 { 0% { transform: scale(0); } 100% { transform: scale(1); } }
      `}</style>
    </svg>
  )
}
