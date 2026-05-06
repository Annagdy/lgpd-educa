import { useState, type FC, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, KeyRound, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const ForgotPassword: FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('Password recovery for:', email);
    setSubmitted(true);
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

        {!submitted ? (
          <>
            <h2 className="text-center mb-2">Recuperar senha</h2>
            <p className="text-center mb-6">Insira seu e-mail e enviaremos as instruções para você.</p>

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

              <button type="submit" className="btn-primary flex items-center justify-center gap-2 mt-4">
                <KeyRound size={20} />
                Enviar link
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div style={{ backgroundColor: 'var(--success)', padding: '12px', borderRadius: '50%', color: 'white' }}>
                <Mail size={32} />
              </div>
            </div>
            <h2 className="mb-2">E-mail enviado!</h2>
            <p className="mb-6">Se uma conta existir para {email}, você receberá instruções em breve.</p>
            <button onClick={() => setSubmitted(false)} className="btn-primary">
              Tentar outro e-mail
            </button>
          </div>
        )}

        <div className="auth-footer">
          <Link to="/login" className="flex items-center justify-center gap-2">
            <ArrowLeft size={16} />
            Voltar para o login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
