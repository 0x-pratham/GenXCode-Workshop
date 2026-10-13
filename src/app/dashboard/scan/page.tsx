'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import QRScanner from '@/components/qr-scanner'
import Link from 'next/link'
import { ArrowLeft, Loader2, CheckCircle2, XCircle, QrCode, ShieldCheck } from 'lucide-react'

export default function ScanPage() {
  const [status, setStatus] = useState<'scanning' | 'processing' | 'success' | 'error'>('scanning')
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleScan = async (qrPayload: string) => {
    setStatus('processing')
    
    // 1. Get logged-in user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setStatus('error')
      setMessage('Authentication error. Please log in again.')
      return
    }

    // 2. Find the session matching this QR payload
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select('id, title')
      .eq('qr_payload', qrPayload)
      .single()

    if (sessionError || !session) {
      setStatus('error')
      setMessage('Invalid or expired Session QR Code.')
      return
    }

    // 3. Register the check-in
    const { error: checkInError } = await supabase
      .from('check_ins')
      .insert({
        user_id: user.id,
        session_id: session.id
      })

    if (checkInError) {
      if (checkInError.code === '23505') { // Postgres unique violation code
        setStatus('error')
        setMessage('You have already verified your attendance for this session.')
      } else {
        setStatus('error')
        setMessage('Failed to process check-in. Please try again.')
      }
    } else {
      setStatus('success')
      setMessage(`Attendance marked for ${session.title}`)
      
      // Return to dashboard automatically
      setTimeout(() => {
        router.refresh()
        router.push('/dashboard')
      }, 2500)
    }
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-white selection:bg-primary/20 selection:text-primary w-full max-w-[100vw]">
      
      {/* Engineered Grid Background */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-40"></div>
      
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] sm:w-[300px] h-[250px] sm:h-[300px] bg-primary/10 blur-[60px] sm:blur-[80px] rounded-full pointer-events-none -z-10"></div>

      {/* Top Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-border sticky top-0 z-20">
        <div className="max-w-md mx-auto px-4 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link 
              href="/dashboard" 
              className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-sm bg-gray-50 hover:bg-gray-100 text-secondary border border-border transition-colors"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
              <QrCode className="w-4 h-4 sm:w-5 sm:h-5 text-primary" /> Check-in Scanner
            </h1>
          </div>
        </div>
      </nav>

      {/* Main Scanner Area */}
      <main className="flex-grow flex flex-col items-center justify-center p-4 w-full max-w-md mx-auto z-10">
        
        <div className="w-full bg-white/80 backdrop-blur-xl border-2 border-border shadow-xl sm:shadow-2xl rounded-sm overflow-hidden relative">
          
          {/* Decorative Header Bar */}
          <div className={`h-1 sm:h-1.5 w-full relative overflow-hidden transition-colors duration-500 ${
            status === 'error' ? 'bg-red-500' : 
            status === 'success' ? 'bg-green-500' : 
            'bg-primary'
          }`}>
            {status === 'scanning' && <div className="absolute inset-0 bg-white/20 w-1/3 animate-[translateX_2s_infinite]"></div>}
          </div>

          <div className="p-5 sm:p-6 md:p-8 flex flex-col items-center min-h-[350px] sm:min-h-[400px] justify-center">

            {/* STATE: SCANNING */}
            {status === 'scanning' && (
              <div className="w-full flex flex-col items-center animate-in fade-in zoom-in duration-300">
                <div className="w-full max-w-[260px] sm:max-w-full aspect-square relative mb-5 sm:mb-6">
                  {/* Viewfinder Corners Decor */}
                  <div className="absolute top-0 left-0 w-6 sm:w-8 h-6 sm:h-8 border-t-[3px] sm:border-t-4 border-l-[3px] sm:border-l-4 border-primary rounded-tl-sm z-10"></div>
                  <div className="absolute top-0 right-0 w-6 sm:w-8 h-6 sm:h-8 border-t-[3px] sm:border-t-4 border-r-[3px] sm:border-r-4 border-primary rounded-tr-sm z-10"></div>
                  <div className="absolute bottom-0 left-0 w-6 sm:w-8 h-6 sm:h-8 border-b-[3px] sm:border-b-4 border-l-[3px] sm:border-l-4 border-primary rounded-bl-sm z-10"></div>
                  <div className="absolute bottom-0 right-0 w-6 sm:w-8 h-6 sm:h-8 border-b-[3px] sm:border-b-4 border-r-[3px] sm:border-r-4 border-primary rounded-br-sm z-10"></div>
                  
                  {/* Actual Scanner Component */}
                  <div className="absolute inset-1.5 sm:inset-2 overflow-hidden rounded-sm bg-black">
                    <QRScanner onScanSuccess={handleScan} />
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-1 sm:mb-2 tracking-tight">System Ready</h3>
                <p className="text-xs sm:text-sm text-secondary text-center font-medium max-w-[220px] sm:max-w-[250px]">
                  Align the universal workshop QR code within the frame to verify attendance.
                </p>
              </div>
            )}

            {/* STATE: PROCESSING */}
            {status === 'processing' && (
              <div className="flex flex-col items-center justify-center w-full animate-in fade-in duration-300 py-8 sm:py-12">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 border-2 border-primary/20 rounded-full flex items-center justify-center mb-5 sm:mb-6 relative">
                  <div className="absolute inset-0 border-t-2 border-primary rounded-full animate-spin"></div>
                  <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 text-primary animate-pulse" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-1 sm:mb-2">Authenticating</h3>
                <p className="text-[10px] sm:text-sm text-secondary font-mono tracking-widest uppercase animate-pulse text-center">
                  Verifying Cryptographic Payload...
                </p>
              </div>
            )}

            {/* STATE: SUCCESS */}
            {status === 'success' && (
              <div className="flex flex-col items-center justify-center w-full animate-in zoom-in duration-500 py-6 sm:py-8">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-green-50 border-4 border-green-200 rounded-full flex items-center justify-center mb-5 sm:mb-6 shadow-inner">
                  <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-green-500" strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-green-600 mb-2 sm:mb-3 tracking-tight">Access Granted</h3>
                <div className="bg-gray-50 border border-border px-3 sm:px-4 py-2 sm:py-3 rounded-sm text-center w-full">
                  <p className="text-xs sm:text-sm font-bold text-foreground">{message}</p>
                </div>
                <p className="text-[10px] sm:text-xs font-mono text-secondary mt-5 sm:mt-6 uppercase tracking-widest animate-pulse">
                  Redirecting to Workspace...
                </p>
              </div>
            )}

            {/* STATE: ERROR */}
            {status === 'error' && (
              <div className="flex flex-col items-center justify-center w-full animate-in slide-in-from-bottom-4 duration-300 py-4 sm:py-6">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-red-50 border-4 border-red-200 rounded-full flex items-center justify-center mb-5 sm:mb-6 shadow-inner">
                  <XCircle className="w-10 h-10 sm:w-12 sm:h-12 text-red-500" strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-red-600 mb-2 sm:mb-3 tracking-tight">Access Denied</h3>
                <div className="bg-red-50/50 border border-red-100 px-3 sm:px-4 py-2 sm:py-3 rounded-sm text-center w-full mb-6 sm:mb-8">
                  <p className="text-xs sm:text-sm font-bold text-red-800">{message}</p>
                </div>
                <button 
                  onClick={() => setStatus('scanning')}
                  className="w-full flex items-center justify-center gap-2 h-10 sm:h-12 bg-primary hover:bg-foreground transition-colors text-white rounded-sm text-sm sm:text-base font-bold shadow-md"
                >
                  <QrCode className="w-4 h-4 sm:w-5 sm:h-5" /> Scan Again
                </button>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  )
}