'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Nav from '../../components/Nav'

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden>
    <path fill="#4285F4" d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/>
    <path fill="#34A853" d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.565 24 12.255 24z"/>
    <path fill="#FBBC05" d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 000 10.76l3.98-3.09z"/>
    <path fill="#EA4335" d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.69 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/>
  </svg>
)

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInInner />
    </Suspense>
  )
}

function SignInInner() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl  = searchParams.get('callbackUrl') || '/'
  const urlError     = searchParams.get('error')

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [gLoading, setGLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [error,    setError]    = useState(
    urlError === 'CredentialsSignin' ? 'Incorrect email or password.' : ''
  )

  const handleGoogle = async () => {
    setGLoading(true)
    setError('')
    await signIn('google', { callbackUrl })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) { setError('Please fill in all fields'); return }
    setError(''); setLoading(true)

    const res = await signIn('credentials', {
      email,
      password,
      action: 'login',
      redirect: false,
    })

    setLoading(false)

    if (res?.error) {
      setError('Incorrect email or password.')
    } else {
      // Admin redirect
      if (email === 'admin@museumofwoods.co') {
        router.push('/admin')
      } else {
        router.push(callbackUrl)
      }
    }
  }

  return (
    <>
      <Nav />
      <main className="min-h-screen flex" style={{ background: 'var(--bg-primary)', paddingTop: 'var(--nav-h)' }}>

        {/* Left panel */}
        <div className="hidden lg:flex flex-col justify-between w-[45%] relative overflow-hidden"
          style={{ background: '#0f1510' }}>
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, #0f1510 0%, #1a2318 50%, #2c3a28 100%)' }} />
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'repeating-linear-gradient(8deg, transparent, transparent 40px, rgba(201,162,126,0.3) 40px, rgba(201,162,126,0.3) 41px)' }} />
          <div className="relative z-10 p-12 flex flex-col h-full justify-between">
            <Link href="/">
              <img src="/images/logo.svg" alt="Museum of Woods" className="h-14 w-auto"
                style={{ filter: 'brightness(0) invert(1)', opacity: 0.9 }} />
            </Link>
            <div>
              <blockquote className="font-serif text-2xl leading-relaxed mb-4"
                style={{ color: 'rgba(245,242,236,0.9)', fontStyle: 'italic' }}>
                "Every piece carries the fingerprint of its maker and the memory of its owner."
              </blockquote>
              <p className="font-sans text-sm" style={{ color: 'rgba(245,242,236,0.4)' }}>— Museum of Woods</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                style={{ background: 'rgba(201,162,126,0.15)', border: '1px solid rgba(201,162,126,0.2)' }}>🌳</div>
              <div>
                <p className="font-sans text-xs font-medium" style={{ color: 'rgba(245,242,236,0.8)' }}>500+ Pieces crafted</p>
                <p className="font-sans text-[10px]" style={{ color: 'rgba(245,242,236,0.35)' }}>Laser-engraved worldwide since 2024</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: form */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <p className="font-sans text-[11px] tracking-[.3em] uppercase mb-2" style={{ color: 'var(--accent)' }}>Welcome back</p>
              <h1 className="font-serif text-4xl mb-2" style={{ color: 'var(--text-primary)' }}>Sign in</h1>
              <p className="font-sans text-sm" style={{ color: 'var(--text-subtle)' }}>
                New here?{' '}
                <Link href="/auth/signup" className="underline underline-offset-2" style={{ color: 'var(--accent)' }}>
                  Create an account
                </Link>
              </p>
            </div>

            {/* Google */}
            <button
              onClick={handleGoogle}
              disabled={gLoading}
              className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl font-sans text-sm font-medium transition-all hover:shadow-md mb-4 disabled:opacity-60"
              style={{ background: '#fff', color: '#1f1f1f', border: '1px solid #e0e0e0', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
            >
              {gLoading
                ? <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#4285F4" strokeWidth="3" strokeOpacity="0.3"/><path d="M12 2a10 10 0 0 1 10 10" stroke="#4285F4" strokeWidth="3" strokeLinecap="round"/></svg>
                : <GoogleIcon />}
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px" style={{ background: 'rgba(128,128,128,0.15)' }} />
              <span className="font-sans text-[11px]" style={{ color: 'var(--text-subtle)' }}>or sign in with email</span>
              <div className="flex-1 h-px" style={{ background: 'rgba(128,128,128,0.15)' }} />
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm mb-4"
                style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', color: '#dc2626' }}>
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-sans text-[11px] tracking-[.15em] uppercase block mb-1.5" style={{ color: 'var(--text-subtle)' }}>
                  Email address
                </label>
                <input
                  type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" autoComplete="email"
                  className="w-full font-sans text-sm px-4 py-3.5 rounded-xl outline-none transition-all"
                  style={{ background: 'var(--bg-card)', border: '1px solid rgba(128,128,128,0.15)', color: 'var(--text-primary)' }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(128,128,128,0.15)'}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="font-sans text-[11px] tracking-[.15em] uppercase" style={{ color: 'var(--text-subtle)' }}>Password</label>
                  <Link href="/auth/forgot" className="font-sans text-[11px] transition-colors" style={{ color: 'var(--accent)' }}>
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'} required value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••" autoComplete="current-password"
                    className="w-full font-sans text-sm px-4 py-3.5 pr-14 rounded-xl outline-none transition-all"
                    style={{ background: 'var(--bg-card)', border: '1px solid rgba(128,128,128,0.15)', color: 'var(--text-primary)' }}
                    onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(128,128,128,0.15)'}
                  />
                  <button type="button" onClick={() => setShowPass(s => !s)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 font-sans text-[11px] transition-colors"
                    style={{ color: 'var(--text-subtle)' }}>
                    {showPass ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 font-sans text-xs tracking-[.18em] uppercase font-medium rounded-xl transition-all disabled:opacity-60"
                style={{ background: 'var(--accent)', color: '#fff' }}>
                {loading
                  ? <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3"/><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>Signing in…</>
                  : 'Sign in →'}
              </button>
            </form>

            <p className="font-sans text-[10px] text-center mt-6" style={{ color: 'var(--text-subtle)' }}>
              By signing in you agree to our{' '}
              <Link href="/terms" className="underline underline-offset-2">Terms</Link>{' '}and{' '}
              <Link href="/privacy" className="underline underline-offset-2">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </main>
    </>
  )
}
