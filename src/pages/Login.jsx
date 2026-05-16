import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('Preencha todos os campos.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Erro ao fazer login.')
      login(data.token, data.user)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="logo-container">
          <span className="logo-text">LGPD Educa</span>
        </div>

        <h1 className="auth-title">Bem-vindo de volta</h1>
        <p className="auth-subtitle">Acesse sua conta para continuar aprendendo.</p>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label" htmlFor="login-email">E-mail</label>
            <div className="input-wrapper">
              <Mail className="input-icon" />
              <input
                id="login-email"
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
            <label className="input-label" htmlFor="login-password">Senha</label>
            <div className="input-wrapper">
              <Lock className="input-icon" />
              <input
                id="login-password"
                className="input-field has-icon"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="input-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Link to="/forgot-password" className="forgot-password">Esqueceu a senha?</Link>

          <button className="btn-primary" type="submit" disabled={loading} id="btn-login">
            {loading ? <span className="spinner" /> : 'Entrar'}
          </button>
        </form>

        <div className="auth-footer">
          Não tem conta?{' '}
          <Link to="/register" id="link-register">Criar conta</Link>
        </div>
      </div>
    </div>
  )
}
