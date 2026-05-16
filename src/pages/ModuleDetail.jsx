import { ArrowLeft, BookOpen } from 'lucide-react'

const moduleContents = {
  1: {
    sections: [
      {
        title: 'O que é a LGPD?',
        content: `A Lei Geral de Proteção de Dados Pessoais (LGPD), Lei nº 13.709/2018, é a legislação brasileira que regula as atividades de tratamento de dados pessoais e que também altera os artigos 7º e 16 do Marco Civil da Internet.`
      },
      {
        title: 'Por que ela foi criada?',
        content: `Com o avanço tecnológico e a crescente coleta e processamento de dados pessoais por empresas e governos, tornou-se necessário criar uma estrutura legal que garantisse a privacidade e a proteção dos dados dos cidadãos brasileiros.`
      },
      {
        title: 'Quando entrou em vigor?',
        content: `A LGPD foi sancionada em agosto de 2018, mas passou por adiamentos. As sanções administrativas entraram em vigor em agosto de 2021. Desde então, a ANPD (Autoridade Nacional de Proteção de Dados) é responsável por fiscalizar o cumprimento da lei.`
      }
    ]
  },
  2: {
    sections: [
      {
        title: 'Princípios de Segurança',
        content: `A LGPD exige que as organizações adotem medidas técnicas e administrativas para proteger os dados pessoais de acessos não autorizados, situações acidentais ou ilícitas de destruição, perda, alteração, comunicação ou difusão.`
      },
      {
        title: 'Boas Práticas',
        content: `Entre as boas práticas destacam-se: criptografia de dados sensíveis, controle de acesso baseado em funções (RBAC), monitoramento contínuo de sistemas, realização de backups regulares e treinamento de colaboradores sobre segurança da informação.`
      }
    ]
  },
  3: {
    sections: [
      {
        title: 'Quem são os titulares?',
        content: `O titular é a pessoa natural a quem se referem os dados pessoais que são objeto de tratamento. A LGPD confere aos titulares uma série de direitos sobre seus próprios dados.`
      },
      {
        title: 'Direitos garantidos',
        content: `Os titulares têm direito a: confirmação da existência de tratamento; acesso aos dados; correção de dados incompletos; anonimização ou eliminação; portabilidade; informação sobre compartilhamento; revogação do consentimento; e revisão de decisões automatizadas.`
      }
    ]
  }
}

export default function ModuleDetail({ module, onBack }) {
  const content = moduleContents[module.id] || {
    sections: [{ title: 'Em breve', content: 'Este módulo está em construção. Volte em breve para conferir o conteúdo completo!' }]
  }

  return (
    <div className="module-content">
      <button className="back-btn" onClick={onBack} id="btn-back-module">
        <ArrowLeft size={18} />
        Voltar aos módulos
      </button>

      <div className="content-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div className="module-card-icon">
            <BookOpen size={22} />
          </div>
          <div>
            <span className="badge badge-module">Módulo {module.id}</span>
            <h1 style={{ marginTop: '0.375rem', fontSize: '1.5rem' }}>{module.title}</h1>
          </div>
        </div>

        {content.sections.map((section, i) => (
          <div key={i}>
            {i > 0 && <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '1.5rem 0' }} />}
            <h2>{section.title}</h2>
            <p>{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
