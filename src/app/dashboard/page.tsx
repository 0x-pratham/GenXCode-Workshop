'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { QrCode, LogOut, MapPin, Clock, CheckCircle2, Calendar, History, User, Server, Cloud, ShieldCheck, Code, Zap, AlertCircle, Award, Gift, Users, Video, Wifi } from 'lucide-react'

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
  meeting_link?: string
  is_online_enabled?: boolean
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
  const [isJoining, setIsJoining] = useState(false)
  
  const supabase = createClient()
  const router = useRouter()

  const loadDashboardData = async (showLoading = true) => {
    if (showLoading) setLoading(true)
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
      if (showLoading) setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()

    // Real-time listener: Instantly update session data if Admin publishes the link
    const channel = supabase.channel('student_session_stream')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'sessions' },
        (payload) => {
          setSession((prev) => prev?.id === payload.new.id ? { ...prev, ...payload.new } : prev)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [router, supabase])

  const handleOnlineJoin = async () => {
    if (!session?.meeting_link) return
    setIsJoining(true)

    try {
      if (!hasCheckedIn) {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          // Securely log attendance in database
          await supabase.from('check_ins').insert({
            user_id: user.id,
            session_id: session.id
          })
          setHasCheckedIn(true)
          // Refresh history silently
          loadDashboardData(false)
        }
      }
      // Route user to the meeting in a new tab
      window.open(session.meeting_link, '_blank')
    } catch (error) {
      console.error("Failed to process online check-in", error)
    } finally {
      setIsJoining(false)
    }
  }

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

        {/* Dashboard Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          
          {/* Main Column (Left/Center) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Unified Active Session & Workshop Features Card */}
            {session ? (
              <section className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200/50 rounded-sm shadow-sm relative overflow-hidden flex flex-col">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 rounded-bl-[100px] pointer-events-none -z-10"></div>
                <div className="h-1.5 w-full bg-gradient-to-r from-primary via-blue-500 to-purple-600 absolute top-0 left-0"></div>
                
                <div className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start flex-grow mt-1">
                  
                  {/* Left Content: Session Details & Features */}
                  <div className="flex-1 w-full">
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white bg-blue-600 px-2.5 py-1 rounded-sm shadow-sm flex items-center gap-1.5">
                        <Zap className="w-3 h-3 text-yellow-300 fill-yellow-300" /> Active Session
                      </span>
                      {hasCheckedIn && (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-green-700 bg-green-100 px-2.5 py-1 rounded-sm shadow-sm border border-green-200 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-green-600" /> Verified
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 leading-tight tracking-tight">
                      {session.title}
                    </h3>
                    <p className="text-sm text-secondary font-medium leading-relaxed mb-5 max-w-lg">
                      {session.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-secondary mb-8">
                      <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-sm border border-blue-100 shadow-sm text-blue-600">
                        <MapPin className="w-4 h-4" /> {session.location}
                      </span>
                      <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-sm border border-blue-100 shadow-sm text-purple-600">
                        <Clock className="w-4 h-4" /> 
                        {new Date(session.start_time).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    
                    {/* Value Proposition Features */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="flex items-start gap-3 bg-white/60 backdrop-blur-sm p-4 rounded-sm border border-blue-100">
                        <Cloud className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-foreground">Core Architecture</p>
                          <p className="text-[10px] text-secondary font-medium mt-0.5">Master EC2, S3, & VPCs</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 bg-white/60 backdrop-blur-sm p-4 rounded-sm border border-blue-100">
                        <ShieldCheck className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-foreground">Official Credentials</p>
                          <p className="text-[10px] text-secondary font-medium mt-0.5">Verifiable attendance tracking</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 bg-white/60 backdrop-blur-sm p-4 rounded-sm border border-blue-100 sm:col-span-2">
                        <Code className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-foreground">Project-Based Learning</p>
                          <p className="text-[10px] text-secondary font-medium mt-0.5">Deploy Next.js applications directly to enterprise AWS infrastructure.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Content: Action Panel */}
                  <div className="w-full sm:w-64 flex-shrink-0 flex flex-col h-full pt-4 sm:pt-0">
                    <div className={`p-5 border-2 rounded-sm flex flex-col justify-center items-center text-center mb-6 ${hasCheckedIn ? 'bg-green-50 border-green-200' : 'bg-white border-amber-200 shadow-sm'}`}>
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-3">Status</h4>
                      {hasCheckedIn ? (
                        <div className="flex flex-col items-center gap-2 text-green-700 font-bold text-sm">
                          <CheckCircle2 className="w-8 h-8 text-green-500" />
                          Check-in Successful
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-amber-600 font-bold text-sm">
                          <AlertCircle className="w-8 h-8 text-amber-500" />
                          Pending Check-in
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col justify-end flex-grow gap-4">
                      {hasCheckedIn ? (
                        <>
                          <div className="w-full bg-green-600/10 text-green-700 font-bold text-xs px-4 py-3 rounded-sm border border-green-200 text-center">
                            Your cryptographic credential is secure in the database.
                          </div>
                          
                          {/* Re-join button if they are checked in but still need access */}
                          {session.is_online_enabled && session.meeting_link && (
                            <button 
                              onClick={handleOnlineJoin}
                              className="w-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors font-bold text-xs px-6 py-3 rounded-sm border border-blue-200 flex items-center justify-center gap-2 shadow-sm mt-4"
                            >
                              <Video className="w-4 h-4" />
                              Re-join Meeting
                            </button>
                          )}
                        </>
                      ) : (
                        <>
                          <Link 
                            href="/dashboard/scan"
                            className="w-full bg-primary hover:bg-foreground transition-colors text-white font-bold text-sm px-6 py-3.5 rounded-sm shadow-md flex items-center justify-center gap-2 group"
                          >
                            <QrCode className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            Scan QR Code
                          </Link>
                          
                          {/* Online Attendance Notice Panel - Enhanced */}
                          <div className="w-full bg-blue-50/80 border border-blue-200 rounded-sm p-5 text-center shadow-sm relative overflow-hidden mt-2">
                            <h4 className="text-sm font-bold text-blue-900 mb-2 flex items-center justify-center gap-2">
                              <Wifi className="w-4 h-4 text-blue-600" /> Want to Attend Online?
                            </h4>
                            
                            {session.is_online_enabled && session.meeting_link ? (
                              <>
                                <p className="text-xs text-blue-800/80 mb-4 leading-tight">Virtual check-in is now open.</p>
                                <button 
                                  onClick={handleOnlineJoin}
                                  disabled={isJoining}
                                  className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white font-bold text-sm px-4 py-3 rounded-sm shadow-md flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                  <Video className="w-4 h-4" />
                                  {isJoining ? 'Logging...' : 'Join Here!'}
                                </button>
                              </>
                            ) : (
                              <>
                                <p className="text-xs text-blue-800/80 mb-4 leading-tight">The meeting link has not been published yet.</p>
                                <span className="inline-block bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm border border-blue-200">
                                  Waiting for Admin
                                </span>
                              </>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  
                </div>
              </section>
            ) : (
              <section className="bg-white border-2 border-dashed border-border rounded-sm shadow-sm p-12 flex flex-col items-center justify-center h-[400px]">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-border">
                  <Calendar className="w-8 h-8 text-secondary/50" />
                </div>
                <h2 className="text-sm font-bold text-secondary uppercase tracking-widest mb-2">No active sessions mapped</h2>
                <p className="text-xs text-secondary max-w-sm text-center">The system is waiting for the administrator to deploy the next workshop session. It will appear here automatically.</p>
              </section>
            )}

            {/* Program Benefits / Certifications Section */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border-2 border-border p-5 rounded-sm shadow-sm flex flex-col items-start hover:border-blue-300 transition-colors group">
                <div className="w-8 h-8 rounded-sm bg-blue-50 border border-blue-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Award className="w-4 h-4 text-blue-600" />
                </div>
                <h4 className="text-sm font-bold text-foreground mb-1">Free Certification</h4>
                <p className="text-xs text-secondary leading-relaxed">Earn a verifiable joint certificate from GenXCode and AWS upon successful check-in and completion.</p>
              </div>
              
              <div className="bg-white border-2 border-border p-5 rounded-sm shadow-sm flex flex-col items-start hover:border-purple-300 transition-colors group">
                <div className="w-8 h-8 rounded-sm bg-purple-50 border border-purple-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Gift className="w-4 h-4 text-purple-600" />
                </div>
                <h4 className="text-sm font-bold text-foreground mb-1">Cloud Credits</h4>
                <p className="text-xs text-secondary leading-relaxed">Gain access to AWS promotional credits to deploy, host, and scale your personal student projects.</p>
              </div>

              <div className="bg-white border-2 border-border p-5 rounded-sm shadow-sm flex flex-col items-start hover:border-green-300 transition-colors group">
                <div className="w-8 h-8 rounded-sm bg-green-50 border border-green-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Users className="w-4 h-4 text-green-600" />
                </div>
                <h4 className="text-sm font-bold text-foreground mb-1">Expert Mentorship</h4>
                <p className="text-xs text-secondary leading-relaxed">Join a private community of builders with direct Q&A access to industry cloud architects.</p>
              </div>
            </section>

          </div>

          {/* Side Column (Right) */}
          <div className="space-y-6">
            
            {/* Attendance & Telemetry History */}
            <section className="bg-white border-2 border-border rounded-sm shadow-sm overflow-hidden flex flex-col max-h-[400px] lg:max-h-[600px] h-full">
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
                          LOGGED: {new Date(record.checked_in_at).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: '2-digit', year: 'numeric' })} @ {new Date(record.checked_in_at).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' })}
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