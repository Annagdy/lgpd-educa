import { useEffect, useState } from 'react'
import { ArrowLeft, BookOpen } from 'lucide-react'
import { apiGet } from '../lib/api'

export default function ModuleDetail({ module, onBack }) {
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadModule() {
      try {
        setLoading(true)
        const data = await apiGet(`/api/content/modules/${module.id}`)

        if (active) {
          setContent(data)
          setError('')
        }
      } catch (err) {
        if (active) {
          setContent(null)
          setError(err.message)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadModule()

    return () => {
      active = false
    }
  }, [module.id])

  const sections = content?.sections?.length
    ? content.sections
    : [{ title: 'Em breve', content: 'Este módulo está em construção. Volte em breve para conferir o conteúdo completo!' }]

  return (
    <div className="module-content">
      <button className="back-btn" onClick={onBack} id="btn-back-module">
        <ArrowLeft size={18} />
        Voltar aos módulos
      </button>

      <div className="content-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div className="module-card-icon">
            <BookOpen size={22} />
          </div>
          <div>
            <span className="badge badge-module">Módulo {module.id}</span>
            <h1 style={{ marginTop: '0.375rem', fontSize: '1.5rem' }}>{module.title}</h1>
          </div>
        </div>

        {loading && <p>Carregando conteúdo...</p>}
        {!loading && error && <p>{error}</p>}

        {!loading && !error && sections.map((section, i) => (
          <div key={section.id || i}>
            {i > 0 && <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '1.5rem 0' }} />}
            <h2>{section.title}</h2>
            <p>{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
