import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { apiGet } from '../lib/api';

type GlossaryTerm = {
  id: number;
  term: string;
  definition: string;
};

export default function Glossary() {
  const [search, setSearch] = useState('');
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadGlossary() {
      try {
        setLoading(true);
        const data = await apiGet<GlossaryTerm[]>('/api/content/glossary');

        if (active) {
          setTerms(data);
          setError('');
        }
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Falha ao carregar glossário.');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadGlossary();
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) return terms;

    return terms.filter((item) =>
      item.term.toLowerCase().includes(normalizedSearch) ||
      item.definition.toLowerCase().includes(normalizedSearch)
    );
  }, [search, terms]);

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
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {loading && <div className="empty-state">Carregando glossário...</div>}
      {!loading && error && <div className="empty-state">{error}</div>}
      {!loading && !error && filtered.length === 0 && (
        <div className="empty-state">Nenhum termo encontrado.</div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="glossary-list">
          {filtered.map((item) => (
            <div key={item.id} className="glossary-item" id={`glossary-item-${item.id}`}>
              <div className="glossary-term">{item.term}</div>
              <div className="glossary-def">{item.definition}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
