import { useEffect, useMemo, useState } from 'react';
import { Award, BarChart3, BookOpenCheck, Medal, Target, Trophy, UserCircle } from 'lucide-react';
import { apiGet } from '../lib/api';
import { useAuth } from '../context/AuthContext';

type ProfileProgress = {
  modules_completed: number;
  best_quiz_percentage: string | number;
  quiz_attempts_count: number;
  general_points: string | number;
  rankPosition: number;
  totalModules: number;
  moduleCompletionPercentage: number;
  completedModuleIds: number[];
  calculation: {
    formula: string;
  };
};

type ProfileData = {
  progress: ProfileProgress;
  lastQuizAttempt: {
    score: number;
    total_questions: number;
    percentage: string | number;
  } | null;
};

type RankingUser = {
  rank_position: number;
  user_id: number;
  username: string | null;
  email: string;
  modules_completed: number;
  best_quiz_percentage: string | number;
  quiz_attempts_count: number;
  general_points: string | number;
};

function formatNumber(value: string | number) {
  return Number(value || 0).toLocaleString('pt-BR', { maximumFractionDigits: 2 });
}

export default function Profile() {
  const { token, user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [ranking, setRanking] = useState<RankingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        setLoading(true);
        const [profileData, rankingData] = await Promise.all([
          apiGet<ProfileData>('/api/content/profile', token),
          apiGet<RankingUser[]>('/api/content/ranking', token),
        ]);

        if (active) {
          setProfile(profileData);
          setRanking(rankingData);
          setError('');
        }
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Falha ao carregar perfil.');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProfile();
    return () => {
      active = false;
    };
  }, [token]);

  const displayName = user?.name || user?.username || user?.email || 'Usuario';
  const initials = displayName.slice(0, 2).toUpperCase();
  const topRanking = useMemo(() => ranking.slice(0, 5), [ranking]);

  if (loading) return <div className="empty-state">Carregando perfil...</div>;
  if (error) return <div className="empty-state">{error}</div>;
  if (!profile) return <div className="empty-state">Perfil indisponivel.</div>;

  const { progress } = profile;

  return (
    <div className="profile-page">
      <section className="profile-hero">
        <div className="profile-avatar-large">{initials}</div>
        <div>
          <span className="profile-kicker">Perfil do usuario</span>
          <h1>{displayName}</h1>
          <p>{user?.email}</p>
        </div>
        <div className="profile-rank">
          <Trophy size={22} />
          <span>#{progress.rankPosition || '-'}</span>
          <small>ranking</small>
        </div>
      </section>

      <section className="progress-overview">
        <div className="metric-card">
          <BookOpenCheck size={24} />
          <span>Modulos concluidos</span>
          <strong>{progress.modules_completed}/{progress.totalModules}</strong>
        </div>
        <div className="metric-card">
          <Target size={24} />
          <span>Melhor quiz</span>
          <strong>{formatNumber(progress.best_quiz_percentage)}%</strong>
        </div>
        <div className="metric-card">
          <Award size={24} />
          <span>Pontos gerais</span>
          <strong>{formatNumber(progress.general_points)}</strong>
        </div>
        <div className="metric-card">
          <BarChart3 size={24} />
          <span>Tentativas</span>
          <strong>{progress.quiz_attempts_count}</strong>
        </div>
      </section>

      <section className="profile-grid">
        <div className="progress-panel">
          <div className="panel-title-row">
            <h2>Painel de progresso</h2>
            <span>{progress.moduleCompletionPercentage}%</span>
          </div>

          <div className="progress-ring-row">
            <div className="progress-ring" style={{ ['--progress' as string]: `${progress.moduleCompletionPercentage}%` }}>
              <span>{progress.moduleCompletionPercentage}%</span>
            </div>
            <div>
              <p>{progress.modules_completed} de {progress.totalModules} modulos finalizados.</p>
              <p className="muted-text">Complete modulos e refaca o quiz para subir no ranking.</p>
            </div>
          </div>

          <div className="calculation-box">
            <strong>Calculo do ranking</strong>
            <span>{progress.calculation.formula}</span>
          </div>

          {profile.lastQuizAttempt && (
            <div className="last-quiz">
              <span>Ultimo quiz</span>
              <strong>
                {profile.lastQuizAttempt.score}/{profile.lastQuizAttempt.total_questions}
                {' '}({formatNumber(profile.lastQuizAttempt.percentage)}%)
              </strong>
            </div>
          )}
        </div>

        <div className="ranking-panel">
          <div className="panel-title-row">
            <h2>Ranking</h2>
            <Medal size={20} />
          </div>

          <div className="ranking-list">
            {topRanking.length === 0 && <p className="muted-text">Ainda nao ha ranking.</p>}
            {topRanking.map((item) => {
              const isCurrentUser = item.user_id === user?.id;
              const name = item.username || item.email;

              return (
                <div key={item.user_id} className={`ranking-row${isCurrentUser ? ' current' : ''}`}>
                  <span className="ranking-position">#{item.rank_position}</span>
                  <UserCircle size={22} />
                  <div>
                    <strong>{name}</strong>
                    <small>{item.modules_completed} modulos - {formatNumber(item.best_quiz_percentage)}% quiz</small>
                  </div>
                  <span>{formatNumber(item.general_points)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
