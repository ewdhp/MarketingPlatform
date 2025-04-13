import React, { createContext, useContext, useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';

// Create Context
const TerminalSocketContext = createContext();

// Provider Component
export const TerminalSocketProvider = ({ children }) => {
    const terminals = useRef(new Map()); // Map to store terminal and socket instances by ID

    const createTerminal = (id) => {
        if (terminals.current.has(id)) {
            console.warn(`Terminal with ID "${id}" already exists.`);
            return terminals.current.get(id);
        }

        console.log(`Creating terminal with ID "${id}"...`);

        // Create a new terminal instance
        const terminal = new Terminal({
            cursorBlink: true,
            theme: {
                background: '#ffffff',
                foreground: '#000000',
            },
        });

        // Create a new WebSocket instance
        const socket = new WebSocket('wss://localhost:5500');

        // Input buffer for the terminal
        const inputBuffer = { current: '' };

        // Handle WebSocket events
        socket.onopen = () => {
            console.log(`WebSocket connection established for terminal "${id}"`);
            terminal.writeln('Connected to WebSocket server');
            socket.send(
                JSON.stringify({
                    type: 'connect',
                    host: '127.0.0.1',
                    username: 'ewd',
                    password: '2020',
                })
            );
            terminal.write('\r\n> ');
            terminal.focus();

            // Handle terminal input
            terminal.onData((data) => {
                if (data === '\r') {
                    // Send the buffered input to the WebSocket on Enter
                    if (inputBuffer.current.trim() !== '') {
                        socket.send(
                            JSON.stringify({
                                type: 'command',
                                command: inputBuffer.current,
                            })
                        );
                        inputBuffer.current = ''; // Clear the buffer
                    }
                    terminal.write('\r\n> '); // Display a new prompt
                } else if (data === '\u007F') {
                    // Handle backspace
                    if (inputBuffer.current.length > 0) {
                        inputBuffer.current = inputBuffer.current.slice(0, -1);
                        terminal.write('\b \b'); // Erase the last character
                    }
                } else {
                    // Add the input to the buffer and display it
                    inputBuffer.current += data;
                    terminal.write(data);
                }
            });
        };

        socket.onmessage = (event) => {
            console.log(`Message received for terminal "${id}":`, event.data);
            try {
                const msg = JSON.parse(event.data);
                switch (msg.type) {
                    case 'output':
                        terminal.write(msg.data);
                        break;
                    case 'connected':
                        terminal.writeln('\r\n[SSH CONNECTED]');
                        terminal.write('\r\n> ');
                        break;
                    case 'disconnected':
                        terminal.writeln('\r\n[SSH DISCONNECTED]');
                        break;
                    case 'error':
                        terminal.writeln(`\r\n[ERROR]: ${msg.message}`);
                        break;
                    case 'status':
                        terminal.writeln(`\r\n[STATUS]: ${msg.message}`);
                        break;
                    default:
                        terminal.write(event.data); // Fallback case
                        break;
                }
            } catch (e) {
                terminal.write(event.data);
            }
        };

        socket.onerror = (error) => {
            console.error(`WebSocket error for terminal "${id}":`, error);
        };

        socket.onclose = () => {
            console.log(`WebSocket connection closed for terminal "${id}"`);
            terminal.writeln('[WebSocket Closed]');
        };

        // Store the terminal and socket in the map
        terminals.current.set(id, { terminal, socket, inputBuffer });

        return { terminal, socket };
    };

    const getTerminal = (id) => {
        return terminals.current.get(id);
    };

    const disposeTerminal = (id) => {
        const terminalData = terminals.current.get(id);
        if (terminalData) {
            console.log(`Disposing terminal with ID "${id}"...`);
            terminalData.terminal.dispose();
            terminalData.socket.close();
            terminals.current.delete(id);
        } else {
            console.warn(`Terminal with ID "${id}" does not exist.`);
        }
    };

    return (
        <TerminalSocketContext.Provider value={{ createTerminal, getTerminal, disposeTerminal }}>
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