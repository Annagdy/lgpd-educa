import modules from '../data/modules'

export default function Home() {
  return (
    <div>
      <h1 className="content-title">Módulos de Aprendizagem</h1>

      <div className="modules-grid">
        {modules.map((module) => (
          <div key={module.id} className="module-card">
            <div className="module-card-header">
              <div>
                <span className="badge badge-module">
                  Módulo {module.id}
                </span>

                <h2 className="module-card-title">
                  {module.title}
                </h2>
              </div>
            </div>

            <p className="module-card-desc">
              {module.description}
            </p>

            <button className="btn-primary">
              Acessar conteúdo
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
