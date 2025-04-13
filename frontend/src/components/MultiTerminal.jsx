import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';
import { useTerminalSocket } from '../context/TerminalSocketProvider'; // Import context hook

const MultiTerminal = () => {
    const { socketRef, terminalRef, explicitCloseConnection } = useTerminalSocket(); // Get refs and cleanup function
    const terminalContainerRef = useRef(null); // Local DOM ref for terminal container

    useEffect(() => {
        // Initialize Terminal if not already created
        if (!terminalRef.current) {
            console.log('Initializing Terminal...');
            const terminal = new Terminal({
                cursorBlink: true,
                theme: {
                    background: '#1e1e1e',
                    foreground: '#ffffff',
                },
            });

            terminalRef.current = terminal; // Store terminal in shared context

            if (terminalContainerRef.current) {
                terminal.open(terminalContainerRef.current); // Attach terminal to DOM
                console.log('Terminal is ready');
            }

            // Handle terminal input
            terminal.onData((data) => {
                if (socketRef.current?.readyState === WebSocket.OPEN) {
                    if (data === '\r') {
                        socketRef.current.send(
                            JSON.stringify({
                                type: 'command',
                                command: terminal.inputBuffer || '',
                            })
                        );
                        terminal.inputBuffer = ''; // Clear input buffer
                    } else if (data === '\u007F') {
                        // Handle backspace
                        if (terminal.inputBuffer?.length > 0) {
                            terminal.inputBuffer = terminal.inputBuffer.slice(0, -1);
                            terminal.write('\b \b');
                        }
                    } else {
                        terminal.inputBuffer = (terminal.inputBuffer || '') + data;
                        terminal.write(data);
                    }
                }
            });
        }
    }, [socketRef, terminalRef]);

    return (
        <div>
            <div
                style={{
                    width: '100%',
                    height: '300px',
                    backgroundColor: '#000',
                    overflow: 'hidden',
                }}
                ref={terminalContainerRef} // Attach container ref
            />
            <button onClick={explicitCloseConnection} style={{ marginTop: '10px' }}>
                Close Connection
            </button>
        </div>
    );
};

export default MultiTerminal;