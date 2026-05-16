import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) { setError('Informe seu e-mail.'); return }
    setLoading(true)
    setError('')
    try {
      await fetch(`${API}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      // Always show success for security (don't reveal if email exists)
      setSent(true)
    } catch {
      setError('Erro ao enviar e-mail. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="auth-container">
        <div className="auth-card text-center">
          <div className="logo-container">
            <span className="logo-text">LGPD Educa</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#10b981'
            }}>
              <CheckCircle size={36} />
            </div>
          </div>
          <h2 style={{ marginBottom: '0.75rem' }}>E-mail enviado!</h2>
          <p style={{ color: 'var(--text)', marginBottom: '2rem', lineHeight: '1.7' }}>
            Se uma conta existir para <strong>{email}</strong>,
            você receberá as instruções de recuperação em breve.
          </p>
          <Link to="/login" className="btn-primary" style={{ display: 'flex', justifyContent: 'center' }} id="btn-voltar-login">
            Voltar ao login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="logo-container">
          <span className="logo-text">LGPD Educa</span>
        </div>

        <h1 className="auth-title">Recuperar senha</h1>
        <p className="auth-subtitle">Insira seu e-mail e enviaremos as instruções para você.</p>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label" htmlFor="forgot-email">E-mail</label>
            <div className="input-wrapper">
              <Mail className="input-icon" />
              <input
                id="forgot-email"
                className="input-field has-icon"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError('') }}
                autoComplete="email"
              />
            </div>
          </div>

          <button className="btn-primary" type="submit" disabled={loading} id="btn-send-forgot">
            {loading ? <span className="spinner" /> : 'Enviar instruções'}
          </button>
        </form>

        <div className="auth-footer">
          <Link to="/login" id="link-back-login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
            <ArrowLeft size={14} /> Voltar ao login
          </Link>
        </div>
      </div>
    </div>
  )
}
