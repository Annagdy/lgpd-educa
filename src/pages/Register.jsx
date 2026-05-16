import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username || !form.email || !form.password || !form.confirmPassword) {
      setError('Preencha todos os campos.')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }
    if (form.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Erro ao criar conta.')
      setSuccess(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
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
          <h2 style={{ marginBottom: '0.75rem' }}>Conta criada!</h2>
          <p style={{ color: 'var(--text)', marginBottom: '2rem' }}>
            Enviamos um e-mail de confirmação para <strong>{form.email}</strong>.
            Verifique sua caixa de entrada e clique no link para ativar sua conta.
          </p>
          <Link to="/login" className="btn-primary" style={{ display: 'flex', justifyContent: 'center' }} id="btn-ir-login">
            Ir para o login
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

        <h1 className="auth-title">Crie sua conta</h1>
        <p className="auth-subtitle">Comece sua jornada de conformidade com a LGPD.</p>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label" htmlFor="reg-username">Nome de usuário</label>
            <div className="input-wrapper">
              <User className="input-icon" />
              <input
                id="reg-username"
                className="input-field has-icon"
                type="text"
                name="username"
                placeholder="Seu nome"
                value={form.username}
                onChange={handleChange}
                autoComplete="name"
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="reg-email">E-mail</label>
            <div className="input-wrapper">
              <Mail className="input-icon" />
              <input
                id="reg-email"
                className="input-field has-icon"
                type="email"
                name="email"
                placeholder="seu@email.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="reg-password">Senha</label>
            <div className="input-wrapper">
              <Lock className="input-icon" />
              <input
                id="reg-password"
                className="input-field has-icon"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Mínimo 6 caracteres"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <button type="button" className="input-toggle" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="reg-confirm">Confirmar senha</label>
            <div className="input-wrapper">
              <Lock className="input-icon" />
              <input
                id="reg-confirm"
                className="input-field has-icon"
                type={showConfirm ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Repita a senha"
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <button type="button" className="input-toggle" onClick={() => setShowConfirm(!showConfirm)}>
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button className="btn-primary" type="submit" disabled={loading} id="btn-register" style={{ marginTop: '0.5rem' }}>
            {loading ? <span className="spinner" /> : 'Criar conta'}
          </button>
        </form>

        <div className="auth-footer">
          Já tem conta?{' '}
          <Link to="/login" id="link-login">Entrar</Link>
        </div>
      </div>
    </div>
  )
}
