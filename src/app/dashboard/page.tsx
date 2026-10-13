'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { QrCode, LogOut, MapPin, Clock, CheckCircle2, Calendar, History, User, Server, Cloud, ShieldCheck, Code, Zap, AlertCircle } from 'lucide-react'

// Define types for strict TypeScript safety
type Profile = {
  full_name: string
  student_id: string
  phone?: string
}

type Session = {
  id: string
  title: string
  description: string
  start_time: string
  location: string
}

type CheckInHistory = {
  id: string
  checked_in_at: string
  sessions: {
    title: string
    location: string
  }
}

export default function Dashboard() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [history, setHistory] = useState<CheckInHistory[]>([])
  const [hasCheckedIn, setHasCheckedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login')
          return
        }

        // 1. Fetch User Profile Safely
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle()
        
        if (userProfile) setProfile(userProfile)

        // 2. Fetch Active Workshop Session Safely
        const { data: activeSession } = await supabase
          .from('sessions')
          .select('*')
          .order('start_time', { ascending: true })
          .limit(1)
          .maybeSingle()
        
        if (activeSession) {
          setSession(activeSession)
          
          // Check if student is already checked in to the active session
          const { data: checkInRecord } = await supabase
            .from('check_ins')
            .select('id')
            .eq('user_id', user.id)
            .eq('session_id', activeSession.id)
            .maybeSingle()
            
          if (checkInRecord) setHasCheckedIn(true)
        }

        // 3. Fetch Attendance History safely
        const { data: historyData } = await supabase
          .from('check_ins')
          .select(`
            id,
            checked_in_at,
            sessions ( title, location )
          `)
          .eq('user_id', user.id)
          .order('checked_in_at', { ascending: false })

        if (historyData) setHistory(historyData as unknown as CheckInHistory[])
      } catch (error) {
        console.error("Dashboard sync error:", error)
      } finally {
        // Ensure the loading screen always disappears
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [router, supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  // Loading Skeleton
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
      <div className="flex flex-col items-center gap-4 text-primary animate-pulse">
        <Server className="w-8 h-8" />
        <p className="text-sm font-bold tracking-widest uppercase">Loading Environment...</p>
      </div>
    </div>
  )

  const firstName = profile?.full_name?.split(' ')[0] || ''

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans pb-12 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-400/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      {/* Engineered Top Navigation */}
      <nav className="bg-white border-b border-border sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xl font-bold tracking-tight text-primary">GenXCode</span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-sm bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/20">
              Workspace
            </span>
          </div>
          <button 
            onClick={handleLogout} 
            title="Log Out"
            className="flex items-center justify-center w-10 h-10 rounded-sm bg-gray-100 hover:bg-red-50 text-secondary hover:text-red-600 border border-border hover:border-red-200 transition-all shadow-sm"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8">
        
        {/* Header Section */}
        <header className="mb-6 sm:mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold text-foreground tracking-tight mb-1 flex items-center gap-3">
              Welcome back, {firstName} <span className="animate-bounce">👋</span>
            </h1>
            <p className="text-xs sm:text-sm text-secondary font-medium flex items-center gap-2 mt-2">
              <span className="flex items-center justify-center w-6 h-6 bg-primary/10 text-primary rounded-full border border-primary/20">
                <User className="w-3.5 h-3.5" /> 
              </span>
              {profile?.full_name} • <span className="font-mono text-primary bg-primary/5 px-1.5 py-0.5 rounded-sm border border-primary/10">{profile?.student_id}</span>
            </p>
          </div>
        </header>

        {/* Dashboard Grid Layout - items-start prevents blank vertical stretching */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          
          {/* Main Column (Left/Center) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Live Session Check-in Card */}
            <section className="bg-white border-2 border-border rounded-sm shadow-md overflow-hidden relative group">
              <div className="h-1.5 w-full bg-gradient-to-r from-primary via-blue-500 to-purple-600"></div>
              <div className="p-5 sm:p-8">
                <div className="flex items-center justify-between mb-5 sm:mb-6">
                  <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                    <Server className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" /> Active Workshop Session
                  </h2>
                  {hasCheckedIn && (
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-green-600 flex items-center gap-1 bg-green-50 px-2 py-1 rounded-sm border border-green-200">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                    </span>
                  )}
                </div>

                {session ? (
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5 sm:gap-6">
                    <div className="flex-1">
                      <h3 className="text-xl sm:text-2xl font-bold text-primary mb-2 leading-tight">{session.title}</h3>
                      <p className="text-xs sm:text-sm text-secondary font-medium mb-4 sm:mb-5 leading-relaxed max-w-md">
                        {session.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[10px] sm:text-xs font-bold text-secondary">
                        <span className="flex items-center gap-1.5 bg-gray-50 px-2 sm:px-3 py-1.5 rounded-sm border border-border shadow-sm text-blue-600">
                          <MapPin className="w-3.5 h-3.5" /> {session.location}
                        </span>
                        <span className="flex items-center gap-1.5 bg-gray-50 px-2 sm:px-3 py-1.5 rounded-sm border border-border shadow-sm text-purple-600">
                          <Clock className="w-3.5 h-3.5" /> 
                          {new Date(session.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                    
                    {/* Session Vitals */}
                    <div className="flex-shrink-0 w-full sm:w-60 flex flex-col gap-3 mt-2 sm:mt-0">
                      <div className={`p-4 border-2 rounded-sm flex flex-col justify-center ${hasCheckedIn ? 'bg-green-50/50 border-green-200' : 'bg-amber-50/50 border-amber-200'}`}>
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">Status</h4>
                        {hasCheckedIn ? (
                          <div className="flex items-center gap-2 text-green-700 font-bold text-sm">
                            <CheckCircle2 className="w-4 h-4" /> Attendance Verified
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
                            <AlertCircle className="w-4 h-4" /> Pending Check-in
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 border border-border p-3 rounded-sm flex flex-col items-center justify-center text-center">
                          <span className="text-[9px] uppercase font-bold tracking-widest text-secondary">Format</span>
                          <span className="text-xs font-bold text-foreground mt-1">In-Person</span>
                        </div>
                        <div className="bg-gray-50 border border-border p-3 rounded-sm flex flex-col items-center justify-center text-center">
                          <span className="text-[9px] uppercase font-bold tracking-widest text-secondary">Duration</span>
                          <span className="text-xs font-bold text-foreground mt-1">180 Mins</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 border-2 border-dashed border-border rounded-sm bg-gray-50/50">
                    <p className="text-xs sm:text-sm font-bold text-secondary uppercase tracking-widest flex items-center justify-center gap-2">
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5" /> No active sessions mapped
                    </p>
                    <p className="text-[10px] sm:text-xs text-secondary mt-1 sm:mt-2">The system is waiting for the administrator to deploy the workshop session.</p>
                  </div>
                )}
              </div>
            </section>

            {/* GenXCode X AWS Details Section */}
            <section className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200/50 rounded-sm shadow-sm p-5 sm:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 rounded-bl-[100px] pointer-events-none -z-10"></div>
              
              <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-white bg-blue-600 px-2 sm:px-2.5 py-1 rounded-sm shadow-sm flex items-center gap-1.5">
                      <Zap className="w-3 h-3 text-yellow-300 fill-yellow-300" /> Exclusive Event
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-3xl font-bold text-foreground mb-2 sm:mb-3 leading-tight tracking-tight">
                    GenXCode x AWS Workshop
                  </h3>
                  <p className="text-xs sm:text-sm text-secondary font-medium leading-relaxed mb-5 sm:mb-6 max-w-lg">
                    Don't miss the opportunity to architect real-world cloud infrastructure. This workshop bridges the gap between academic theory and enterprise deployment.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-5 sm:mb-0">
                    <div className="flex items-start gap-2.5 bg-white/60 backdrop-blur-sm p-3 rounded-sm border border-blue-100">
                      <Cloud className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-[11px] sm:text-xs font-bold text-foreground">Core Architecture</p>
                        <p className="text-[9px] sm:text-[10px] text-secondary font-medium">Master EC2, S3, & VPCs</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 bg-white/60 backdrop-blur-sm p-3 rounded-sm border border-blue-100">
                      <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-[11px] sm:text-xs font-bold text-foreground">Official Credentials</p>
                        <p className="text-[9px] sm:text-[10px] text-secondary font-medium">Verifiable attendance tracking</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 bg-white/60 backdrop-blur-sm p-3 rounded-sm border border-blue-100 sm:col-span-2">
                      <Code className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-[11px] sm:text-xs font-bold text-foreground">Project-Based Learning</p>
                        <p className="text-[9px] sm:text-[10px] text-secondary font-medium">Deploy Next.js apps directly to AWS infrastructure.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Direct Action Button */}
                <div className="w-full sm:w-auto mt-2 sm:mt-0 flex-shrink-0 flex flex-col justify-center h-full pt-2 sm:pt-10">
                  {hasCheckedIn ? (
                    <div className="w-full sm:w-48 bg-green-50 border-2 border-green-200 text-green-700 font-bold text-xs sm:text-sm px-4 sm:px-6 py-3 sm:py-4 rounded-sm shadow-sm flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      Attendance Logged
                    </div>
                  ) : (
                    <Link 
                      href="/dashboard/scan"
                      className="w-full sm:w-48 bg-primary hover:bg-foreground transition-colors text-white font-bold text-xs sm:text-sm px-4 sm:px-6 py-3 sm:py-4 rounded-sm shadow-md flex items-center justify-center gap-2 group"
                    >
                      <QrCode className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform" />
                      Mark Attendance
                    </Link>
                  )}
                  <p className="text-[9px] sm:text-[10px] text-center text-secondary font-medium mt-2 sm:mt-3 px-2">
                    {hasCheckedIn ? "Your cryptographic credential is secure." : "Scanning generates your cryptographic workshop credential."}
                  </p>
                </div>
              </div>
            </section>

          </div>

          {/* Side Column (Right) */}
          <div className="space-y-6">
            
            {/* Attendance & Telemetry History */}
            <section className="bg-white border-2 border-border rounded-sm shadow-sm overflow-hidden flex flex-col max-h-[400px] lg:max-h-[600px]">
              <div className="p-4 sm:p-5 border-b border-border bg-gray-50 flex items-center justify-between">
                <h3 className="text-xs sm:text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                  <History className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-500" /> Telemetry Log
                </h3>
                <span className="text-[10px] sm:text-xs font-bold text-primary bg-primary/10 px-2 py-1 border border-primary/20 rounded-sm">
                  {history.length} Records
                </span>
              </div>
              
              <div className="p-0 overflow-y-auto flex-grow bg-white">
                {history.length > 0 ? (
                  <ul className="divide-y divide-border">
                    {history.map((record) => (
                      <li key={record.id} className="p-4 sm:p-5 hover:bg-gray-50 transition-colors border-l-4 border-l-transparent hover:border-l-primary">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-xs sm:text-sm font-bold text-foreground leading-tight mb-1">{record.sessions.title}</p>
                            <p className="text-[10px] sm:text-xs text-secondary font-medium flex items-center gap-1 mb-2 sm:mb-3">
                              <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-500" /> {record.sessions.location}
                            </p>
                          </div>
                        </div>
                        <div className="text-[9px] sm:text-[10px] font-mono font-bold text-primary bg-primary/5 border border-primary/20 px-2 py-1 inline-block rounded-sm">
                          LOGGED: {new Date(record.checked_in_at).toLocaleDateString()} @ {new Date(record.checked_in_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-6 sm:p-8 text-center flex flex-col items-center justify-center h-full text-secondary py-12">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                      <Calendar className="w-5 h-5 sm:w-6 sm:h-6 opacity-50" />
                    </div>
                    <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-foreground">No history found</p>
                    <p className="text-[9px] sm:text-xs mt-1">Attend sessions to build your profile.</p>
                  </div>
                )}
              </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  )
}