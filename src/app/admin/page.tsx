'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Activity, Users, QrCode, LogOut, ArrowRightLeft, ShieldCheck, User, Link as LinkIcon, Video, Lock, Unlock } from 'lucide-react'

type CheckInRecord = {
  id: string
  checked_in_at: string
  profiles: { full_name: string; student_id: string }
  sessions: { title: string }
}

type UserProfile = {
  id: string
  full_name: string
  student_id: string
  phone: string
  role: string
}

type Session = {
  id: string
  title: string
  qr_payload: string
  meeting_link?: string
  is_online_enabled?: boolean
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'telemetry' | 'users' | 'projection'>('telemetry')
  
  const [checkIns, setCheckIns] = useState<CheckInRecord[]>([])
  const [users, setUsers] = useState<UserProfile[]>([])
  const [activeSession, setActiveSession] = useState<Session | null>(null)
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUpdatingSession, setIsUpdatingSession] = useState(false)
  const [meetingLinkInput, setMeetingLinkInput] = useState('')
  
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function fetchAdminData(showLoadingIndicator = true) {
      if (showLoadingIndicator) setLoading(true)

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/login')

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'admin') {
        setError("Unauthorized access. Administrator privileges required.")
        setLoading(false)
        return
      }

      const { data: allUsers } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (allUsers) setUsers(allUsers as UserProfile[])

      const { data: recentCheckIns } = await supabase
        .from('check_ins')
        .select(`
          id,
          checked_in_at,
          profiles ( full_name, student_id ),
          sessions ( title )
        `)
        .order('checked_in_at', { ascending: false })

      if (recentCheckIns) setCheckIns(recentCheckIns as unknown as CheckInRecord[])

      const { data: sessionData } = await supabase
        .from('sessions')
        .select('id, title, qr_payload, meeting_link, is_online_enabled')
        .limit(1)
        .maybeSingle()

      if (sessionData) {
        setActiveSession(sessionData)
        if (sessionData.meeting_link) setMeetingLinkInput(sessionData.meeting_link)
      }

      if (showLoadingIndicator) setLoading(false)
    }

    // Initial Load
    fetchAdminData()

    // Real-time Database Subscription
    const channel = supabase.channel('admin_telemetry_stream')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'check_ins' },
        () => {
          fetchAdminData(false)
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        () => {
          fetchAdminData(false)
        }
      )
      .subscribe()

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel)
    }
  }, [router, supabase])

  const toggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'student' : 'admin'
    
    // Optimistic Update
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u))

    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId)

    if (error) {
      alert("Failed to update role.")
      setUsers(users.map(u => u.id === userId ? { ...u, role: currentRole } : u))
    }
  }

  const updateSessionOnlineAccess = async (isEnabled: boolean) => {
    if (!activeSession) return
    setIsUpdatingSession(true)

    const payload = {
      is_online_enabled: isEnabled,
      meeting_link: meetingLinkInput.trim()
    }

    const { error } = await supabase
      .from('sessions')
      .update(payload)
      .eq('id', activeSession.id)

    if (!error) {
      setActiveSession({ ...activeSession, ...payload })
    } else {
      alert("Failed to update session online access.")
    }
    
    setIsUpdatingSession(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return <div className="p-8 text-sm text-secondary">Loading admin panel...</div>
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="border border-red-200 bg-red-50 p-6 rounded-sm max-w-md shadow-sm">
          <h2 className="text-lg font-bold text-red-700 mb-2">Access Denied</h2>
          <p className="text-sm text-red-600 mb-6">{error}</p>
          <button 
            onClick={() => router.push('/dashboard')}
            className="w-full px-4 py-2.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-sm text-sm font-bold transition-colors border border-red-200"
          >
            Return to Portal
          </button>
        </div>
      </div>
    )
  }

  const totalRegistered = users.filter(u => u.role === 'student').length
  const attendanceRate = totalRegistered > 0 ? Math.round((checkIns.length / totalRegistered) * 100) : 0

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-12">
      
      {/* Navigation */}
      <nav className="bg-white border-b sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-foreground">Admin Panel</span>
            <span className="px-2 py-0.5 rounded-sm bg-gray-100 text-secondary text-[10px] font-bold uppercase tracking-widest border border-border">
              GenXCode
            </span>
          </div>
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-2 text-sm font-medium text-secondary bg-white border border-border px-3 py-1.5 rounded-sm hover:bg-gray-50 hover:text-foreground transition-all shadow-sm active:scale-95"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-1">Dashboard</h1>
          <p className="text-sm text-secondary font-medium">Manage registrations and view session attendance.</p>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-border p-6 rounded-sm shadow-sm relative overflow-hidden">
            <p className="text-xs text-secondary font-bold uppercase tracking-wider mb-1">Registered Students</p>
            <p className="text-3xl font-black text-foreground">{totalRegistered}</p>
          </div>
          <div className="bg-white border border-border p-6 rounded-sm shadow-sm relative overflow-hidden">
            <p className="text-xs text-secondary font-bold uppercase tracking-wider mb-1">Total Checked In</p>
            <p className="text-3xl font-black text-foreground">{checkIns.length}</p>
            {/* Live Indicator pulse */}
            <div className="absolute top-6 right-6 w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          </div>
          <div className="bg-white border border-border p-6 rounded-sm shadow-sm relative overflow-hidden">
            <p className="text-xs text-secondary font-bold uppercase tracking-wider mb-1">Attendance Rate</p>
            <p className="text-3xl font-black text-foreground">{attendanceRate}%</p>
          </div>
        </div>

        {/* Crafted Segmented Tabs */}
        <div className="flex items-center gap-2 bg-gray-100/70 p-1.5 rounded-sm border border-border mb-6 overflow-x-auto hide-scrollbar w-fit shadow-inner">
          <button 
            onClick={() => setActiveTab('telemetry')}
            className={`flex items-center gap-2 px-5 py-2 rounded-sm font-bold text-sm whitespace-nowrap transition-all duration-200 ${
              activeTab === 'telemetry' 
                ? 'bg-white text-primary shadow-sm ring-1 ring-border' 
                : 'text-secondary hover:text-foreground hover:bg-white/50'
            }`}
          >
            <Activity className="w-4 h-4" /> Check-ins
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-5 py-2 rounded-sm font-bold text-sm whitespace-nowrap transition-all duration-200 ${
              activeTab === 'users' 
                ? 'bg-white text-primary shadow-sm ring-1 ring-border' 
                : 'text-secondary hover:text-foreground hover:bg-white/50'
            }`}
          >
            <Users className="w-4 h-4" /> Directory
          </button>
          <button 
            onClick={() => setActiveTab('projection')}
            className={`flex items-center gap-2 px-5 py-2 rounded-sm font-bold text-sm whitespace-nowrap transition-all duration-200 ${
              activeTab === 'projection' 
                ? 'bg-white text-primary shadow-sm ring-1 ring-border' 
                : 'text-secondary hover:text-foreground hover:bg-white/50'
            }`}
          >
            <QrCode className="w-4 h-4" /> Projection & Meeting
          </button>
        </div>

        {/* TAB: CHECK-INS */}
        {activeTab === 'telemetry' && (
          <section className="bg-white border border-border rounded-sm shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-[11px] text-secondary uppercase tracking-widest bg-gray-50 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 font-bold">Student Name</th>
                    <th className="px-6 py-4 font-bold">ID</th>
                    <th className="px-6 py-4 font-bold">Session</th>
                    <th className="px-6 py-4 font-bold text-right">Exact Time (IST)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {checkIns.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-secondary font-medium">
                        No records found.
                      </td>
                    </tr>
                  ) : (
                    checkIns.map((record) => {
                      const dateObj = new Date(record.checked_in_at);
                      
                      const timeString = dateObj.toLocaleTimeString('en-IN', { 
                        timeZone: 'Asia/Kolkata',
                        hour: '2-digit', 
                        minute: '2-digit', 
                        second: '2-digit', 
                        hour12: true 
                      });
                      
                      const dateString = dateObj.toLocaleDateString('en-IN', { 
                        timeZone: 'Asia/Kolkata',
                        day: '2-digit', 
                        month: 'short', 
                        year: 'numeric' 
                      });

                      return (
                        <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 font-bold text-foreground">
                            {record.profiles.full_name}
                          </td>
                          <td className="px-6 py-4 text-secondary font-mono text-xs font-medium">
                            {record.profiles.student_id}
                          </td>
                          <td className="px-6 py-4">
                            <span className="bg-gray-100 text-secondary px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider border border-border">
                              {record.sessions.title}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-secondary font-mono text-xs font-medium text-right">
                            <span className="text-foreground">
                              {timeString}
                            </span>
                            <br />
                            <span className="text-[10px] text-secondary">
                              {dateString}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* TAB: DIRECTORY */}
        {activeTab === 'users' && (
          <section className="bg-white border border-border rounded-sm shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-[11px] text-secondary uppercase tracking-widest bg-gray-50 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 font-bold">Name</th>
                    <th className="px-6 py-4 font-bold">ID</th>
                    <th className="px-6 py-4 font-bold">Phone</th>
                    <th className="px-6 py-4 font-bold">Role</th>
                    <th className="px-6 py-4 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-foreground flex items-center gap-2">
                        {u.full_name}
                      </td>
                      <td className="px-6 py-4 text-secondary font-mono text-xs font-medium">{u.student_id}</td>
                      <td className="px-6 py-4 text-secondary font-mono text-xs font-medium">{u.phone || '—'}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider border ${
                          u.role === 'admin' 
                            ? 'bg-red-50 text-red-700 border-red-200' 
                            : 'bg-gray-100 text-secondary border-border'
                        }`}>
                          {u.role === 'admin' ? <ShieldCheck className="w-3 h-3" /> : <User className="w-3 h-3" />}
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right flex justify-end">
                        <button 
                          onClick={() => toggleRole(u.id, u.role)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-sm border transition-all active:scale-95 shadow-sm ${
                            u.role === 'admin' 
                              ? 'bg-white text-secondary border-border hover:bg-gray-50 hover:text-foreground' 
                              : 'bg-white text-secondary border-border hover:bg-primary/5 hover:text-primary hover:border-primary/30'
                          }`}
                        >
                          <ArrowRightLeft className="w-3 h-3" />
                          Make {u.role === 'admin' ? 'Student' : 'Admin'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* TAB: PROJECTION & MEETING */}
        {activeTab === 'projection' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left: Universal QR Projection */}
            <section className="bg-white border border-border rounded-sm shadow-sm flex flex-col items-center justify-center p-8 min-h-[450px]">
              {activeSession ? (
                <div className="text-center w-full max-w-sm">
                  <h2 className="text-2xl font-bold text-foreground mb-1">Scan to Check-in</h2>
                  <p className="text-sm text-secondary font-medium mb-8">{activeSession.title}</p>
                  
                  <div className="bg-white p-4 border-2 border-border rounded-sm shadow-md inline-block mx-auto mb-6">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(activeSession.qr_payload)}&color=000000&bgcolor=FFFFFF&margin=0`} 
                      alt="Session QR Code" 
                      className="w-56 h-56 object-contain"
                    />
                  </div>
                  
                  <p className="text-xs font-mono font-medium text-secondary">
                    Data: {activeSession.qr_payload}
                  </p>
                </div>
              ) : (
                <div className="text-center text-secondary">
                  <p className="text-sm font-medium">No active session available to display.</p>
                </div>
              )}
            </section>

            {/* Right: Online Meeting Control Panel */}
            <section className="bg-white border border-border rounded-sm shadow-sm p-8 flex flex-col h-full">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2 mb-1">
                <Video className="w-5 h-5 text-blue-500" /> Meeting Control
              </h3>
              <p className="text-sm text-secondary font-medium mb-8 border-b border-border pb-4">
                Publish a meeting link to allow remote students to check-in virtually.
              </p>

              {activeSession ? (
                <div className="flex flex-col flex-grow">
                  
                  {/* Link Input Box */}
                  <div className="mb-6">
                    <label className="block text-xs font-bold text-foreground uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <LinkIcon className="w-3.5 h-3.5 text-secondary" /> Virtual Meeting URL
                    </label>
                    <input 
                      type="url" 
                      value={meetingLinkInput}
                      onChange={(e) => setMeetingLinkInput(e.target.value)}
                      placeholder="https://meet.google.com/xxx-xxxx-xxx"
                      className="w-full px-4 py-3 bg-gray-50 border border-border rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors font-mono"
                    />
                  </div>

                  {/* Toggle Controls */}
                  <div className="mt-auto space-y-3">
                    <div className={`p-4 border rounded-sm shadow-sm flex items-center justify-between mb-4 ${activeSession.is_online_enabled ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-border'}`}>
                      <div>
                        <p className={`text-sm font-bold ${activeSession.is_online_enabled ? 'text-green-800' : 'text-foreground'}`}>
                          {activeSession.is_online_enabled ? 'Online Access is LIVE' : 'Online Access is Locked'}
                        </p>
                        <p className={`text-xs mt-0.5 ${activeSession.is_online_enabled ? 'text-green-600' : 'text-secondary'}`}>
                          {activeSession.is_online_enabled ? 'Students can currently join and check-in remotely.' : 'Students cannot see the meeting link.'}
                        </p>
                      </div>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${activeSession.is_online_enabled ? 'bg-green-100 border-green-200 text-green-600' : 'bg-gray-200 border-border text-secondary'}`}>
                        {activeSession.is_online_enabled ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => updateSessionOnlineAccess(false)}
                        disabled={isUpdatingSession || !activeSession.is_online_enabled}
                        className="w-full bg-white border border-border hover:bg-gray-50 text-secondary hover:text-foreground font-bold text-sm px-4 py-3 rounded-sm shadow-sm transition-all disabled:opacity-50"
                      >
                        Lock Access
                      </button>
                      <button 
                        onClick={() => updateSessionOnlineAccess(true)}
                        disabled={isUpdatingSession || !meetingLinkInput || activeSession.is_online_enabled}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-4 py-3 rounded-sm shadow-sm transition-all disabled:opacity-50 disabled:bg-blue-400"
                      >
                        Publish Link
                      </button>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="flex-grow flex items-center justify-center text-center">
                  <p className="text-sm text-secondary font-medium">Create a session first to enable online controls.</p>
                </div>
              )}
            </section>

          </div>
        )}

      </main>
    </div>
  )
}