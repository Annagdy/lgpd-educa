import { useState } from 'react'
import { Search } from 'lucide-react'

const glossaryTerms = [
  { term: 'LGPD', def: 'Lei Geral de Proteção de Dados (Lei nº 13.709/2018). Regula o tratamento de dados pessoais no Brasil.' },
  { term: 'Dado Pessoal', def: 'Informação relacionada a pessoa natural identificada ou identificável, como nome, CPF, e-mail, endereço, IP etc.' },
  { term: 'Dado Sensível', def: 'Dado pessoal sobre origem racial ou étnica, convicção religiosa, opinião política, filiação sindical, saúde, vida sexual, dado genético ou biométrico.' },
  { term: 'Titular dos Dados', def: 'Pessoa natural a quem se referem os dados pessoais que são objeto de tratamento.' },
  { term: 'Controlador', def: 'Pessoa natural ou jurídica que toma as decisões referentes ao tratamento de dados pessoais.' },
  { term: 'Operador', def: 'Pessoa natural ou jurídica que realiza o tratamento de dados pessoais em nome do controlador.' },
  { term: 'ANPD', def: 'Autoridade Nacional de Proteção de Dados. Órgão federal responsável por zelar pela proteção de dados pessoais e fiscalizar o cumprimento da LGPD.' },
  { term: 'Consentimento', def: 'Manifestação livre, informada e inequívoca pela qual o titular concorda com o tratamento de seus dados pessoais para uma finalidade determinada.' },
  { term: 'Tratamento de Dados', def: 'Toda operação realizada com dados pessoais: coleta, produção, recepção, classificação, utilização, acesso, reprodução, transmissão, distribuição, processamento, arquivamento, armazenamento, eliminação, avaliação, controle, modificação, comunicação, transferência, difusão ou extração.' },
  { term: 'Anonimização', def: 'Utilização de meios técnicos razoáveis e disponíveis no momento do tratamento, por meio dos quais um dado perde a possibilidade de associação, direta ou indireta, a um indivíduo.' },
  { term: 'DPO (Encarregado)', def: 'Data Protection Officer. Pessoa indicada pelo controlador para atuar como canal de comunicação entre o controlador, os titulares dos dados e a ANPD.' },
  { term: 'Pseudonimização', def: 'Tratamento por meio do qual um dado perde a possibilidade de associação, direta ou indireta, a um indivíduo, senão pelo uso de informação adicional mantida separadamente.' },
  { term: 'RIPD', def: 'Relatório de Impacto à Proteção de Dados Pessoais. Documento que descreve os processos de tratamento que podem gerar riscos às liberdades civis e aos direitos fundamentais.' },
  { term: 'Bases Legais', def: 'Hipóteses previstas na LGPD que autorizam o tratamento de dados pessoais, como consentimento, obrigação legal, execução de contrato, interesse legítimo, entre outras.' },
  { term: 'Portabilidade', def: 'Direito do titular de solicitar a transferência de seus dados pessoais a outro fornecedor de serviço ou produto, mediante requisição expressa.' },
]

export default function Glossary() {
  const [search, setSearch] = useState('')

  const filtered = glossaryTerms.filter(
    item =>
      item.term.toLowerCase().includes(search.toLowerCase()) ||
      item.def.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="glossary-container">
      <div className="page-header">
        <h1>Glossário LGPD</h1>
        <p>Consulte os principais termos e conceitos da Lei Geral de Proteção de Dados.</p>
      </div>

      <div className="glossary-search">
        <Search className="glossary-search-icon" size={18} />
        <input
          id="glossary-search-input"
          className="glossary-search-input"
          type="text"
          placeholder="Buscar termo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          Nenhum termo encontrado para "<strong>{search}</strong>".
        </div>
      ) : (
        <div className="glossary-list">
          {filtered.map((item, i) => (
            <div key={i} className="glossary-item" id={`glossary-item-${i}`}>
              <div className="glossary-term">{item.term}</div>
              <div className="glossary-def">{item.def}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
