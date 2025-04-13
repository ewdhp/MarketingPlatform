import React, { createContext, useContext, useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';

// Create Context
const TerminalSocketContext = createContext();

// Provider Component
export const TerminalSocketProvider = ({ children }) => {
    const socketRef = useRef(null); // WebSocket instance
    const terminalRef = useRef(null); // Persistent Terminal instance

    // Explicit close function for controlled cleanup
    const explicitCloseConnection = () => {
        console.log('Explicitly closing terminal and WebSocket...');
        if (socketRef.current) {
            socketRef.current.close(); // Close WebSocket connection
            socketRef.current = null; // Clear reference
        }
        if (terminalRef.current) {
            terminalRef.current.dispose(); // Dispose terminal instance
            terminalRef.current = null; // Clear reference
        }
    };

    useEffect(() => {
        console.log('TerminalSocketProvider useEffect triggered');
        if (!socketRef.current || socketRef.current?.readyState !== WebSocket.OPEN) {
            console.log('Initializing WebSocket...');
            socketRef.current = new WebSocket('wss://localhost:5500');

            socketRef.current.onopen = () => {
                console.log('WebSocket connection established');
                if (terminalRef.current) {
                    terminalRef.current.writeln('Connected to WebSocket server');
                    socketRef.current.send(
                        JSON.stringify({
                            type: 'connect',
                            host: '127.0.0.1',
                            username: 'ewd',
                            password: '2020',
                        })
                    );
                    terminalRef.current.write('\r\n> ');
                    terminalRef.current.focus();
                } else {
                    console.warn('Terminal is not initialized during WebSocket onopen');
                }
            };

            // Handle incoming WebSocket messages
            socketRef.current.onmessage = (event) => {
                console.log('Raw WebSocket message:', event.data);
                if (!terminalRef.current) {
                    console.error('Terminal is not initialized');
                    return;
                }

                try {
                    const msg = JSON.parse(event.data);
                    switch (msg.type) {
                        case 'output':
                            terminalRef.current.write(msg.data);
                            break;
                        case 'connected':
                            terminalRef.current.writeln('\r\n[SSH CONNECTED]');
                            terminalRef.current.write('\r\n> ');
                            break;
                        case 'disconnected':
                            terminalRef.current.writeln('\r\n[SSH DISCONNECTED]');
                            break;
                        case 'error':
                            terminalRef.current.writeln(`\r\n[ERROR]: ${msg.message}`);
                            break;
                        case 'status':
                            terminalRef.current.writeln(`\r\n[STATUS]: ${msg.message}`);
                            break;
                        default:
                            terminalRef.current.write(event.data); // Fallback case
                            break;
                    }
                } catch (e) {

                    terminalRef.current.write(event.data);
                }
            };

            socketRef.current.onerror = (error) => {
                console.error('WebSocket error:', error);
            };

            socketRef.current.onclose = () => {
                console.log('WebSocket connection closed');
                if (terminalRef.current) {
                    terminalRef.current.writeln('[WebSocket Closed]');
                }
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
};