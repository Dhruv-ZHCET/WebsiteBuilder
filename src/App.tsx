import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import ProgressBar from './components/ProgressBar';
import IndustrySelection from './components/steps/IndustrySelection';
import CompanyDetails from './components/steps/CompanyDetails';
import ColorTheme from './components/steps/ColorTheme';
import ProductManagement from './components/steps/ProductManagement';
import ContentCustomization from './components/steps/ContentCustomization';
import NavigationButtons from './components/NavigationButtons';
import Login from './components/Login';
import Register from './components/Register';
import Builder from './components/Builder';

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
      </Routes>
    </Router>
  );
}

export default App;
