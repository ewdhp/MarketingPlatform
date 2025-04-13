import React, { createContext, useContext, useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';

// Create Context
const TerminalSocketContext = createContext();

// Provider Component
export const TerminalSocketProvider = ({ children }) => {
    const socketRef = useRef(null); // WebSocket instance
    const terminalRef = useRef(null); // Terminal instance

    const explicitCloseConnection = () => {
        console.log('Explicitly closing terminal and WebSocket...');
        if (socketRef.current) {
            socketRef.current.close(); // Close WebSocket connection
            socketRef.current = null; // Clear reference
        }
        if (terminalRef.current) {
            terminalRef.current.dispose(); // Dispose of terminal instance
            terminalRef.current = null; // Clear reference
        }
    };

    useEffect(() => {
        // Initialize WebSocket if not already created
        if (!socketRef.current) {
            socketRef.current = new WebSocket('wss://localhost:5500');

            socketRef.current.onopen = () => {
                console.log('WebSocket connection established');
            };

            socketRef.current.onmessage = (event) => {
                console.log('Message from server:', event.data);
                // Write incoming data to the terminal if it exists
                if (terminalRef.current) {
                    terminalRef.current.write(event.data);
                }
            };

            socketRef.current.onerror = (error) => {
                console.error('WebSocket error:', error);
            };

            socketRef.current.onclose = () => {
                console.log('WebSocket connection closed');
            };
        }

        // Terminal initialization handled by consumer components
    }, []);

    return (
        <TerminalSocketContext.Provider value={{ socketRef, terminalRef, explicitCloseConnection }}>
            {children}
        </TerminalSocketContext.Provider>
    );
};

// Custom Hook for Using Context
export const useTerminalSocket = () => {
    const context = useContext(TerminalSocketContext);
    if (!context) {
        throw new Error('useTerminalSocket must be used within a TerminalSocketProvider');
    }
    return context;
}