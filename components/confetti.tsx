'use client'

interface ConfettiProps {
  left: number
  delay: number
}

export default function Confetti({ left, delay }: ConfettiProps) {
  const confettiType = ['🎉', '💖', '✨', '💕', '🎊', '💗'][Math.floor(Math.random() * 6)]
  const randomX = Math.random() * 200 - 100
  
  return (
    <div
      className="fixed pointer-events-none text-2xl md:text-4xl"
      style={{
        left: `${left}%`,
        top: '-20px',
        animation: `confetti-fall 3s ease-in forwards`,
        animationDelay: `${delay}s`,
        '--tx': `${randomX}px`,
      } as React.CSSProperties & { '--tx': string }}
    >
      {confettiType}
    </div>
  )
}
