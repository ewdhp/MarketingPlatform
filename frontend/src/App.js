import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import Layout from './components/Layout';
import ResizableLayoutMui from './components/ResizableLayout';
import TwilioSMS from './components/TwilioSMS';
import { AuthProvider, useAuth } from './context/AuthProvider';
import Terminal from './components/Terminal';
import { TerminalProvider } from './context/TerminalProvider';
import { Editor } from '@monaco-editor/react';

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

            {/* Protected Routes */}

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
                    <ResizableLayoutMui

                      rightComponent={
                        <Editor
                          height="100%"
                          width="100%"
                          defaultLanguage="javascript"
                          defaultValue="// Write your code here"
                          theme="vs-light"
                          options={{
                            minimap: { enabled: false },
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                          }}
                        />
                      }
                      leftComponent={<Terminal terminalId="main-terminal" />}
                    />
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