import { useEffect, useState } from 'react';
import { ArrowLeft, BookOpen, CheckCircle, ChevronRight, RotateCcw, Trophy } from 'lucide-react';
import { apiGet, apiRequest } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import type { LearningModule } from './Home';

type ModuleSection = {
  id: number;
  title: string;
  content: string;
  sortOrder: number;
};

type ModuleContent = LearningModule & {
  sections: ModuleSection[];
};

type QuizOption = { id: number; text: string };
type QuizQuestion = { id: number; question: string; options: QuizOption[] };
type QuizAnswer = { questionId: number; optionId: number };
type QuizResult = { id: number; score: number; total_questions: number; percentage: string | number };

const letters = ['A', 'B', 'C', 'D'];

function ModuleQuiz({ moduleId, token }: { moduleId: number; token: string | null }) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const question = questions[current];
  const answered = selectedOptionId !== null;

  useEffect(() => {
    let active = true;
    setLoading(true);
    apiGet<QuizQuestion[]>(`/api/content/modules/${moduleId}/quiz`, token)
      .then((data) => { if (active) { setQuestions(data); setError(''); } })
      .catch((err) => { if (active) setError(err instanceof Error ? err.message : 'Falha ao carregar quiz.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [moduleId, token]);

  function handleSelect(optionId: number) {
    if (answered || !question) return;
    setSelectedOptionId(optionId);
    setAnswers((prev) => [
      ...prev.filter((a) => a.questionId !== question.id),
      { questionId: question.id, optionId },
    ]);
  }

  async function handleNext() {
    if (!answered) return;
    if (current + 1 < questions.length) {
      setCurrent((v) => v + 1);
      setSelectedOptionId(null);
      return;
    }
    try {
      setSaving(true);
      const data = await apiRequest<QuizResult>(`/api/content/modules/${moduleId}/quiz/realizar`, {
        method: 'POST',
        token,
        body: JSON.stringify({ answers }),
      });
      setResult(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao salvar resultado.');
    } finally {
      setSaving(false);
    }
  }

  function handleRestart() {
    setCurrent(0);
    setAnswers([]);
    setSelectedOptionId(null);
    setResult(null);
    setError('');
  }

  if (loading) return <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Carregando quiz...</p>;
  if (error && !questions.length) return <p className="inline-error">{error}</p>;
  if (!questions.length) return <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Nenhuma pergunta disponível para este módulo.</p>;

  if (result) {
    const pct = Math.round(Number(result.percentage));
    const msg = pct >= 80 ? 'Excelente! Você domina este módulo.' : pct >= 60 ? 'Bom trabalho! Continue estudando.' : 'Continue praticando para fortalecer seus conhecimentos.';
    return (
      <div className="module-quiz-result">
        <Trophy size={40} className="result-icon" />
        <div className="result-score">{result.score}/{result.total_questions}</div>
        <div className="result-percent">{pct}% de aproveitamento</div>
        <p className="result-msg">{msg}</p>
        <button className="btn-next" onClick={handleRestart} id={`btn-restart-module-quiz-${moduleId}`}>
          <RotateCcw size={15} /> Refazer quiz
        </button>
      </div>
    );
  }

  return (
    <div className="module-quiz-inline">
      <div className="quiz-progress-track" style={{ marginBottom: '1rem' }}>
        <div
          className="quiz-progress-fill"
          style={{ width: `${((current + (answered ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </div>
      <span className="question-number">Questão {current + 1} de {questions.length}</span>
      <h3 className="question-text" style={{ fontSize: '1rem', margin: '0.5rem 0 1rem' }}>{question.question}</h3>

      <div className="options-list">
        {question.options.map((opt, i) => (
          <button
            key={opt.id}
            className={selectedOptionId === opt.id ? 'option-btn selected' : 'option-btn'}
            onClick={() => handleSelect(opt.id)}
            disabled={answered}
            id={`mod-quiz-opt-${opt.id}`}
          >
            <span className="option-letter">{letters[i] || i + 1}</span>
            {opt.text}
          </button>
        ))}
      </div>

      {error && <p className="inline-error">{error}</p>}

      <div className="quiz-actions" style={{ marginTop: '1rem' }}>
        <button
          className="btn-next"
          onClick={handleNext}
          disabled={!answered || saving}
          id={`btn-next-module-quiz-${moduleId}`}
        >
          {saving ? 'Salvando...' : current + 1 < questions.length ? 'Próxima' : 'Ver resultado'}
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}

export default function ModuleDetail({
  module,
  onBack,
  onCompleted,
}: {
  module: LearningModule;
  onBack: () => void;
  onCompleted?: (moduleId: number) => void;
}) {
  const { token } = useAuth();
  const [content, setContent] = useState<ModuleContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState('');
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadModule() {
      try {
        setLoading(true);
        const data = await apiGet<ModuleContent>(`/api/content/modules/${module.id}`);

        if (active) {
          setContent(data);
          setError('');
        }
      } catch (err) {
        if (active) {
          setContent(null);
          setError(err instanceof Error ? err.message : 'Falha ao carregar modulo.');
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    setCompleted(false);
    setShowQuiz(false);
    loadModule();
    return () => { active = false; };
  }, [module.id]);

  const sections = content?.sections?.length
    ? content.sections
    : [{ id: 0, title: 'Em breve', content: 'Este modulo esta em construcao.', sortOrder: 0 }];

  async function handleCompleteModule() {
    try {
      setSaving(true);
      await apiRequest(`/api/content/modules/${module.id}/complete`, {
        method: 'POST',
        token,
      });
      setCompleted(true);
      onCompleted?.(module.id);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao atualizar progresso.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="module-content">
      <button className="back-btn" onClick={onBack} id="btn-back-module">
        <ArrowLeft size={18} />
        Voltar aos modulos
      </button>

      <div className="content-card">
        <div className="content-heading">
          <div className="module-card-icon">
            <BookOpen size={22} />
          </div>
          <div>
            <span className="badge badge-module">Modulo {module.id}</span>
            <h1>{module.title}</h1>
          </div>
        </div>

        {loading && <p>Carregando conteudo...</p>}
        {error && <p className="inline-error">{error}</p>}

        {!loading && !error && sections.map((section, index) => (
          <section key={section.id || index} className="module-section">
            <h2>{section.title}</h2>
            <p>{section.content}</p>
          </section>
        ))}

        {!loading && !error && (
          <>
            <button
              className="btn-complete-module"
              onClick={handleCompleteModule}
              disabled={saving || completed}
            >
              <CheckCircle size={18} />
              {completed ? 'Modulo concluido' : saving ? 'Salvando...' : 'Marcar como concluido'}
            </button>

            {/* Quiz do Módulo */}
            <div className="module-quiz-section">
              <div className="module-quiz-header">
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Quiz do Módulo</h2>
                  <p style={{ margin: '0.25rem 0 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    Teste seus conhecimentos sobre {module.title}
                  </p>
                </div>
                <button
                  className="btn-acessar"
                  id={`btn-toggle-quiz-${module.id}`}
                  onClick={() => setShowQuiz((v) => !v)}
                >
                  {showQuiz ? 'Fechar quiz' : 'Fazer quiz'}
                </button>
              </div>

              {showQuiz && <ModuleQuiz moduleId={module.id} token={token} />}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
