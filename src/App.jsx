import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Quiz from './pages/Quiz'
import Glossary from './pages/Glossary'

export default function App() {
  return (
    <div className="app-shell">
      <header className="topnav">
        <div className="topnav-logo">
          <span className="topnav-logo-text">LGPD Educa</span>
        </div>

        <nav className="topnav-links">
          <Link className="topnav-link" to="/">Módulos</Link>
          <Link className="topnav-link" to="/quiz">Quiz</Link>
          <Link className="topnav-link" to="/glossario">Glossário</Link>
        </nav>
      </header>

      <main className="page-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/glossario" element={<Glossary />} />
        </Routes>
      </main>
    </div>
  )
}
