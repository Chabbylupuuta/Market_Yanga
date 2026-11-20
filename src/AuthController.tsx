import { useEffect, useState, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import './auth.css'

type AuthSession = {
  email: string
  displayName?: string
  idToken: string
  refreshToken: string
}

type FirebaseAuthResponse = {
  email: string
  displayName?: string
  idToken: string
  refreshToken: string
}

type StoredSession = AuthSession & { refreshToken: string }

type AuthMode = 'login' | 'signup' | 'reset'

// This is the public Firebase web API key used by Zara-Chabby's existing auth project.
// Firebase web API keys identify the project; enable Email/Password and authorize the
// Market Yanga domains in that project's Firebase console before using this login.
const firebaseApiKey = import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDxxwwCO9U5WulqLwjRFVXGTpJB6_CBnGE'
const sessionKey = 'market-yanga.firebase-auth-session'

async function firebaseRequest<T>(endpoint: string, payload: Record<string, string | boolean>): Promise<T> {
  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/${endpoint}?key=${firebaseApiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const result = await response.json() as T & { error?: { message?: string } }
  if (!response.ok) throw new Error(result.error?.message || 'REQUEST_FAILED')
  return result
}

function friendlyAuthError(error: unknown) {
  const code = error instanceof Error ? error.message : ''
  if (code.includes('EMAIL_EXISTS')) return 'An account already exists with this email.'
  if (code.includes('INVALID_LOGIN_CREDENTIALS') || code.includes('EMAIL_NOT_FOUND') || code.includes('INVALID_PASSWORD')) return 'The email or password is incorrect.'
  if (code.includes('WEAK_PASSWORD')) return 'Use a stronger password with at least six characters.'
  if (code.includes('INVALID_EMAIL')) return 'Enter a valid email address.'
  if (code.includes('TOO_MANY_ATTEMPTS')) return 'Too many attempts. Please wait a moment and try again.'
  if (code.includes('OPERATION_NOT_ALLOWED')) return 'Email and password sign-in is not enabled for this Firebase project.'
  if (code.includes('API_KEY_INVALID')) return 'Firebase is not configured correctly. Check the Firebase API key.'
  return 'Could not connect to sign-in. Please try again.'
}

function readSession(): StoredSession | null {
  try {
    const stored = localStorage.getItem(sessionKey) || sessionStorage.getItem(sessionKey)
    return stored ? JSON.parse(stored) as StoredSession : null
  } catch {
    return null
  }
}

function clearSession() {
  localStorage.removeItem(sessionKey)
  sessionStorage.removeItem(sessionKey)
}

function saveSession(session: StoredSession, remember: boolean) {
  clearSession()
  const storage = remember ? localStorage : sessionStorage
  storage.setItem(sessionKey, JSON.stringify(session))
}

export default function AuthController() {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [session, setSession] = useState<StoredSession | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const openLogin = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof Element) || !target.closest('.login-link, .sell-button, .community-banner > button')) return
      // The prototype buttons open a phone-only placeholder modal. Handle these clicks
      // before React so they open this real email/password Firebase flow instead.
      event.preventDefault()
      event.stopPropagation()
      setMode('login')
      setIsOpen(true)
      setError('')
      setMessage('')
    }
    document.addEventListener('click', openLogin, true)
    return () => document.removeEventListener('click', openLogin, true)
  }, [])

  useEffect(() => {
    const saved = readSession()
    if (!saved) return
    setSession(saved)
    // Refresh the Firebase ID token when restoring a saved login.
    void refreshSession(saved)
    const timer = window.setInterval(() => { void refreshSession(readSession()) }, 50 * 60 * 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [isOpen])

  async function refreshSession(current: StoredSession | null) {
    if (!current?.refreshToken) return
    try {
      const response = await fetch(`https://securetoken.googleapis.com/v1/token?key=${firebaseApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: current.refreshToken }),
      })
      const result = await response.json() as { id_token?: string; refresh_token?: string }
      if (!response.ok || !result.id_token || !result.refresh_token) throw new Error('SESSION_EXPIRED')
      const updated = { ...current, idToken: result.id_token, refreshToken: result.refresh_token }
      const remembered = localStorage.getItem(sessionKey) !== null
      saveSession(updated, remembered)
      setSession(updated)
    } catch {
      clearSession()
      setSession(null)
    }
  }

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode)
    setError('')
    setMessage('')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setMessage('')

    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setBusy(true)
    try {
      if (mode === 'reset') {
        await firebaseRequest('accounts:sendO，比Code', { requestType: 'PASSWORD_RESET', email })
        setMessage('Password reset email sent. Check your inbox.')
        return
      }

      const endpoint = mode === 'login' ? 'accounts:signInWithPassword' : 'accounts:signUp'
      const payload: Record<string, string | boolean> = { email, password, returnSecureToken: true }
      if (mode === 'signup') payload.displayName = fullName
      const result = await firebaseRequest<FirebaseAuthResponse>(endpoint, payload)
      const nextSession = {
        email: result.email,
        displayName: result.displayName || (mode === 'signup' ? fullName : undefined),
        idToken: result.idToken,
        refreshToken: result.refreshToken,
      }
      saveSession(nextSession, remember)
      setSession(nextSession)
      setPassword('')
      setConfirmPassword('')
      setIsOpen(false)
    } catch (submitError) {
      setError(friendlyAuthError(submitError))
    } finally {
      setBusy(false)
    }
  }

  function signOut() {
    clearSession()
    setSession(null)
    setIsOpen(false)
  }

  if (!isOpen) return null

  return createPortal(
    <div className="yanga-auth-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsOpen(false) }}>
      <section className="yanga-auth-dialog" role="dialog" aria-modal="true" aria-labelledby="yanga-auth-title">
        <button className="yanga-auth-close" type="button" aria-label="Close sign-in dialog" onClick={() => setIsOpen(false)}>×</button>
        <div className="yanga-auth-art" aria-hidden="true"><span>🌿</span><strong>YOUR LOCAL MARKET</strong></div>
        <div className="yanga-auth-content">
          <a className="yanga-auth-brand" href="#market" onClick={() => setIsOpen(false)}>yanga<span>.</span></a>
          {session ? (
            <>
              <p className="yanga-auth-kicker">ACCOUNT CONNECTED</p>
              <h2 id="yanga-auth-title">Good to have<br /><em>you here.</em></h2>
              <p className="yanga-auth-intro">Signed in as <strong>{session.displayName || session.email}</strong>.</p>
              <button className="yanga-auth-submit" type="button" onClick={signOut}>Sign out</button>
            </>
          ) : (
            <>
              <p className="yanga-auth-kicker">GOOD TO HAVE YOU HERE</p>
              <h2 id="yanga-auth-title">{mode === 'reset' ? 'Reset your password.' : <>Welcome to<br /><em>your market.</em></>}</h2>
              <p className="yanga-auth-intro">{mode === 'reset' ? 'Enter your email and we will send a password reset link.' : 'Sign in or create an account to connect with your community.'}</p>
              {mode !== 'reset' && <div className="yanga-auth-tabs" role="tablist" aria-label="Authentication mode">
                <button type="button" role="tab" aria-selected={mode === 'login'} className={mode === 'login' ? 'active' : ''} onClick={() => switchMode('login')}>Log in</button>
                <button type="button" role="tab" aria-selected={mode === 'signup'} className={mode === 'signup' ? 'active' : ''} onClick={() => switchMode('signup')}>Sign up</button>
              </div>}
              <form className="yanga-auth-form" onSubmit={handleSubmit}>
                {mode === 'signup' && <label>Full name<input type="text" autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Your name" required /></label>}
                <label>Email address<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required /></label>
                {mode !== 'reset' && <label>Password<input type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 6 characters" minLength={6} required /></label>}
                {mode === 'signup' && <label>Confirm password<input type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Repeat your password" minLength={6} required /></label>}
                {mode === 'login' && <div className="yanga-auth-meta"><label className="yanga-auth-remember"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} /> Remember me</label><button type="button" onClick={() => switchMode('reset')}>Forgot password?</button></div>}
                {error && <p className="yanga-auth-message error" role="alert">{error}</p>}
                {message && <p className="yanga-auth-message" role="status">{message}</p>}
                <button className="yanga-auth-submit" type="submit" disabled={busy}>{busy ? 'Please wait…' : mode === 'login' ? 'Log in' : mode === 'signup' ? 'Create account' : 'Send reset link'}<span aria-hidden="true">→</span></button>
                {mode === 'reset' && <button className="yanga-auth-back" type="button" onClick={() => switchMode('login')}>Back to log in</button>}
              </form>
            </>
          )}
          <p className="yanga-auth-note">Your account is managed securely by Firebase Authentication.</p>
        </div>
      </section>
    </div>,
    document.body,
  )
}
