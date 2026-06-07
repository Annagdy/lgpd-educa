import { useEffect, useMemo, useState } from 'react';
import { ChevronRight, RotateCcw, Trophy } from 'lucide-react';
import { apiGet, apiRequest } from '../lib/api';
import { useAuth } from '../context/AuthContext';

type QuizOption = {
  id: number;
  text: string;
};

type QuizQuestion = {
  id: number;
  question: string;
  options: QuizOption[];
};

type QuizAnswer = {
  questionId: number;
  optionId: number;
};

type QuizResult = {
  id: number;
  score: number;
  total_questions: number;
  percentage: string | number;
};

const letters = ['A', 'B', 'C', 'D'];

export default function Quiz() {
  const { token } = useAuth();
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

    async function loadQuiz() {
      try {
        setLoading(true);
        const data = await apiGet<QuizQuestion[]>('/api/content/quiz', token);

        if (active) {
          setQuestions(data);
          setError('');
        }
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Falha ao carregar quiz.');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadQuiz();
    return () => {
      active = false;
    };
  }, [token]);

  const percentage = useMemo(() => {
    if (!result) return 0;
    return Math.round(Number(result.percentage));
  }, [result]);

  function handleSelect(optionId: number) {
    if (answered || !question) return;
    setSelectedOptionId(optionId);
    setAnswers((currentAnswers) => [
      ...currentAnswers.filter((answer) => answer.questionId !== question.id),
      { questionId: question.id, optionId },
    ]);
  }

  async function handleNext() {
    if (!answered) return;

    if (current + 1 < questions.length) {
      setCurrent((value) => value + 1);
      setSelectedOptionId(null);
      return;
    }

    try {
      setSaving(true);
      const data = await apiRequest<QuizResult>('/api/content/quiz/realizar', {
        method: 'POST',
        token,
        body: JSON.stringify({ answers }),
      });
      setResult(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao salvar resultado do quiz.');
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

  if (loading) return <div className="empty-state">Carregando quiz...</div>;
  if (error && !questions.length) return <div className="empty-state">{error}</div>;
  if (!question && !result) return <div className="empty-state">Nenhuma pergunta cadastrada.</div>;

  if (result) {
    const msg = percentage >= 80
      ? 'Excelente! Você domina a LGPD.'
      : percentage >= 60
        ? 'Bom trabalho! Continue estudando.'
        : 'Continue praticando para fortalecer seus conhecimentos.';

    return (
      <div className="quiz-container">
        <div className="question-card quiz-result">
          <Trophy size={56} className="result-icon" />
          <div className="result-score">{result.score}/{result.total_questions}</div>
          <div className="result-percent">{percentage}% de aproveitamento</div>
          <p className="result-msg">{msg}</p>
          <button className="btn-next" onClick={handleRestart} id="btn-restart-quiz">
            <RotateCcw size={16} />
            Refazer quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <div className="quiz-title-row">
          <h1>Quiz LGPD</h1>
          <span>{current + 1} / {questions.length}</span>
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
        <h2 className="question-text">{question.question}</h2>

        <div className="options-list">
          {question.options.map((option, index) => (
            <button
              key={option.id}
              className={selectedOptionId === option.id ? 'option-btn selected' : 'option-btn'}
              onClick={() => handleSelect(option.id)}
              disabled={answered}
              id={`option-${option.id}`}
            >
              <span className="option-letter">{letters[index] || index + 1}</span>
              {option.text}
            </button>
          ))}
        </div>

        {error && <p className="inline-error">{error}</p>}

        <div className="quiz-actions">
          <button className="btn-next" onClick={handleNext} disabled={!answered || saving} id="btn-next-question">
            {saving ? 'Salvando...' : current + 1 < questions.length ? 'Próxima' : 'Salvar resultado'}
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
