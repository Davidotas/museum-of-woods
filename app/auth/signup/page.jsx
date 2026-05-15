'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Nav from '../../components/Nav'

const steps = [
  { label: 'Your details',  fields: ['firstName', 'lastName', 'email'] },
  { label: 'Set password',  fields: ['password', 'confirm'] },
  { label: 'Preferences',   fields: ['newsletter', 'proofEmail'] },
]

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden>
    <path fill="#4285F4" d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/>
    <path fill="#34A853" d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.565 24 12.255 24z"/>
    <path fill="#FBBC05" d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 000 10.76l3.98-3.09z"/>
    <path fill="#EA4335" d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.69 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/>
  </svg>
)

export default function SignUpPage() {
  const router     = useRouter()
  const [step, setStep]         = useState(0)
  const [loading, setLoading]   = useState(false)
  const [gLoading, setGLoading] = useState(false)
  const [done, setDone]         = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [serverError, setServerError] = useState('')
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '',
    password: '', confirm: '',
    newsletter: true, proofEmail: true,
  })
  const [errors, setErrors] = useState({})
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const validate = () => {
    const e = {}
    if (step === 0) {
      if (!form.firstName.trim()) e.firstName = 'Required'
      if (!form.lastName.trim())  e.lastName  = 'Required'
      if (!form.email.includes('@')) e.email   = 'Valid email required'
    }
    if (step === 1) {
      if (form.password.length < 8) e.password = 'Min. 8 characters'
      if (form.password !== form.confirm) e.confirm = "Passwords don't match"
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => { if (validate()) setStep(s => s + 1) }

  const handleGoogle = async () => {
    setGLoading(true)
    await signIn('google', { callbackUrl: '/' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setServerError('')
    try {
      // Register the account
      const regRes = await fetch('/api/auth/users', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action:   'register',
          email:    form.email,
          password: form.password,
          name:     `${form.firstName} ${form.lastName}`.trim(),
        }),
      })
      const regData = await regRes.json()
      if (!regRes.ok) {
        setServerError(regData.error || 'Registration failed. Please try again.')
        setLoading(false)
        return
      }

      // Auto sign-in after registration
      const signInRes = await signIn('credentials', {
        email:    form.email,
        password: form.password,
        action:   'login',
        redirect: false,
      })

      setLoading(false)
      if (signInRes?.ok) {
        setDone(true)
      } else {
        setDone(true) // Account created, just couldn't auto-login
      }
    } catch {
      setServerError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  if (done) {
    return (
      <>
        <Nav />
        <main className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)', paddingTop: 'var(--nav-h)' }}>
          <div className="text-center max-w-sm px-6">
            <div className="text-5xl mb-5">🌳</div>
            <h1 className="font-serif text-3xl mb-3" style={{ color: 'var(--text-primary)' }}>
              Welcome to the museum
            </h1>
            <p className="font-sans text-sm leading-relaxed mb-8" style={{ color: 'var(--text-subtle)' }}>
              Your account is created, {form.firstName}. Start exploring the collection or design something custom.
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/shop"
                className="py-4 font-sans text-xs tracking-widest uppercase text-center rounded-xl"
                style={{ background: 'var(--accent)', color: '#fff' }}>
                Browse the Collection
              </Link>
              <Link href="/studio"
                className="py-4 font-sans text-xs tracking-widest uppercase text-center rounded-xl"
                style={{ border: '1px solid rgba(128,128,128,0.2)', color: 'var(--text-muted)' }}>
                Design a Custom Piece
              </Link>
            </div>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Nav />
      <main className="min-h-screen flex" style={{ background: 'var(--bg-primary)', paddingTop: 'var(--nav-h)' }}>

        {/* Left panel */}
        <div className="hidden lg:flex flex-col justify-between w-[45%] relative overflow-hidden"
          style={{ background: '#0f1510' }}>
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, #0f1510 0%, #1a2318 50%, #141c12 100%)' }} />
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'repeating-linear-gradient(-8deg, transparent, transparent 40px, rgba(201,162,126,0.3) 40px, rgba(201,162,126,0.3) 41px)' }} />
          <div className="relative z-10 p-12 flex flex-col h-full justify-between">
            <Link href="/">
              <img src="/images/logo.svg" alt="Museum of Woods" className="h-14 w-auto"
                style={{ filter: 'brightness(0) invert(1)', opacity: 0.9 }} />
            </Link>
            <div className="space-y-6">
              {[
                { icon: '🎨', title: 'Design Studio',       desc: 'Build custom pieces in our 8-step configurator with live 3D preview' },
                { icon: '📦', title: 'Order Tracking',      desc: 'Follow your piece from workshop to your door' },
                { icon: '🌳', title: 'Wood Library',        desc: 'Access 7 wood species and their engraving profiles' },
                { icon: '🛡️', title: 'Design Proofs',       desc: 'Approve your design before a single cut is made' },
              ].map(f => (
                <div key={f.title} className="flex items-start gap-4">
                  <span className="text-2xl">{f.icon}</span>
                  <div>
                    <p className="font-sans text-sm font-medium" style={{ color: 'rgba(245,242,236,0.85)' }}>{f.title}</p>
                    <p className="font-sans text-xs leading-relaxed mt-0.5" style={{ color: 'rgba(245,242,236,0.35)' }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="font-sans text-xs" style={{ color: 'rgba(245,242,236,0.3)' }}>Museum of Woods · Global · Est. 2024</p>
          </div>
        </div>

        {/* Right: form */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">

            <div className="mb-6">
              <p className="font-sans text-[11px] tracking-[.3em] uppercase mb-2" style={{ color: 'var(--accent)' }}>
                Step {step + 1} of {steps.length}
              </p>
              <h1 className="font-serif text-4xl mb-2" style={{ color: 'var(--text-primary)' }}>
                {step === 0 ? 'Create account' : step === 1 ? 'Secure it' : 'Almost done'}
              </h1>
              <p className="font-sans text-sm" style={{ color: 'var(--text-subtle)' }}>
                {step === 0 ? <>Already have one?{' '}
                  <Link href="/auth/signin" className="underline underline-offset-2" style={{ color: 'var(--accent)' }}>Sign in</Link>
                </> : step === 1 ? 'Choose a strong password.' : 'Set your preferences — change any time.'}
              </p>
            </div>

            {/* Google sign-up (step 0 only) */}
            {step === 0 && (
              <>
                <button onClick={handleGoogle} disabled={gLoading}
                  className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl font-sans text-sm font-medium transition-all hover:shadow-md mb-4 disabled:opacity-60"
                  style={{ background: '#fff', color: '#1f1f1f', border: '1px solid #e0e0e0', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                  {gLoading
                    ? <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#4285F4" strokeWidth="3" strokeOpacity="0.3"/><path d="M12 2a10 10 0 0 1 10 10" stroke="#4285F4" strokeWidth="3" strokeLinecap="round"/></svg>
                    : <GoogleIcon />}
                  Continue with Google
                </button>
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex-1 h-px" style={{ background: 'rgba(128,128,128,0.15)' }} />
                  <span className="font-sans text-[11px]" style={{ color: 'var(--text-subtle)' }}>or create with email</span>
                  <div className="flex-1 h-px" style={{ background: 'rgba(128,128,128,0.15)' }} />
                </div>
              </>
            )}

            {/* Progress bar */}
            <div className="flex gap-1.5 mb-7">
              {steps.map((_, i) => (
                <div key={i} className="flex-1 h-1 rounded-full transition-all duration-500"
                  style={{ background: i <= step ? 'var(--accent)' : 'rgba(128,128,128,0.15)' }} />
              ))}
            </div>

            {/* Server error */}
            {serverError && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm mb-4"
                style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', color: '#dc2626' }}>
                ⚠️ {serverError}
              </div>
            )}

            <form onSubmit={step < 2 ? (e) => { e.preventDefault(); next() } : handleSubmit} className="space-y-4">

              {/* Step 0 — Personal details */}
              {step === 0 && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    {[['firstName', 'First name', 'Emma'], ['lastName', 'Last name', 'Clarke']].map(([k, label, ph]) => (
                      <div key={k}>
                        <label className="font-sans text-[11px] tracking-[.15em] uppercase block mb-1.5" style={{ color: 'var(--text-subtle)' }}>{label}</label>
                        <input type="text" value={form[k]} onChange={e => set(k, e.target.value)} placeholder={ph}
                          className="w-full font-sans text-sm px-4 py-3.5 rounded-xl outline-none transition-all"
                          style={{ background: 'var(--bg-card)', border: `1px solid ${errors[k] ? '#dc2626' : 'rgba(128,128,128,0.15)'}`, color: 'var(--text-primary)' }} />
                        {errors[k] && <p className="font-sans text-[10px] mt-1 text-red-500">{errors[k]}</p>}
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="font-sans text-[11px] tracking-[.15em] uppercase block mb-1.5" style={{ color: 'var(--text-subtle)' }}>Email address</label>
                    <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                      placeholder="you@example.com" autoComplete="email"
                      className="w-full font-sans text-sm px-4 py-3.5 rounded-xl outline-none transition-all"
                      style={{ background: 'var(--bg-card)', border: `1px solid ${errors.email ? '#dc2626' : 'rgba(128,128,128,0.15)'}`, color: 'var(--text-primary)' }} />
                    {errors.email && <p className="font-sans text-[10px] mt-1 text-red-500">{errors.email}</p>}
                  </div>
                </>
              )}

              {/* Step 1 — Password */}
              {step === 1 && (
                <>
                  {[['password', 'Password', '8+ characters'], ['confirm', 'Confirm password', 'Repeat your password']].map(([k, label, ph]) => (
                    <div key={k}>
                      <label className="font-sans text-[11px] tracking-[.15em] uppercase block mb-1.5" style={{ color: 'var(--text-subtle)' }}>{label}</label>
                      <div className="relative">
                        <input type={showPass ? 'text' : 'password'} value={form[k]} onChange={e => set(k, e.target.value)} placeholder={ph}
                          autoComplete={k === 'password' ? 'new-password' : 'new-password'}
                          className="w-full font-sans text-sm px-4 py-3.5 pr-14 rounded-xl outline-none transition-all"
                          style={{ background: 'var(--bg-card)', border: `1px solid ${errors[k] ? '#dc2626' : 'rgba(128,128,128,0.15)'}`, color: 'var(--text-primary)' }} />
                        {k === 'password' && (
                          <button type="button" onClick={() => setShowPass(s => !s)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 font-sans text-[11px]"
                            style={{ color: 'var(--text-subtle)' }}>{showPass ? 'Hide' : 'Show'}</button>
                        )}
                      </div>
                      {errors[k] && <p className="font-sans text-[10px] mt-1 text-red-500">{errors[k]}</p>}
                    </div>
                  ))}
                  <div className="flex gap-1 mt-1">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300"
                        style={{ background: form.password.length >= i * 2 ? (form.password.length >= 8 ? '#22c55e' : '#f59e0b') : 'rgba(128,128,128,0.12)' }} />
                    ))}
                  </div>
                </>
              )}

              {/* Step 2 — Preferences */}
              {step === 2 && (
                <div className="space-y-4">
                  {[
                    { k: 'newsletter', label: 'Inspiration & new pieces',      desc: 'Monthly emails with new products and maker stories' },
                    { k: 'proofEmail', label: 'Design proof notifications',     desc: 'Get emailed when your proof is ready to approve' },
                  ].map(({ k, label, desc }) => (
                    <button key={k} type="button" onClick={() => set(k, !form[k])}
                      className="w-full flex items-start gap-4 p-4 rounded-xl text-left transition-all"
                      style={{ border: `1px solid ${form[k] ? 'var(--accent)' : 'rgba(128,128,128,0.15)'}`, background: form[k] ? 'rgba(220,185,145,0.05)' : 'var(--bg-card)' }}>
                      <span className="w-5 h-5 mt-0.5 rounded flex items-center justify-center shrink-0 border transition-all"
                        style={{ borderColor: form[k] ? 'var(--accent)' : 'rgba(128,128,128,0.25)', background: form[k] ? 'var(--accent)' : 'transparent' }}>
                        {form[k] && <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>}
                      </span>
                      <div>
                        <p className="font-sans text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{label}</p>
                        <p className="font-sans text-[11px] mt-0.5 leading-relaxed" style={{ color: 'var(--text-subtle)' }}>{desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 mt-2 font-sans text-xs tracking-[.18em] uppercase font-medium rounded-xl transition-all disabled:opacity-60"
                style={{ background: 'var(--accent)', color: '#fff' }}>
                {loading
                  ? <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3"/><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>Creating account…</>
                  : step < 2 ? 'Continue →' : 'Create account →'}
              </button>

              {step > 0 && (
                <button type="button" onClick={() => setStep(s => s - 1)}
                  className="w-full py-3 font-sans text-xs tracking-[.15em] uppercase"
                  style={{ color: 'var(--text-subtle)' }}>
                  ← Back
                </button>
              )}
            </form>
          </div>
        </div>
      </main>
    </>
  )
}
