import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import VoiceDiary from './pages/VoiceDiary';
import VisualDiary from './pages/VisualDiary';
import Login from './pages/Login';
import FamilyContacts from './pages/FamilyContacts';
import './index.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userContext, setUserContext] = useState(null);

  return (
    <HashRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={
          !isAuthenticated ? 
            <Login onLogin={(user) => {
              setIsAuthenticated(true);
              setUserContext(user);
            }} /> : 
            <Navigate to="/dashboard" replace />
        } />

        {/* Protected Routes inside Layout */}
        <Route path="/" element={
          isAuthenticated ? 
            <Layout user={userContext} onLogout={() => {
              setIsAuthenticated(false);
              setUserContext(null);
            }} /> : 
            <Navigate to="/login" replace />
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="diary" element={<VoiceDiary />} />
          <Route path="visual" element={<VisualDiary />} />
          <Route path="family" element={<FamilyContacts />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
