import { useState } from 'react'
import { BookOpen, Shield, Users, FileText, Lock, Bell, ChevronRight, CheckCircle } from 'lucide-react'
import modules from '../data/modules'
import ModuleDetail from './ModuleDetail'

const icons = [BookOpen, Shield, Users, FileText, Lock, Bell]
const progresses = [100, 65, 30, 0, 0, 0]

export default function Home() {
  const [selectedModule, setSelectedModule] = useState(null)

  if (selectedModule) {
    return <ModuleDetail module={selectedModule} onBack={() => setSelectedModule(null)} />
  }

  return (
    <div>
      <div className="page-header">
        <h1>Módulos de Aprendizagem</h1>
        <p>Explore os conteúdos sobre LGPD e fortaleça seus conhecimentos em proteção de dados.</p>
      </div>

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
                  onClick={(e) => { e.stopPropagation(); setSelectedModule(module) }}
                >
                  {progress > 0 ? 'Continuar' : 'Começar'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
