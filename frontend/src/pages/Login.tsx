import { useState, type FC } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, LogIn, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Bem vindo, ", data?.user?.username);
        
        // Salva o token no localStorage
        localStorage.setItem('token', data.token);
        
        // Redireciona o usuário para a página principal (Dashboard/Home)
        // navigate('/dashboard');
      } else {
        alert(data.error); // Mostra o erro retornado pelo backend (ex: "Senha incorreta")
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Erro de conexão com o servidor.");
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
