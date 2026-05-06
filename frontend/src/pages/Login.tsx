import { useState, type FC, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, LogIn, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('Login attempt with:', { email, password });
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

        <h2 className="text-center mb-2">Bem-vindo de volta</h2>
        <p className="text-center mb-6">Acesse sua conta para continuar aprendendo.</p>

        <form onSubmit={handleSubmit}>
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

          <Link to="/forgot-password" title="Recuperar senha" className="forgot-password">
            Esqueceu sua senha?
          </Link>

          <button type="submit" className="btn-primary flex items-center justify-center gap-2">
            <LogIn size={20} />
            Entrar
          </button>
        </form>

        <div className="auth-footer">
          Não tem uma conta? <Link to="/register">Cadastre-se</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
