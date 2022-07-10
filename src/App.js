import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import Signup from './components/Signup'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import { HashRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/" exact element={<Dashboard />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;
