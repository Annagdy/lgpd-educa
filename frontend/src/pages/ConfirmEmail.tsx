// src/pages/ConfirmEmail.jsx (No seu Frontend React)
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function ConfirmEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); // Extrai o ?token=... da URL
  
  const [mensagem, setMensagem] = useState('Verificando o seu e-mail...');
  const navigate = useNavigate();

  useEffect(() => {
    // Se a pessoa abrir a página sem o token no link
    if (!token) {
      setMensagem('Nenhum token encontrado no link.');
      return;
    }

    // Faz o pedido ao Backend (Node.js na porta 3000)
    fetch(`http://localhost:3000/api/auth/confirm-email?token=${token}`)
      .then((resposta) => resposta.json())
      .then((dados) => {
        if (dados.message) {
          // Deu tudo certo!
          setMensagem('E-mail verificado com sucesso! A redirecionar para o Login...');
          
          // Manda o utilizador para a página de login após 3 segundos
          setTimeout(() => {
            navigate('/login');
          }, 3000);
          
        } else {
          // O backend retornou algum erro (token expirado, etc)
          setMensagem(dados.error || 'Erro ao validar o token.');
        }
      })
      .catch((erro) => {
        console.error(erro);
        setMensagem('Erro de conexão com o servidor.');
      });

  }, [token, navigate]); // O useEffect roda automaticamente quando a página carrega

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h2>Confirmação de Conta</h2>
      <p>{mensagem}</p>
    </div>
  );
}