import { useState } from 'react'
import { ChevronRight, Trophy, RotateCcw } from 'lucide-react'

const questions = [
  {
    id: 1,
    text: 'O que significa a sigla LGPD?',
    options: [
      'Lei Geral de Proteção de Dados',
      'Lei Global de Processamento Digital',
      'Legislação Geral de Privacidade Digital',
      'Lei Geral de Política de Dados',
    ],
    correct: 0,
  },
  {
    id: 2,
    text: 'Qual é o órgão responsável por fiscalizar o cumprimento da LGPD no Brasil?',
    options: [
      'Ministério da Justiça',
      'ANPD – Autoridade Nacional de Proteção de Dados',
      'IBGE',
      'Banco Central',
    ],
    correct: 1,
  },
  {
    id: 3,
    text: 'O que são "dados pessoais sensíveis" segundo a LGPD?',
    options: [
      'Dados financeiros sigilosos de empresas',
      'Dados sobre origem racial, saúde, biometria, entre outros',
      'Informações de contato como e-mail e telefone',
      'Qualquer dado armazenado em nuvem',
    ],
    correct: 1,
  },
  {
    id: 4,
    text: 'Qual é uma das bases legais para o tratamento de dados pessoais prevista na LGPD?',
    options: [
      'Interesse comercial da empresa',
      'Consentimento do titular',
      'Autorização de qualquer servidor público',
      'Publicação nas redes sociais',
    ],
    correct: 1,
  },
  {
    id: 5,
    text: 'O titular dos dados tem o direito de:',
    options: [
      'Exigir que seus dados nunca sejam usados por ninguém',
      'Revogar o consentimento a qualquer momento',
      'Processar criminalmente qualquer empresa que colete dados',
      'Solicitar a exclusão de dados de domínio público',
    ],
    correct: 1,
  },
]

const letters = ['A', 'B', 'C', 'D']

export default function Quiz() {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  const question = questions[current]

  const handleSelect = (idx) => {
    if (answered) return
    setSelected(idx)
    setAnswered(true)
    if (idx === question.correct) setScore(s => s + 1)
  }

  const handleNext = () => {
    if (current + 1 < questions.length) {
      setCurrent(c => c + 1)
      setSelected(null)
      setAnswered(false)
    } else {
      setFinished(true)
    }
  }

  const handleRestart = () => {
    setCurrent(0)
    setSelected(null)
    setAnswered(false)
    setScore(0)
    setFinished(false)
  }

  const getOptionClass = (idx) => {
    if (!answered) return selected === idx ? 'option-btn selected' : 'option-btn'
    if (idx === question.correct) return 'option-btn correct'
    if (idx === selected && idx !== question.correct) return 'option-btn wrong'
    return 'option-btn'
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100)
    const emoji = pct >= 80 ? '🏆' : pct >= 60 ? '👍' : '📚'
    const msg = pct >= 80
      ? 'Excelente! Você domina a LGPD!'
      : pct >= 60
      ? 'Bom trabalho! Continue estudando.'
      : 'Continue praticando, você chegará lá!'

    return (
      <div className="quiz-container">
        <div className="question-card quiz-result">
          <div className="result-icon">{emoji}</div>
          <div className="result-score">{score}/{questions.length}</div>
          <div style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{pct}% de aproveitamento</div>
          <p className="result-msg">{msg}</p>
          <button className="btn-next" onClick={handleRestart} id="btn-restart-quiz" style={{ margin: '0 auto' }}>
            <RotateCcw size={16} />
            Refazer quiz
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Quiz LGPD</h1>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            {current + 1} / {questions.length}
          </span>
        </div>
        <div className="quiz-progress-track">
          <div
            className="quiz-progress-fill"
            style={{ width: `${((current + (answered ? 1 : 0)) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="question-card">
        <span className="question-number">Questão {current + 1}</span>
        <h2 className="question-text">{question.text}</h2>

        <div className="options-list">
          {question.options.map((opt, idx) => (
            <button
              key={idx}
              className={getOptionClass(idx)}
              onClick={() => handleSelect(idx)}
              disabled={answered}
              id={`option-${idx}`}
            >
              <span className="option-letter">{letters[idx]}</span>
              {opt}
            </button>
          ))}
        </div>

        <div className="quiz-actions">
          <button
            className="btn-next"
            onClick={handleNext}
            disabled={!answered}
            id="btn-next-question"
          >
            {current + 1 < questions.length ? 'Próxima' : 'Ver resultado'}
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
