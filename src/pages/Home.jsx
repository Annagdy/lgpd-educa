import { useEffect, useState } from 'react'
import { BookOpen, Shield, Users, FileText, Lock, Bell, CheckCircle } from 'lucide-react'
import ModuleDetail from './ModuleDetail'
import { apiGet } from '../lib/api'

const icons = [BookOpen, Shield, Users, FileText, Lock, Bell]
const progresses = [100, 65, 30, 0, 0, 0]

export default function Home() {
  const [selectedModule, setSelectedModule] = useState(null)
  const [modules, setModules] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadModules() {
      try {
        setLoading(true)
        const data = await apiGet('/api/content/modules')

        if (active) {
          setModules(data)
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

    loadModules()

    return () => {
      active = false
    }
  }, [])

  if (selectedModule) {
    return <ModuleDetail module={selectedModule} onBack={() => setSelectedModule(null)} />
  }

  return (
    <div>
      <div className="page-header">
        <h1>Módulos de Aprendizagem</h1>
        <p>Explore os conteúdos sobre LGPD e fortaleça seus conhecimentos em proteção de dados.</p>
      </div>

      {loading && <p>Carregando módulos...</p>}
      {!loading && error && <p>{error}</p>}

      {!loading && !error && (
        <div className="modules-grid">
          {modules.map((module, i) => {
            const Icon = icons[i % icons.length]
            const progress = progresses[i] || 0
            const isCompleted = progress === 100

            return (
              <div
                key={module.id}
                className="module-card"
                onClick={() => setSelectedModule(module)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setSelectedModule(module)}
                id={`module-card-${module.id}`}
              >
                <div className="module-card-header">
                  <div className="module-card-icon">
                    <Icon size={24} />
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span className="badge badge-module">Módulo {module.id}</span>
                    {isCompleted && (
                      <span className="badge badge-completed">
                        <CheckCircle size={11} style={{ marginRight: 3 }} />
                        Concluído
                      </span>
                    )}
                  </div>
                </div>

                <h2 className="module-card-title">{module.title}</h2>
                <p className="module-card-desc">{module.description}</p>

                <div className="module-card-footer">
                  <div className="progress-bar-wrapper">
                    <div className="progress-label">{progress}% concluído</div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                  <button
                    className="btn-acessar"
                    id={`btn-acessar-${module.id}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedModule(module)
                    }}
                  >
                    {progress > 0 ? 'Continuar' : 'Começar'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
