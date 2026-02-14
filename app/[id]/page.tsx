'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function ValentinePage() {
  const params = useParams()
  const id = params?.id as string

  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [hasResponded, setHasResponded] = useState(false)
  const [showHearts, setShowHearts] = useState(false)
  const [noClickCount, setNoClickCount] = useState(0)
  const [showInitialBackground, setShowInitialBackground] = useState(true)
  // Added state for background love animation
  const [showLoveBackground, setShowLoveBackground] = useState(false)

  const noButtonTitles = ["No", "Are you sure?", "Really?", "Think again!", "Last chance!"]

  const loveEmojis = [
    '❤️','💖','💕','💗','💓','💞','💘','💝',
    '🌹','🌷','💐','🎁','💌','💋','✨','💫'
  ]

  useEffect(() => {
    if (!id) return

    const load = async () => {
      const { data } = await supabase
        .from('valentine_requests')
        .select('valentine_name')
        .eq('unique_link', id)
        .maybeSingle()

      if (data) setName(data.valentine_name)
      setIsLoading(false)
    }

    load()
  }, [id])

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInitialBackground(false)
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

  const handleYes = async () => {
    if (id) {
      await supabase
        .from('valentine_requests')
        .update({
          response: true,
          responded_at: new Date().toISOString(),
          no_attempts: noClickCount
        })
        .eq('unique_link', id)
    }

    setShowHearts(true)
    setHasResponded(true)
    setShowLoveBackground(true) // Activate background love animation
    setTimeout(() => setShowHearts(false), 3000)
  }

  const handleNo = () => {
    if (noClickCount < 4) {
      setNoClickCount(prev => prev + 1)

      if (noClickCount === 3 && id) {
        supabase
          .from('valentine_requests')
          .update({
            response: false,
            responded_at: new Date().toISOString(),
            no_attempts: 4
          })
          .eq('unique_link', id)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-100 to-amber-100 flex items-center justify-center">
        <div className="animate-ping text-6xl text-rose-500">❤️</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 overflow-hidden relative">

      {/* Initial 5s Emoji Burst */}
      {showInitialBackground && (
        <div className="fixed inset-0 pointer-events-none z-0">
          {[...Array(40)].map((_, i) => {
            const size = Math.random() * 30 + 20
            const left = Math.random() * 100
            const top = Math.random() * 100
            const delay = Math.random() * 1.5
            const emoji = loveEmojis[Math.floor(Math.random() * loveEmojis.length)]

            return (
              <div
                key={i}
                className="absolute animate-loveFloatOut"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  fontSize: `${size}px`,
                  animationDelay: `${delay}s`
                }}
              >
                {emoji}
              </div>
            )
          })}
        </div>
      )}

      {/* Permanent Floating Hearts */}
      {[...Array(15)].map((_, i) => {
        const size = Math.random() * 24 + 16
        const duration = Math.random() * 20 + 15
        const delay = Math.random() * 5

        return (
          <div
            key={i}
            className="absolute opacity-20 animate-float"
            style={{
              fontSize: `${size}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
            }}
          >
            {['❤️','💖','💕','💗'][Math.floor(Math.random()*4)]}
          </div>
        )
      })}

      {/* YES Heart Explosion */}
      {showHearts && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl animate-heartBurst"
              style={{
                left: '50%',
                top: '50%',
                animationDelay: `${i * 0.03}s`,
                transform: `rotate(${i * 12}deg)`
              }}
            >
              ❤️
            </div>
          ))}
        </div>
      )}

      {/* New: Full Background Love Animation on YES */}
      {showLoveBackground && (
        <div className="fixed inset-0 pointer-events-none z-20">
          {[...Array(100)].map((_, i) => {
            const size = Math.random() * 40 + 20;
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            const emoji = loveEmojis[Math.floor(Math.random() * loveEmojis.length)];
            
            return (
              <div
                key={`love-${i}`}
                className="absolute animate-lovePop"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  fontSize: `${size}px`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${Math.random() * 3 + 2}s`
                }}
              >
                {emoji}
              </div>
            );
          })}
        </div>
      )}

      <style jsx global>{`
        @keyframes float {
          0%,100% { transform: translateY(0) }
          50% { transform: translateY(-20px) }
        }
        .animate-float {
          animation: float ease-in-out infinite;
        }

        @keyframes heartBurst {
          0% { opacity:1; transform: translate(-50%,-50%) scale(0.2) }
          100% { opacity:0; transform: translate(-50%,-50%) scale(3) }
        }
        .animate-heartBurst {
          animation: heartBurst 1.5s ease-out forwards;
        }

        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(255,100,150,0.4) }
          70% { box-shadow: 0 0 0 15px rgba(255,100,150,0) }
          100% { box-shadow: 0 0 0 0 rgba(255,100,150,0) }
        }
        .animate-button-pulse {
          animation: pulse 1.5s infinite;
        }

        @keyframes loveFloatOut {
          0% { opacity:1; transform: translateY(0) }
          100% { opacity:0; transform: translateY(-100px) }
        }
        .animate-loveFloatOut {
          animation: loveFloatOut 2s ease-out forwards;
        }

        /* New animation for background love emojis */
        @keyframes lovePop {
          0% { 
            opacity: 0; 
            transform: scale(0.5) rotate(0deg);
          }
          50% { 
            opacity: 1; 
            transform: scale(1.2) rotate(180deg);
          }
          100% { 
            opacity: 0; 
            transform: scale(2) rotate(360deg);
          }
        }
        .animate-lovePop {
          animation: lovePop ease-out forwards;
        }
      `}</style>

      <div className="flex items-center justify-center min-h-screen p-4 relative z-10">
        {!hasResponded ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border border-pink-100">

            <div className="text-7xl animate-bounce mb-6">💌</div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-pink-500">
                Will you be<br/>my Valentine
              </span>

              {name && (
                <>
                  <br/>
                  <div className="relative inline-block mt-4">
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-3xl drop-shadow-md">
                      👑
                    </div>
                    <span className="text-rose-600 font-extrabold text-3xl">
                      {name}
                    </span>
                  </div>
                </>
              )}

              <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-pink-500">?</span>
            </h1>

            {/* Attempt Counter */}
            <div className="mt-4 mb-8 min-h-[24px]">
              {noClickCount < 4 ? (
                <p className="text-pink-600 font-medium text-lg">
                  {4 - noClickCount} attempts until you change your mind ❤️
                </p>
              ) : (
                <p className="text-rose-600 font-bold text-xl">
                  No more chances! You have to be my Valentine 💘
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">

              <button
                onClick={handleYes}
                className={`px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold rounded-full text-xl shadow-lg transform transition-all hover:scale-110 active:scale-95 ${
                  noClickCount >= 3 ? 'animate-button-pulse' : ''
                }`}
                style={{
                  width: `${160 + noClickCount * 20}px`,
                  fontSize: `${1.25 + noClickCount * 0.1}rem`
                }}
              >
                Yes!
              </button>

              {noClickCount < 4 && (
                <button
                  onClick={handleNo}
                  className="px-8 py-4 bg-white border-2 border-pink-200 text-pink-700 font-bold rounded-full shadow-sm transition-all"
                  style={{
                    width: `${150 - noClickCount * 15}px`,
                    fontSize: `${1.2 - noClickCount * 0.12}rem`,
                    marginLeft: `-${noClickCount * 20}px`
                  }}
                >
                  {noButtonTitles[noClickCount]}
                </button>
              )}
            </div>

            {noClickCount > 0 && noClickCount < 4 && (
              <p className="mt-6 text-sm text-pink-500 italic">
                (You know you want to say yes... ❤️)
              </p>
            )}

          </div>
        ) : (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-10 max-w-md w-full text-center border border-rose-100">

            <div className="text-8xl mb-4 animate-bounce">🎉</div>

            <h1 className="text-4xl font-bold text-rose-600 mb-3">
              {name ? `Yay, ${name}!` : 'Yay!'}
            </h1>

            <p className="text-2xl font-bold text-rose-600 mb-2">
              You made my heart skip a beat 💓
            </p>

            <p className="text-lg text-pink-700 mb-8">
              Happy Valentine's Day ❤️
            </p>
            <p className="text-lg text-pink-700 mb-8">
              You just made someone's day a whole lot brighter!
            </p>
            
            <button
              onClick={() => window.location.href = '/'}
              className="px-8 py-4 bg-gradient-to-r from-amber-400 to-rose-400 text-white font-bold rounded-full text-xl shadow-lg hover:scale-105 transition-all"
            >
              Send More Love
            </button>

          </div>
        )}
      </div>
    </div>
  )
}