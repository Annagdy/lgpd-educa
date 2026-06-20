import { useState, type FC, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { API_URL } from '../lib/api.ts';

const Register: FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    setErrorMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('As senhas não coincidem. Por favor, verifique.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Cadastro realizado! Verifique seu e-mail para ativar a conta antes de fazer login.');
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } else {
        setErrorMsg(data.message || 'Erro ao realizar o cadastro.');
      }
    } catch {
      setErrorMsg('Erro ao conectar com o servidor. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="auth-card"
      >
        <div className="logo-container">
          <div className="flex items-center gap-2">
            <ShieldCheck size={32} color="var(--primary)" strokeWidth={2.5} />
            <span className="logo-text">LGPD Educa</span>
          </div>
        </div>

        <h2 className="text-center mb-2">Crie sua conta</h2>
        <p className="text-center mb-6">Comece sua jornada de conformidade com a LGPD.</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label" htmlFor="name">Nome completo</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text)' }} />
              <input 
                type="text" 
                id="name"
                className="input-field w-full"
                style={{ paddingLeft: '40px' }}
                placeholder="João Silva"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="email">E-mail</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text)' }} />
              <input 
                type="email" 
                id="email"
                className="input-field w-full"
                style={{ paddingLeft: '40px' }}
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="password">Senha</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text)' }} />
              <input 
                type="password" 
                id="password"
                className="input-field w-full"
                style={{ paddingLeft: '40px' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="confirm-password">Confirmar Senha</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text)' }} />
              <input 
                type="password" 
                id="confirm-password"
                className="input-field w-full"
                style={{ paddingLeft: '40px' }}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {errorMsg && (
            <div className="register-msg register-msg--error" id="register-error">
              {errorMsg}
            </div>
          )}
          {message && (
            <div className="register-msg register-msg--success" id="register-success">
              {message}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary flex items-center justify-center gap-2 mt-4"
            disabled={loading}
            id="btn-register-submit"
          >
            <UserPlus size={20} />
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

        <div className="auth-footer">
          Já tem uma conta? <Link to="/login">Entre aqui</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
