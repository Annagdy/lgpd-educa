import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { apiGet } from '../lib/api'

export default function Glossary() {
  const [search, setSearch] = useState('')
  const [glossaryTerms, setGlossaryTerms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadGlossary() {
      try {
        setLoading(true)
        const data = await apiGet('/api/content/glossary')

        if (active) {
          setGlossaryTerms(data.map((item) => ({ ...item, def: item.definition })))
          setError('')
        }
      } catch (err) {
        if (active) {
          setError(err.message)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadGlossary()

    return () => {
      active = false
    }
  }, [])

  const filtered = glossaryTerms.filter(
    (item) =>
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

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          Carregando glossário...
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          {error}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          Nenhum termo encontrado para "<strong>{search}</strong>".
        </div>
      ) : (
        <div className="glossary-list">
          {filtered.map((item, i) => (
            <div key={item.id || i} className="glossary-item" id={`glossary-item-${i}`}>
              <div className="glossary-term">{item.term}</div>
              <div className="glossary-def">{item.def}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
