'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function HomePage() {
  const [name, setName] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [link, setLink] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    
    setIsLoading(true)
    const id = Math.random().toString(36).substring(2, 8)
    
    // Save to Supabase database
    const { error } = await supabase
      .from('valentine_requests')
      .insert([{ 
        valentine_name: name.trim(), 
        unique_link: id
      }])
    
    if (error) {
      console.error('Supabase insert error:', error)
      alert('Failed to create link. Please try again.')
      setIsLoading(false)
      return
    }
    
    const newLink = `${window.location.origin}/${id}`
    setLink(newLink)
    setShowSuccess(true)
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-amber-50 flex items-center justify-center p-4">
      {!showSuccess ? (
        <div className="text-center max-w-md w-full">
          <h1 className="text-4xl font-bold text-rose-700 mb-2">💌 Valentine's Invite</h1>
          <p className="text-gray-600 mb-6">Enter your Valentine’s name to generate a special link</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Alex"
              className="w-full px-5 py-4 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-300 text-lg"
              autoFocus
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold py-4 rounded-xl text-xl hover:opacity-90 transition-opacity shadow-lg disabled:opacity-70"
            >
              {isLoading ? 'Creating...' : 'Generate Invite Link'}
            </button>
          </form>
        </div>
      ) : (
        <div className="text-center max-w-md w-full">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-3xl font-bold text-rose-700 mb-2">Link Ready!</h2>
          <p className="text-gray-600 mb-4">Send this to your Valentine:</p>
          
          <div className="bg-white rounded-xl p-4 shadow-md mb-6">
            <input
              type="text"
              value={link}
              readOnly
              className="w-full text-center font-mono text-rose-700 font-medium"
            />
          </div>
          
          <button
            onClick={() => {
              navigator.clipboard.writeText(link)
              alert('Copied! 💌')
            }}
            className="bg-rose-100 text-rose-700 font-bold py-3 px-6 rounded-lg mb-4 hover:bg-rose-200"
          >
            📋 Copy Link
          </button>
          
          <button
            onClick={() => {
              setName('')
              setShowSuccess(false)
            }}
            className="text-rose-600 hover:text-rose-800 font-medium"
          >
            Create Another
          </button>
        </div>
      )}
    </div>
  )
}