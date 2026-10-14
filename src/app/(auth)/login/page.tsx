'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, User, Hash, ArrowRight, Loader2, Server, Phone, Cloud, Cpu, Database, Terminal, Eye, EyeOff } from 'lucide-react'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [studentId, setStudentId] = useState('')
  const [phone, setPhone] = useState('')
  
  const [showPassword, setShowPassword] = useState(false)
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  const router = useRouter()
  const supabase = createClient()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      if (isLogin) {
        // --- LOGIN FLOW ---
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        
        if (signInError) throw signInError

        // refresh() instantly updates server components with the new session
        router.refresh() 
        router.push('/dashboard')

      } else {
        // --- REGISTRATION FLOW ---
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        })

        if (signUpError) throw signUpError

        if (authData.user) {
          // Immediately create the user's profile record
          const { error: profileError } = await supabase.from('profiles').insert({
            id: authData.user.id,
            full_name: `${firstName} ${lastName}`.trim(),
            student_id: studentId,
            phone: phone,
          })

          if (profileError) throw profileError

          setSuccess('Registration successful! Launching your workspace...')
          
          setTimeout(() => {
            router.refresh()
            router.push('/dashboard')
          }, 1500)
        }
      }
    } catch (err) {
      setError((err as Error).message || 'An unexpected error occurred.')
    } finally {
      if (!success) setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-white selection:bg-primary/20 selection:text-primary w-full max-w-[100vw]">
      
      {/* ---------------- BACKGROUND & VISUALS ---------------- */}
      
      {/* Engineered Grid Background */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-40"></div>
      
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] bg-primary/10 blur-[80px] sm:blur-[100px] rounded-full pointer-events-none -z-10"></div>

      {/* Blueprint Corner Crosshairs (Desktop only) */}
      <div className="hidden lg:block absolute top-12 left-12 text-border font-mono text-xl pointer-events-none -z-10">+</div>
      <div className="hidden lg:block absolute top-12 right-12 text-border font-mono text-xl pointer-events-none -z-10">+</div>
      <div className="hidden lg:block absolute bottom-12 left-12 text-border font-mono text-xl pointer-events-none -z-10">+</div>
      <div className="hidden lg:block absolute bottom-12 right-12 text-border font-mono text-xl pointer-events-none -z-10">+</div>

      {/* Left Abstract Visual: Architecture Flow */}
      <div className="hidden lg:flex flex-col items-center absolute left-16 xl:left-32 top-1/2 -translate-y-1/2 pointer-events-none -z-10 opacity-70">
        <div className="flex flex-col items-center gap-2">
          <div className="w-14 h-14 border-2 border-primary/30 rounded-sm flex items-center justify-center bg-white shadow-sm text-primary">
            <Cloud strokeWidth={1.5} />
          </div>
          <div className="h-10 border-l-2 border-dashed border-primary/30"></div>
          <div className="w-14 h-14 border-2 border-primary/30 rounded-sm flex items-center justify-center bg-white shadow-sm text-primary">
            <Cpu strokeWidth={1.5} />
          </div>
          <div className="h-10 border-l-2 border-dashed border-primary/30"></div>
          <div className="w-14 h-14 border-2 border-border rounded-sm flex items-center justify-center bg-gray-50 shadow-sm text-secondary">
            <Database strokeWidth={1.5} />
          </div>
        </div>
        <div className="mt-6 text-[10px] font-mono text-secondary uppercase tracking-widest border border-border px-3 py-1 rounded-sm bg-white/50">
          ap-south-1
        </div>
      </div>

      {/* Right Abstract Visual: Telemetry Terminal */}
      <div className="hidden lg:block absolute right-16 xl:right-32 top-1/2 -translate-y-1/2 pointer-events-none -z-10 w-64 opacity-80">
        <div className="border-2 border-border bg-white/60 backdrop-blur-md p-4 rounded-sm shadow-sm font-mono text-xs">
          <div className="flex justify-between items-center border-b border-border pb-3 mb-3">
            <span className="text-primary font-bold uppercase tracking-wider flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5" /> Auth_Sys
            </span>
            <span className="flex items-center gap-1.5 text-green-500 font-bold">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> OK
            </span>
          </div>
          <div className="space-y-2 text-secondary font-medium">
            <p>&gt; Connection established</p>
            <p className={loading ? "animate-pulse text-primary" : ""}>
              &gt; {loading ? "Awaiting handshake..." : "Standing by..."}
            </p>
            <p className="opacity-50">&gt; Node: auth.genxcode.run</p>
            
            <div className="w-full h-1.5 bg-border rounded-full mt-5 overflow-hidden">
              <div className={`h-full bg-primary transition-all duration-1000 ${loading ? 'w-2/3' : 'w-full'}`}></div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- MAIN AUTH FORM ---------------- */}

      {/* Back to Home Navigation */}
      <div className="absolute top-5 left-5 md:top-8 md:left-12 z-20">
        <Link href="/" className="text-sm font-bold text-primary tracking-tight hover:opacity-80 transition-opacity">
          GenXCode
        </Link>
      </div>

      <div className="w-full max-w-[92%] sm:max-w-md my-16 sm:my-12 z-10">
        {/* Crafted Auth Card */}
        <div className="bg-white/80 backdrop-blur-xl border-2 border-border shadow-2xl rounded-sm overflow-hidden relative">
          
          {/* Top Decorative Bar */}
          <div className="h-1.5 w-full bg-primary relative overflow-hidden">
            <div className="absolute inset-0 bg-white/20 w-1/3 animate-[translateX_2s_infinite]"></div>
          </div>

          <div className="p-6 sm:p-8 md:p-10">
            <div className="text-center mb-6 sm:mb-8">
              <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-sm bg-primary/10 border border-primary/20 mb-3 sm:mb-4">
                <Server className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <h2 className="text-2xl sm:text-3xl tracking-wide font-bold text-foreground mb-1 sm:mb-2">
                {isLogin ? 'WorkShop Login' : 'WorkShop Registration'}
              </h2>
              <p className="text-xs sm:text-sm text-primary font-bold px-2">
                {isLogin 
                  ? 'Welcome back! Ready to build the future?' 
                  : 'Join the GenXCode movement. Let\'s get started!'}
              </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-3 sm:space-y-4">
              
              {/* Registration Specific Fields */}
              {!isLogin && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] sm:text-xs font-bold text-secondary uppercase tracking-wider">First Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/70" />
                        <input
                          type="text"
                          required
                          className="flex h-10 sm:h-11 w-full rounded-sm border-2 border-border bg-white/50 pl-9 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary transition-colors"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="Pratham"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] sm:text-xs font-bold text-secondary uppercase tracking-wider">Last Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/70" />
                        <input
                          type="text"
                          required
                          className="flex h-10 sm:h-11 w-full rounded-sm border-2 border-border bg-white/50 pl-9 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary transition-colors"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Patil"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] sm:text-xs font-bold text-secondary uppercase tracking-wider">JSPM Student ID</label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/70" />
                      <input
                        type="text"
                        required
                        className="flex h-10 sm:h-11 w-full rounded-sm border-2 border-border bg-white/50 pl-9 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary transition-colors uppercase"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        placeholder="PRN or Roll No"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] sm:text-xs font-bold text-secondary uppercase tracking-wider">Mobile Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/70" />
                      <input
                        type="tel"
                        required
                        className="flex h-10 sm:h-11 w-full rounded-sm border-2 border-border bg-white/50 pl-9 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary transition-colors"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Shared Fields (Always shown for Login) */}
              <div className="space-y-1">
                <label className="text-[10px] sm:text-xs font-bold text-secondary uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/70" />
                  <input
                    type="email"
                    required
                    className="flex h-10 sm:h-11 w-full rounded-sm border-2 border-border bg-white/50 pl-9 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary transition-colors"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourmail@gmail.com"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] sm:text-xs font-bold text-secondary uppercase tracking-wider">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/70" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    className="flex h-10 sm:h-11 w-full rounded-sm border-2 border-border bg-white/50 pl-9 pr-10 py-2 text-sm focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary transition-colors"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary/70 hover:text-foreground transition-colors focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* System Messages */}
              {error && (
                <div className="p-2 sm:p-3 border border-red-200 bg-red-50 text-red-600 text-[11px] sm:text-xs font-medium rounded-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="p-2 sm:p-3 border border-green-200 bg-green-50 text-green-700 text-[11px] sm:text-xs font-medium rounded-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0"></span>
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !!success}
                className="mt-4 sm:mt-2 group flex h-10 sm:h-11 w-full items-center justify-center gap-2 rounded-sm bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-foreground hover:text-white transition-all disabled:opacity-70 shadow-md z-10 relative overflow-hidden"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                  </>
                ) : (
                  <>
                    {isLogin ? 'Initialize Session' : 'Provision Account'} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-border text-center">
              <p className="text-xs sm:text-sm text-secondary">
                {isLogin ? "Don't have an account? " : "Already registered? "}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin)
                    setError(null)
                    setSuccess(null)
                    setShowPassword(false) // Reset password visibility on toggle
                  }}
                  className="font-bold text-primary hover:underline hover:text-foreground transition-colors ml-1"
                >
                  {isLogin ? 'Register here' : 'Sign in'}
                </button>
              </p>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  )
}