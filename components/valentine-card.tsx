'use client'

import { useState, useRef } from 'react'

interface ValentineCardProps {
  onYes: () => void
}

export default function ValentineCard({ onYes }: ValentineCardProps) {
  const [noCount, setNoCount] = useState(0)
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 })
  const [yesScale, setYesScale] = useState(1)
  const noButtonRef = useRef<HTMLButtonElement>(null)

  const handleNoClick = () => {
    setNoCount((prev) => prev + 1)
    setYesScale((prev) => Math.min(prev + 0.15, 2.5))

    // Move the No button to a random position
    const randomX = Math.random() * 200 - 100
    const randomY = Math.random() * 200 - 100
    setNoPosition({ x: randomX, y: randomY })
  }

  const getNoButtonText = () => {
    if (noCount === 0) return 'No'
    if (noCount === 1) return 'Are you sure?'
    if (noCount === 2) return 'Really?'
    if (noCount === 3) return 'Think again!'
    if (noCount === 4) return 'Last chance!'
    return 'Pretty please?'
  }

  return (
    <div className="relative w-full max-w-md px-6 py-12 bg-white rounded-3xl shadow-2xl flex flex-col items-center gap-8 animate-in zoom-in duration-500">
      {/* Decorative hearts */}
      <div className="absolute -top-6 -left-6 text-5xl opacity-50">💗</div>
      <div className="absolute -bottom-6 -right-6 text-5xl opacity-50">💕</div>

      {/* Main content */}
      <div className="text-center space-y-4 z-10">
        <h1 className="text-5xl font-bold text-primary">Will you be</h1>
        <p className="text-4xl font-bold text-accent">my Valentine?</p>
        <div className="text-6xl pt-4">💖</div>
      </div>

      {/* Message when No is clicked multiple times */}
      {noCount >= 5 && (
        <div className="text-center space-y-2 px-4 py-3 bg-red-50 rounded-xl border-2 border-primary animate-bounce">
          <p className="text-sm font-semibold text-primary">
            Plot twist: You're saying yes anyway! 😏
          </p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-4 items-center flex-wrap justify-center w-full relative z-20">
        <button
          onClick={onYes}
          className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-primary/90 transition-all duration-200 whitespace-nowrap"
          style={{
            transform: `scale(${yesScale})`,
            transformOrigin: 'center',
          }}
        >
          Yes!
        </button>

        <button
          ref={noButtonRef}
          onClick={handleNoClick}
          disabled={noCount >= 5}
          className="px-6 py-3 bg-secondary text-secondary-foreground font-semibold rounded-full hover:bg-secondary/80 transition-all duration-300 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            transform: `translate(${noPosition.x}px, ${noPosition.y}px)`,
            pointerEvents: noCount >= 5 ? 'none' : 'auto',
          }}
        >
          {getNoButtonText()}
        </button>
      </div>

      {/* Attempt counter */}
      {noCount > 0 && noCount < 5 && (
        <p className="text-xs text-muted-foreground text-center">
          {5 - noCount} attempt{5 - noCount !== 1 ? 's' : ''} until you change your mind
        </p>
      )}
    </div>
  )
}
