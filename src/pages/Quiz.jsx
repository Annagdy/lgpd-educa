export default function Quiz() {
  return (
    <div className="quiz-container">
      <div className="question-card">
        <span className="question-number">
          Questão 1
        </span>

        <h2 className="question-text">
          O que significa LGPD?
        </h2>

        <div className="options-list">
          <button className="btn-secondary">
            Lei Geral de Proteção de Dados
          </button>

          <button className="btn-secondary">
            Lei Global de Processamento Digital
          </button>
        </div>
      </div>
    </div>
  )
}
