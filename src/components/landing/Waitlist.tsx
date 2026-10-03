'use client';

import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { trackEvent, RouteEvents, getEmailDomain } from '@/lib/analytics/route-analytics';
import { useSectionView } from '@/lib/analytics/use-section-view';



// Predefined star configurations for hydration safety
const STAR_CONFIGS = [
  { left: '5%', top: '10%', size: 1.5, duration: 2.5, delay: 0, opacity: 0.4 },
  { left: '15%', top: '25%', size: 1, duration: 3, delay: 0.5, opacity: 0.3 },
  { left: '25%', top: '8%', size: 2, duration: 2, delay: 1, opacity: 0.5 },
  { left: '35%', top: '40%', size: 1.2, duration: 3.5, delay: 0.2, opacity: 0.35 },
  { left: '45%', top: '15%', size: 1.8, duration: 2.8, delay: 0.8, opacity: 0.45 },
  { left: '55%', top: '30%', size: 1, duration: 2.2, delay: 1.2, opacity: 0.25 },
  { left: '65%', top: '12%', size: 1.5, duration: 3.2, delay: 0.3, opacity: 0.4 },
  { left: '75%', top: '45%', size: 1.3, duration: 2.6, delay: 0.6, opacity: 0.3 },
  { left: '85%', top: '20%', size: 2, duration: 2.4, delay: 1.5, opacity: 0.5 },
  { left: '95%', top: '35%', size: 1, duration: 3.8, delay: 0.1, opacity: 0.2 },
  { left: '8%', top: '60%', size: 1.4, duration: 2.9, delay: 0.9, opacity: 0.35 },
  { left: '18%', top: '75%', size: 1.1, duration: 2.3, delay: 0.4, opacity: 0.3 },
  { left: '28%', top: '55%', size: 1.6, duration: 3.3, delay: 1.1, opacity: 0.4 },
  { left: '38%', top: '80%', size: 1, duration: 2.7, delay: 0.7, opacity: 0.25 },
  { left: '48%', top: '65%', size: 1.9, duration: 2.1, delay: 1.3, opacity: 0.45 },
  { left: '58%', top: '85%', size: 1.2, duration: 3.6, delay: 0.2, opacity: 0.3 },
  { left: '68%', top: '70%', size: 1.5, duration: 2.5, delay: 0.5, opacity: 0.4 },
  { left: '78%', top: '90%', size: 1, duration: 3.1, delay: 1, opacity: 0.2 },
  { left: '88%', top: '68%', size: 1.7, duration: 2.8, delay: 0.6, opacity: 0.35 },
  { left: '92%', top: '82%', size: 1.3, duration: 2.4, delay: 1.4, opacity: 0.3 },
  { left: '12%', top: '45%', size: 1.4, duration: 3.4, delay: 0.8, opacity: 0.4 },
  { left: '22%', top: '5%', size: 1, duration: 2.6, delay: 0.3, opacity: 0.25 },
  { left: '32%', top: '50%', size: 1.8, duration: 2.2, delay: 1.2, opacity: 0.45 },
  { left: '42%', top: '88%', size: 1.1, duration: 3.7, delay: 0.4, opacity: 0.3 },
  { left: '52%', top: '5%', size: 1.5, duration: 2.8, delay: 0.9, opacity: 0.35 },
  { left: '62%', top: '52%', size: 2, duration: 2.3, delay: 1.5, opacity: 0.5 },
  { left: '72%', top: '8%', size: 1.2, duration: 3.5, delay: 0.1, opacity: 0.25 },
  { left: '82%', top: '58%', size: 1.6, duration: 2.9, delay: 0.7, opacity: 0.4 },
  { left: '3%', top: '82%', size: 1, duration: 3.2, delay: 1.1, opacity: 0.2 },
  { left: '13%', top: '92%', size: 1.3, duration: 2.5, delay: 0.5, opacity: 0.3 },
  { left: '23%', top: '35%', size: 1.7, duration: 2.7, delay: 0.2, opacity: 0.4 },
  { left: '33%', top: '95%', size: 1, duration: 3.9, delay: 1.3, opacity: 0.25 },
  { left: '43%', top: '22%', size: 1.4, duration: 2.4, delay: 0.6, opacity: 0.35 },
  { left: '53%', top: '78%', size: 1.9, duration: 3, delay: 0.8, opacity: 0.45 },
  { left: '63%', top: '28%', size: 1.1, duration: 2.6, delay: 1, opacity: 0.3 },
  { left: '73%', top: '62%', size: 1.5, duration: 3.3, delay: 0.4, opacity: 0.4 },
  { left: '83%', top: '48%', size: 1.2, duration: 2.1, delay: 1.2, opacity: 0.25 },
  { left: '93%', top: '5%', size: 1.6, duration: 2.8, delay: 0.7, opacity: 0.35 },
  { left: '7%', top: '38%', size: 1, duration: 3.5, delay: 0.3, opacity: 0.2 },
  { left: '17%', top: '68%', size: 1.8, duration: 2.3, delay: 0.9, opacity: 0.45 },
  { left: '27%', top: '18%', size: 1.3, duration: 3.1, delay: 1.4, opacity: 0.3 },
  { left: '37%', top: '72%', size: 1.5, duration: 2.7, delay: 0.5, opacity: 0.4 },
  { left: '47%', top: '28%', size: 1, duration: 3.6, delay: 0.2, opacity: 0.25 },
  { left: '57%', top: '95%', size: 1.7, duration: 2.5, delay: 1, opacity: 0.35 },
  { left: '67%', top: '38%', size: 1.2, duration: 2.9, delay: 0.6, opacity: 0.3 },
  { left: '77%', top: '15%', size: 1.4, duration: 3.4, delay: 1.1, opacity: 0.4 },
  { left: '87%', top: '75%', size: 1.1, duration: 2.2, delay: 0.8, opacity: 0.25 },
  { left: '97%', top: '52%', size: 1.6, duration: 3, delay: 0.4, opacity: 0.35 },
];

// Animated aurora/mesh gradient background component
function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Aurora gradient mesh - multiple overlapping animated blobs */}
      <div className="absolute inset-0">
        {/* Blob 1 - Top left, emerald */}
        <div 
          className="absolute w-[800px] h-[800px] rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(16,185,129,0.4) 0%, rgba(16,185,129,0.1) 40%, transparent 70%)',
            filter: 'blur(80px)',
            top: '10%',
            left: '10%',
            animation: 'aurora-1 25s ease-in-out infinite',
          }}
        />
        
        {/* Blob 2 - Bottom right, teal variant */}
        <div 
          className="absolute w-[600px] h-[600px] rounded-full opacity-25"
          style={{
            background: 'radial-gradient(circle, rgba(20,184,166,0.35) 0%, rgba(20,184,166,0.08) 40%, transparent 70%)',
            filter: 'blur(70px)',
            bottom: '20%',
            right: '10%',
            animation: 'aurora-2 20s ease-in-out infinite',
          }}
        />
        
        {/* Blob 3 - Center, lighter emerald */}
        <div 
          className="absolute w-[700px] h-[700px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(52,211,153,0.3) 0%, rgba(52,211,153,0.05) 40%, transparent 70%)',
            filter: 'blur(90px)',
            top: '40%',
            left: '30%',
            animation: 'aurora-3 30s ease-in-out infinite',
          }}
        />
        
        {/* Blob 4 - Top right, subtle */}
        <div 
          className="absolute w-[500px] h-[500px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(110,231,183,0.25) 0%, rgba(110,231,183,0.05) 40%, transparent 70%)',
            filter: 'blur(60px)',
            top: '20%',
            right: '20%',
            animation: 'aurora-4 22s ease-in-out infinite',
          }}
        />
      </div>

      {/* Animated mesh gradient overlay */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          background: `
            linear-gradient(125deg, rgba(16,185,129,0.08) 0%, transparent 50%),
            linear-gradient(215deg, rgba(20,184,166,0.06) 0%, transparent 50%),
            linear-gradient(305deg, rgba(52,211,153,0.05) 0%, transparent 50%)
          `,
          backgroundSize: '200% 200%',
          animation: 'mesh-shift 15s ease infinite',
        }}
      />
      
      {/* Twinkling stars */}
      {STAR_CONFIGS.map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white animate-pulse"
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}

      {/* Subtle noise texture for depth */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(16,185,129,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16,185,129,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  );
}

export function Waitlist() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const sectionRef = useSectionView('waitlist', 0.2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      
      // Track validation error
      trackEvent(RouteEvents.WAITLIST_ERROR, {
        error_type: 'validation',
        reason: 'invalid_email',
      });
      return;
    }

    setStatus('loading');
    
    // Track form submission
    const emailDomain = getEmailDomain(email);
    trackEvent(RouteEvents.WAITLIST_SUBMIT, {
      email_domain: emailDomain || 'unknown',
      source: 'waitlist_section',
    });

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json() as { message?: string; error?: string };

      if (response.ok) {
        setStatus('success');
        setMessage(data.message || "You're on the waitlist!");
        setEmail('');
        
        // Track successful submission
        trackEvent(RouteEvents.WAITLIST_SUCCESS, {
          email_domain: emailDomain || 'unknown',
          source: 'waitlist_section',
        });
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
        
        // Track API error
        trackEvent(RouteEvents.WAITLIST_ERROR, {
          error_type: 'api',
          reason: data.error || 'unknown_error',
        });
      }
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
      
      // Track network/submission error
      trackEvent(RouteEvents.WAITLIST_ERROR, {
        error_type: 'network',
        reason: 'submission_failed',
      });
    }
  };

  return (
    <section ref={sectionRef} id="waitlist" className="relative w-full min-h-screen bg-black flex items-center justify-center border-y border-white/[0.06] overflow-hidden">
      <AnimatedBackground />
      <div className="relative z-10 max-w-2xl mx-auto px-6 md:px-16">
        <div className="text-center mb-12">
          <p className="text-[10px] font-mono text-gray-600 uppercase tracking-[0.25em] mb-4">
            Coming Soon
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
            Be the first to know.
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Get notified the moment route launches. No spam, just one email when we&apos;re ready.
          </p>
        </div>

        {/* Input with connected button - styled as one unit but separate elements for accessibility */}
        <form 
          onSubmit={handleSubmit} 
          className="flex items-center border border-white/10 rounded-lg overflow-hidden bg-[#080808] max-w-md mx-auto"
          data-umami-event={RouteEvents.WAITLIST_SUBMIT}
        >
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading'}
            data-umami-event-input="email"
            className="flex-1 min-w-0 bg-transparent px-4 sm:px-5 py-3.5 sm:py-4 text-sm font-mono text-white placeholder-gray-600 outline-none border-none focus:ring-0 disabled:opacity-40"
          />
          {/* Mobile: Arrow button */}
          <button
            type="submit"
            disabled={status === 'loading'}
            data-umami-event={RouteEvents.WAITLIST_SUBMIT}
            data-umami-event-button="notify_me"
            className="sm:hidden flex-shrink-0 w-11 h-11 m-1 bg-white text-black rounded-md flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {status === 'loading' ? (
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle 
                  className="opacity-25" 
                  cx="12" cy="12" r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                />
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <ArrowRight className="w-5 h-5" />
            )}
          </button>
          {/* Desktop: Text button */}
          <button
            type="submit"
            disabled={status === 'loading'}
            data-umami-event={RouteEvents.WAITLIST_SUBMIT}
            data-umami-event-button="notify_me"
            className="hidden sm:flex relative flex-shrink-0 px-6 py-4 m-1 bg-white text-black text-xs font-mono font-bold uppercase tracking-widest hover:bg-gray-100 transition-all whitespace-nowrap rounded-md disabled:opacity-60 disabled:cursor-not-allowed items-center justify-center cursor-pointer"
          >
            {status === 'loading' ? (
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle 
                  className="opacity-25" 
                  cx="12" cy="12" r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                />
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              'Notify Me'
            )}
          </button>
        </form>

        {status === 'success' && (
          <p className="mt-4 text-sm text-emerald-500 text-center">
            {message}
          </p>
        )}
        {status === 'error' && (
          <p className="mt-4 text-sm text-rose-500 text-center">
            {message}
          </p>
        )}
        {status === 'idle' && (
          <p className="mt-4 text-[11px] font-mono text-gray-700 text-center">
            No spam. One email when we launch.
          </p>
        )}


      </div>
    </section>
  );
}
