
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Builder from './components/Builder';
import { Dashboard } from './components/Dashboard';

function App() {
  const isAuthenticated = !!localStorage.getItem('authToken');

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? '/builder' : '/login'} />} 
        />

        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/builder" /> : <Login />} 
        />

        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/builder" /> : <Register />} 
        />

        <Route
          path="/builder"
          element={isAuthenticated ? <Builder /> : <Navigate to="/login" />} 
        />
        <Route path='/dashboard' element={<Dashboard/>}/>
      </Routes>
    </Router>
  );
}

export default App;
