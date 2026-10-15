'use client'

import Link from 'next/link'
import { LayoutTemplate, Server, ShieldCheck, ExternalLink, Heart, PartyPopper, CheckCircle2 } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col selection:bg-primary/20 selection:text-primary relative overflow-hidden w-full max-w-[100vw]">
      
      {/* Engineered Grid Background */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-40"></div>

      {/* Minimal Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-20 w-full">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-primary">GenXCode</span>
            <span className="text-border text-lg hidden sm:inline-block">|</span>
            <span className="text-xs sm:text-sm font-medium tracking-wide text-secondary hidden sm:inline-block uppercase">
              JSPM University
            </span>
          </div>
          <span className="text-xs sm:text-sm font-bold border border-gray-200 bg-gray-50 text-secondary px-4 sm:px-5 py-2 sm:py-2.5 rounded-sm shadow-sm whitespace-nowrap cursor-not-allowed uppercase tracking-wider">
            Portal Closed
          </span>
        </div>
      </nav>

      {/* Two-Column Hero Section */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 sm:py-16 md:py-24 z-0 flex flex-col md:grid md:grid-cols-2 gap-10 lg:gap-12 items-center overflow-x-hidden">
        
        {/* Left Column: Celebration Typography */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left w-full relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-sm border border-green-300 bg-green-50 text-green-700 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-6 md:mb-8 shadow-sm backdrop-blur-sm">
            <PartyPopper className="w-4 h-4" />
            Event Concluded Successfully
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-4 md:mb-6 text-foreground leading-[1.15] tracking-tight">
            Thank You, <br className="hidden sm:block" />
            <span className="text-primary">JSPM University!</span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-foreground/80 mb-8 md:mb-10 leading-relaxed font-medium max-w-xs sm:max-w-xl mx-auto md:mx-0">
            The AWS Cloud Architecture Masterclass was <strong>super amazing!</strong> A massive and heartfelt thank you to all the incredible <span className="text-primary font-bold">Students, Faculty Members, Dean, Director</span>, and the dedicated <span className="text-primary font-bold">GenXCode Members</span> who made this event a monumental success.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button 
              disabled
              className="inline-flex items-center justify-center px-8 py-4 bg-gray-100 text-gray-500 border-2 border-border rounded-sm text-base md:text-lg font-bold w-full sm:w-auto cursor-not-allowed uppercase tracking-widest shadow-sm"
            >
              Registrations Closed
            </button>
          </div>
        </div>

        {/* Right Column: Abstract Engineering Visual (Shutdown Sequence) */}
        <div className="relative w-full max-w-[90%] sm:max-w-sm md:max-w-md mx-auto md:ml-auto mt-8 md:mt-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] md:w-[350px] h-[250px] md:h-[350px] bg-green-400/10 blur-[60px] md:blur-[80px] rounded-full"></div>
          
          <div className="relative border-2 border-border bg-white/60 backdrop-blur-md p-4 md:p-6 shadow-xl rounded-sm transform md:rotate-1 hover:rotate-0 transition-transform duration-500 w-full overflow-hidden">
            <div className="flex gap-2 mb-4 md:mb-6 border-b border-border pb-3 md:pb-4">
              <div className="w-2.5 md:w-3 h-2.5 md:h-3 rounded-full bg-red-400"></div>
              <div className="w-2.5 md:w-3 h-2.5 md:h-3 rounded-full bg-yellow-400"></div>
              <div className="w-2.5 md:w-3 h-2.5 md:h-3 rounded-full bg-green-400"></div>
            </div>
            
            <div className="font-mono space-y-4">
              <div className="text-[11px] md:text-sm font-bold text-primary flex items-center gap-2 break-words">
                <span className="text-secondary">$</span> genxcode workshop --status
              </div>
              
              <div className="bg-foreground text-primary-foreground p-3 md:p-4 rounded-sm text-[10px] md:text-xs leading-loose shadow-inner w-full break-all sm:break-normal whitespace-pre-wrap">
                &gt; Gracefully shutting down...<br/>
                &gt; Event Status: <span className="text-green-400 font-bold">SUPER AMAZING!</span><br/>
                &gt; Exporting telemetry logs... Done.<br/>
                &gt; <span className="text-primary/80">Thank you JSPM University.</span><br/>
                &gt; Connection closed.
              </div>

              <div className="flex gap-2 sm:gap-3 md:gap-4 mt-4 md:mt-6 w-full">
                <div className="h-16 md:h-20 flex-1 border-2 border-green-500 bg-green-50 flex flex-col items-center justify-center rounded-sm min-w-0">
                  <span className="text-[9px] md:text-xs text-green-700 font-bold uppercase tracking-wider mb-1 text-center px-1 truncate w-full flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Mission
                  </span>
                  <span className="text-[10px] text-green-600 font-medium">Accomplished</span>
                </div>
                <div className="h-16 md:h-20 flex-1 border border-border bg-gray-50 flex flex-col items-center justify-center rounded-sm relative overflow-hidden min-w-0">
                  <span className="text-[9px] md:text-xs text-secondary font-bold uppercase tracking-wider mb-1 text-center px-1 truncate w-full">Systems</span>
                  <span className="text-[10px] text-secondary font-medium">Offline</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Workshop Deliverables Grid (Retained as a memory/recap) */}
      <section className="border-t bg-white/90 backdrop-blur-sm w-full relative z-10">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16 md:py-24">
          <div className="mb-12 md:mb-16 md:flex justify-between items-end">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">What We Achieved</h2>
              <div className="w-16 md:w-20 h-1 bg-primary rounded-full"></div>
            </div>
            <p className="text-secondary font-medium mt-4 md:mt-0 max-w-sm text-sm">
              Looking back at the three core modules we tackled together during this incredible production-ready cloud deployment journey.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <div className="p-6 md:p-8 bg-white border-2 border-border hover:border-primary transition-all duration-300 rounded-sm shadow-sm hover:shadow-xl hover:-translate-y-1 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 bg-primary/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>
              <LayoutTemplate className="w-8 md:w-10 h-8 md:h-10 text-primary mb-5 md:mb-6 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
              <h3 className="text-xl md:text-2xl text-foreground font-bold mb-3">01. Architecture</h3>
              <p className="text-secondary font-medium leading-relaxed text-sm md:text-base">
                We understood the core mechanics of AWS, successfully breaking down EC2, S3, and VPCs without the fluff.
              </p>
            </div>
            
            <div className="p-6 md:p-8 bg-white border-2 border-border hover:border-primary transition-all duration-300 rounded-sm shadow-sm hover:shadow-xl hover:-translate-y-1 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 bg-primary/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>
              <Server className="w-8 md:w-10 h-8 md:h-10 text-primary mb-5 md:mb-6 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
              <h3 className="text-xl md:text-2xl text-foreground font-bold mb-3">02. Infrastructure</h3>
              <p className="text-secondary font-medium leading-relaxed text-sm md:text-base">
                Students learned how to deploy scalable Next.js and backend applications to the cloud efficiently.
              </p>
            </div>
            
            <div className="p-6 md:p-8 bg-white border-2 border-border hover:border-primary transition-all duration-300 rounded-sm shadow-sm hover:shadow-xl hover:-translate-y-1 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 bg-primary/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>
              <ShieldCheck className="w-8 md:w-10 h-8 md:h-10 text-primary mb-5 md:mb-6 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
              <h3 className="text-xl md:text-2xl text-foreground font-bold mb-3">03. Certification</h3>
              <p className="text-secondary font-medium leading-relaxed text-sm md:text-base">
                The universal QR Check-in system successfully tracked attendance, securing everyone's verifiable credentials.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-10 md:py-12 bg-foreground text-primary-foreground w-full">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid md:grid-cols-2 gap-8 items-center border-b border-primary-foreground/10 pb-8 mb-8">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">GenXCode</h3>
              <p className="text-sm text-primary-foreground/70 font-medium">
                Engineered by Cosmolix Private Limited for JSPM University.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-end gap-x-4 gap-y-2">
              <a href="https://cosmolix.co.in" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-foreground/80 hover:text-white transition-colors">
                Cosmolix <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <span className="hidden sm:inline-block text-primary-foreground/30">•</span>
              <a href="https://genxcode.cosmolix.co.in" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-foreground/80 hover:text-white transition-colors">
                GenXCode Main <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <span className="hidden lg:inline-block text-primary-foreground/30">•</span>
              <a href="https://developersfund.cosmolix.co.in/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-foreground/80 hover:text-white transition-colors">
                Developers Fund <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <p className="text-[10px] sm:text-xs text-primary-foreground/50 uppercase tracking-widest font-semibold max-w-[280px] sm:max-w-none mx-auto md:mx-0">
              © 2026 Cosmo Group of Industries Cosmolix and GenXCode.
            </p>
            <p className="text-xs text-primary-foreground/70 uppercase tracking-widest font-semibold flex items-center gap-2 justify-center">
              Special Thanks To <Heart className="w-3 h-3 text-primary" fill="currentColor" /> <span className="text-white">JSPM University</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}