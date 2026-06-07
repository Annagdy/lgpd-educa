import { useEffect, useState } from 'react';
import { ArrowLeft, BookOpen, CheckCircle } from 'lucide-react';
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
    loadModule();
    return () => {
      active = false;
    };
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
          <button className="btn-complete-module" onClick={handleCompleteModule} disabled={saving || completed}>
            <CheckCircle size={18} />
            {completed ? 'Modulo concluido' : saving ? 'Salvando...' : 'Marcar como concluido'}
          </button>
        )}
      </div>
    </div>
  );
}
