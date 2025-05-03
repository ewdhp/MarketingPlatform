import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import Layout from './components/Layout';
import Automation from './views/Automation';
import CodeEditor from './components/CodeEditor';
import MainDashboard from './views/MainDashboard';
import TwilioSMS from './components/TwilioSMS';
import { AuthProvider, useAuth } from './context/AuthProvider';
import Terminal from './components/Terminal';
import { TerminalProvider } from './context/TerminalProvider';
import { ReactFlowProvider } from 'reactflow'; // Import ReactFlowProvider
import ResizableLayout from './components/ResizableLayout';

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
        <TerminalProvider>
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
                    <ResizableLayout />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Protected Routes */}
            <Route
              path="/automation"
              element={
                <ProtectedRoute>
                  <ReactFlowProvider>
                    <Layout>
                      {/* Wrap Automation with ReactFlowProvider */}
                      <Automation />

                    </Layout>
                  </ReactFlowProvider>
                </ProtectedRoute>
              }
            />

            <Route
              path="/terminal"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Terminal />
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
        </TerminalProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;