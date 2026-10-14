'use client'

import Link from 'next/link'
import { LayoutTemplate, Server, ShieldCheck, ExternalLink, Heart } from 'lucide-react'

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
          <Link 
            href="/login" 
            className="text-xs sm:text-sm font-semibold border-2 border-primary/20 text-primary px-4 sm:px-5 py-2 sm:py-2.5 rounded-sm hover:bg-primary hover:text-primary-foreground transition-all shadow-sm whitespace-nowrap"
          >
            Student Portal
          </Link>
        </div>
      </nav>

      {/* Two-Column Hero Section */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 sm:py-16 md:py-24 z-0 flex flex-col md:grid md:grid-cols-2 gap-10 lg:gap-12 items-center overflow-x-hidden">
        
        {/* Left Column: Typography & CTAs */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left w-full relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm border border-primary/30 bg-primary/5 text-primary text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-6 md:mb-8 shadow-sm backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Live Workshop Registration
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-4 md:mb-6 text-foreground leading-[1.15] tracking-tight">
            AWS Cloud <br className="hidden sm:block" /> Architecture <br />
            <span className="text-primary">Masterclass.</span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-foreground/80 mb-8 md:mb-10 leading-relaxed font-medium max-w-xs sm:max-w-lg mx-auto md:mx-0">
            An intensive, hands-on workshop engineered for B.Tech students. 
            Learn modern cloud infrastructure, serverless deployments, and enterprise architecture.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link 
              href="/login" 
              className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground rounded-sm text-base md:text-lg font-semibold hover:bg-foreground hover:text-white transition-colors shadow-md w-full sm:w-auto"
            >
              Access Workshop Portal
            </Link>
          </div>
        </div>

        {/* Right Column: Abstract Engineering Visual */}
        <div className="relative w-full max-w-[90%] sm:max-w-sm md:max-w-md mx-auto md:ml-auto mt-8 md:mt-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] md:w-[350px] h-[250px] md:h-[350px] bg-primary/10 blur-[60px] md:blur-[80px] rounded-full"></div>
          
          <div className="relative border-2 border-border bg-white/60 backdrop-blur-md p-4 md:p-6 shadow-xl rounded-sm transform md:rotate-1 hover:rotate-0 transition-transform duration-500 w-full overflow-hidden">
            <div className="flex gap-2 mb-4 md:mb-6 border-b border-border pb-3 md:pb-4">
              <div className="w-2.5 md:w-3 h-2.5 md:h-3 rounded-full bg-red-400"></div>
              <div className="w-2.5 md:w-3 h-2.5 md:h-3 rounded-full bg-yellow-400"></div>
              <div className="w-2.5 md:w-3 h-2.5 md:h-3 rounded-full bg-green-400"></div>
            </div>
            
            <div className="font-mono space-y-4">
              <div className="text-[11px] md:text-sm font-bold text-primary flex items-center gap-2 break-words">
                <span className="text-secondary">$</span> aws ec2 deploy --region ap-south-1
              </div>
              
              <div className="bg-foreground text-primary-foreground p-3 md:p-4 rounded-sm text-[10px] md:text-xs leading-loose shadow-inner w-full break-all sm:break-normal whitespace-pre-wrap">
                &gt; Initializing Cosmolix Build...<br/>
                &gt; Status: 100% (Systems Online)<br/>
                &gt; VPC: vpc-0a1b2c3d attached<br/>
                &gt; Cluster Health: OPTIMAL
              </div>

              <div className="flex gap-2 sm:gap-3 md:gap-4 mt-4 md:mt-6 w-full">
                <div className="h-16 md:h-20 flex-1 border border-border bg-gray-50 flex flex-col items-center justify-center rounded-sm min-w-0">
                  <span className="text-[9px] md:text-xs text-secondary uppercase tracking-wider mb-1 text-center px-1 truncate w-full">Load Balancer</span>
                  <div className="h-1 w-6 md:w-8 bg-secondary/30 rounded-full"></div>
                </div>
                <div className="h-16 md:h-20 flex-1 border-2 border-primary bg-primary/5 flex flex-col items-center justify-center rounded-sm relative overflow-hidden min-w-0">
                  <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
                  <span className="text-[9px] md:text-xs text-primary font-bold uppercase tracking-wider mb-1 text-center px-1 truncate w-full">Active Node</span>
                  <div className="h-1 w-6 md:w-8 bg-primary rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Workshop Deliverables Grid */}
      <section className="border-t bg-white/90 backdrop-blur-sm w-full relative z-10">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16 md:py-24">
          <div className="mb-12 md:mb-16 md:flex justify-between items-end">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">Workshop Deliverables</h2>
              <div className="w-16 md:w-20 h-1 bg-primary rounded-full"></div>
            </div>
            <p className="text-secondary font-medium mt-4 md:mt-0 max-w-sm text-sm">
              Three core modules designed to take you from foundational logic to production-ready cloud deployment.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <div className="p-6 md:p-8 bg-white border-2 border-border hover:border-primary transition-all duration-300 rounded-sm shadow-sm hover:shadow-xl hover:-translate-y-1 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 bg-primary/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>
              <LayoutTemplate className="w-8 md:w-10 h-8 md:h-10 text-primary mb-5 md:mb-6 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
              <h3 className="text-xl md:text-2xl text-foreground font-bold mb-3">01. Architecture</h3>
              <p className="text-secondary font-medium leading-relaxed text-sm md:text-base">
                Understand the core mechanics of AWS. We break down EC2, S3, and VPCs without the fluff.
              </p>
            </div>
            
            <div className="p-6 md:p-8 bg-white border-2 border-border hover:border-primary transition-all duration-300 rounded-sm shadow-sm hover:shadow-xl hover:-translate-y-1 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 bg-primary/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>
              <Server className="w-8 md:w-10 h-8 md:h-10 text-primary mb-5 md:mb-6 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
              <h3 className="text-xl md:text-2xl text-foreground font-bold mb-3">02. Infrastructure</h3>
              <p className="text-secondary font-medium leading-relaxed text-sm md:text-base">
                Learn how to deploy scalable Next.js and backend applications to the cloud efficiently.
              </p>
            </div>
            
            <div className="p-6 md:p-8 bg-white border-2 border-border hover:border-primary transition-all duration-300 rounded-sm shadow-sm hover:shadow-xl hover:-translate-y-1 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 bg-primary/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>
              <ShieldCheck className="w-8 md:w-10 h-8 md:h-10 text-primary mb-5 md:mb-6 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
              <h3 className="text-xl md:text-2xl text-foreground font-bold mb-3">03. Certification</h3>
              <p className="text-secondary font-medium leading-relaxed text-sm md:text-base">
                Universal QR Check-in system tracking your attendance for verifiable workshop credentials.
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