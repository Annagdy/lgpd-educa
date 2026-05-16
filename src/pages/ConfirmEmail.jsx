import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { CheckCircle, XCircle } from 'lucide-react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export default function ConfirmEmail() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('loading') // loading | success | error
  const [message, setMessage] = useState('')

  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) {
      setStatus('error')
      setMessage('Token de confirmação inválido ou ausente.')
      return
    }

    fetch(`${API}/api/auth/confirm-email?token=${token}`)
      .then(async (res) => {
        const data = await res.json()
        if (res.ok) {
          setStatus('success')
          setMessage(data.message || 'E-mail confirmado com sucesso!')
        } else {
          setStatus('error')
          setMessage(data.message || 'Não foi possível confirmar o e-mail.')
        }
      })
      .catch(() => {
        setStatus('error')
        setMessage('Erro de conexão. Tente novamente.')
      })
  }, [searchParams])

  return (
    <div className="confirm-container">
      <div className="confirm-card">
        <div className="logo-container">
          <span className="logo-text">LGPD Educa</span>
        </div>

        {status === 'loading' && (
          <>
            <div className="confirm-icon loading">
              <div className="spinner-purple" />
            </div>
            <h2>Confirmando sua conta...</h2>
            <p style={{ color: 'var(--text)', marginTop: '0.5rem' }}>
              Aguarde um momento.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="confirm-icon success">
              <CheckCircle size={36} />
            </div>
            <h2 style={{ marginBottom: '0.75rem' }}>Conta confirmada!</h2>
            <p style={{ color: 'var(--text)', marginBottom: '2rem' }}>{message}</p>
            <Link to="/login" className="btn-primary" style={{ display: 'flex', justifyContent: 'center' }} id="btn-login-confirmed">
              Ir para o login
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="confirm-icon error">
              <XCircle size={36} />
            </div>
            <h2 style={{ marginBottom: '0.75rem' }}>Ops!</h2>
            <p style={{ color: 'var(--text)', marginBottom: '2rem' }}>{message}</p>
            <Link to="/register" className="btn-primary" style={{ display: 'flex', justifyContent: 'center' }} id="btn-try-again">
              Tentar novamente
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
