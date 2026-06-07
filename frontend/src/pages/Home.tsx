import { useEffect, useState } from 'react';
import { Bell, BookOpen, CheckCircle, FileText, Lock, Shield, Users } from 'lucide-react';
import ModuleDetail from './ModuleDetail';
import { apiGet } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export type LearningModule = {
  id: number;
  title: string;
  description: string;
};

type UserProfile = {
  progress: {
    completedModuleIds: number[];
  };
};

const icons = [BookOpen, Shield, Users, FileText, Lock, Bell];

export default function Home() {
  const { token } = useAuth();
  const [selectedModule, setSelectedModule] = useState<LearningModule | null>(null);
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [completedModuleIds, setCompletedModuleIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadModules() {
      try {
        setLoading(true);
        const [modulesData, profileData] = await Promise.all([
          apiGet<LearningModule[]>('/api/content/modules'),
          apiGet<UserProfile>('/api/content/profile', token),
        ]);

        if (active) {
          setModules(modulesData);
          setCompletedModuleIds(profileData.progress.completedModuleIds);
          setError('');
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Falha ao carregar modulos.');
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadModules();
    return () => {
      active = false;
    };
  }, [token]);

  if (selectedModule) {
    return (
      <ModuleDetail
        module={selectedModule}
        onBack={() => setSelectedModule(null)}
        onCompleted={(moduleId) => setCompletedModuleIds((current) => [...new Set([...current, moduleId])])}
      />
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1>Modulos de Aprendizagem</h1>
        <p>Explore os conteudos sobre LGPD e fortaleca seus conhecimentos em protecao de dados.</p>
      </div>

      {loading && <p>Carregando modulos...</p>}
      {!loading && error && <p>{error}</p>}

      {!loading && !error && (
        <div className="modules-grid">
          {modules.map((module, index) => {
            const Icon = icons[index % icons.length];
            const isCompleted = completedModuleIds.includes(module.id);
            const progress = isCompleted ? 100 : 0;

            return (
              <div
                key={module.id}
                className="module-card"
                onClick={() => setSelectedModule(module)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => event.key === 'Enter' && setSelectedModule(module)}
                id={`module-card-${module.id}`}
              >
                <div className="module-card-header">
                  <div className="module-card-icon">
                    <Icon size={24} />
                  </div>
                  <div className="badge-row">
                    <span className="badge badge-module">Modulo {module.id}</span>
                    {isCompleted && (
                      <span className="badge badge-completed">
                        <CheckCircle size={12} />
                        Concluido
                      </span>
                    )}
                  </div>
                </div>

                <h2 className="module-card-title">{module.title}</h2>
                <p className="module-card-desc">{module.description}</p>

                <div className="module-card-footer">
                  <div className="progress-bar-wrapper">
                    <div className="progress-label">{progress}% concluido</div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                  <button
                    className="btn-acessar"
                    id={`btn-acessar-${module.id}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      setSelectedModule(module);
                    }}
                  >
                    {isCompleted ? 'Revisar' : 'Comecar'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
