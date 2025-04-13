import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import Layout from './components/Layout';
import Automation from './views/Automation';
import CodeEditor from './components/CodeEditor';
import MainDashboard from './views/MainDashboard';
import TwilioSMS from './components/login/TwilioSMS';
import { AuthProvider, useAuth } from './context/AuthContext';
import MultiTerminal from './components/MultiTerminal';
import { TerminalSocketProvider } from './context/TerminalSocketProvider';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/" />;
};

const RedirectIfAuthenticated = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" /> : children;
};

const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>404 - Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <TerminalSocketProvider> {/* Lift TerminalSocketProvider to wrap the entire app */}
          <CssBaseline />
          <Routes>
            {/* Entry Page (Login) */}
            <Route
              path="/"
              element={
                <RedirectIfAuthenticated>
                  <TwilioSMS />
                </RedirectIfAuthenticated>
              }
            />
            <Route
              path="/editor"
              element={
                <ProtectedRoute>
                  <Layout>
                    <CodeEditor />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Protected Routes */}
            <Route
              path="/automation"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Automation />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/terminal"
              element={
                <ProtectedRoute>
                  <Layout>
                    <MultiTerminal />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <MainDashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Fallback Route for Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TerminalSocketProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;