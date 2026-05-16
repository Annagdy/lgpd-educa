import { Routes, Route, Link, NavLink, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import Home from './pages/Home'
import Quiz from './pages/Quiz'
import Glossary from './pages/Glossary'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ConfirmEmail from './pages/ConfirmEmail'

export default function App() {
  const { isAuthenticated, user, logout } = useAuth()

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() || 'U'

  return (
    <div className="app-shell">
      {isAuthenticated && (
        <header className="topnav">
          <div className="topnav-logo">
            <span className="topnav-logo-text">LGPD Educa</span>
          </div>

          <nav className="topnav-links">
            <NavLink
              className={({ isActive }) => `topnav-link${isActive ? ' active' : ''}`}
              to="/"
              end
              id="nav-modulos"
            >
              Módulos
            </NavLink>
            <NavLink
              className={({ isActive }) => `topnav-link${isActive ? ' active' : ''}`}
              to="/quiz"
              id="nav-quiz"
            >
              Quiz
            </NavLink>
            <NavLink
              className={({ isActive }) => `topnav-link${isActive ? ' active' : ''}`}
              to="/glossario"
              id="nav-glossario"
            >
              Glossário
            </NavLink>
          </nav>

          <div className="topnav-user">
            <div className="user-avatar" title={user?.username || user?.email}>
              {initials}
            </div>
            <button className="btn-logout" onClick={logout} id="btn-logout">
              Sair
            </button>
          </div>
        </header>
      )}

      <main className={isAuthenticated ? 'page-content' : ''}>
        <Routes>
          {/* Auth routes */}
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/" replace /> : <Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/confirm-email" element={<ConfirmEmail />} />

          {/* Protected routes */}
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/quiz" element={<PrivateRoute><Quiz /></PrivateRoute>} />
          <Route path="/glossario" element={<PrivateRoute><Glossary /></PrivateRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
