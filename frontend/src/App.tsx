import { BrowserRouter as Router, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Glossary from './pages/Glossary';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ConfirmEmail from './pages/ConfirmEmail';
import './index.css';

function App() {
  const { isAuthenticated, user, logout } = useAuth();
  const initials = (user?.name || user?.username || user?.email || 'U').slice(0, 2).toUpperCase();

  return (
    <Router>
      <div className="app-shell">
        {isAuthenticated && (
          <header className="topnav">
            <div className="topnav-logo">
              <span className="topnav-logo-text">LGPD Educa</span>
            </div>

            <nav className="topnav-links">
              <NavLink className={({ isActive }) => `topnav-link${isActive ? ' active' : ''}`} to="/" end>
                Modulos
              </NavLink>
              <NavLink className={({ isActive }) => `topnav-link${isActive ? ' active' : ''}`} to="/glossario">
                Glossario
              </NavLink>
              <NavLink className={({ isActive }) => `topnav-link${isActive ? ' active' : ''}`} to="/perfil">
                Perfil
              </NavLink>
            </nav>

            <div className="topnav-user">
              <div className="user-avatar" title={user?.name || user?.email}>{initials}</div>
              <button className="btn-logout" onClick={logout}>Sair</button>
            </div>
          </header>
        )}

        <main className={isAuthenticated ? 'page-content' : ''}>
          <Routes>
            <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
            <Route path="/register" element={isAuthenticated ? <Navigate to="/" replace /> : <Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/confirm-email" element={<ConfirmEmail />} />
            <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/glossario" element={<PrivateRoute><Glossary /></PrivateRoute>} />
            <Route path="/perfil" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
