import React, { useEffect, useRef, useState } from 'react';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';

const TerminalSSH = () => {
    const terminalRef = useRef(null);
    const terminalInstance = useRef(null);
    const socketRef = useRef(null);
    const [connected, setConnected] = useState(false);
    const inputBufferRef = useRef(''); // Use ref so buffer doesn't reset on re-renders

    useEffect(() => {
        // Init terminal
        terminalInstance.current = new Terminal({
            cursorBlink: true,
            theme: {
                background: '#1e1e1e',
                foreground: '#ffffff',
            },
        });

        if (terminalRef.current) {
            terminalInstance.current.open(terminalRef.current);
            // Ensure the terminal is focused after mounting
            requestAnimationFrame(() => {
                terminalInstance.current?.focus();
            });
        }

        const handleResize = () => {
            if (terminalInstance.current && terminalRef.current) {
                const cols = Math.floor(terminalRef.current.offsetWidth / 10);
                const rows = Math.floor(terminalRef.current.offsetHeight / 20);
                terminalInstance.current.resize(cols, rows);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        // Init WebSocket
        socketRef.current = new WebSocket('wss://localhost:5500');

        socketRef.current.onopen = () => {
            terminalInstance.current.writeln('Connected to WebSocket server');
            setConnected(true);

            socketRef.current.send(
                JSON.stringify({
                    type: 'connect',
                    host: '127.0.0.1',
                    username: 'ewd',
                    password: '2020',
                })
            );

            terminalInstance.current.write('\r\n> ');
            terminalInstance.current.focus();

            // ✅ Attach input handler ONLY after connection
            terminalInstance.current.onData((data) => {
                if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                    if (data === '\r') {
                        socketRef.current.send(
                            JSON.stringify({
                                type: 'command',
                                command: inputBufferRef.current,
                            })
                        );
                        inputBufferRef.current = '';
                        terminalInstance.current.write('\r\n> ');
                    } else if (data === '\u007F') {
                        if (inputBufferRef.current.length > 0) {
                            inputBufferRef.current = inputBufferRef.current.slice(0, -1);
                            terminalInstance.current.write('\b \b');
                        }
                    } else {
                        inputBufferRef.current += data;
                        terminalInstance.current.write(data);
                    }
                } else {
                    console.warn('WebSocket is not connected or ready. Input ignored.');
                }
            });
        };

        socketRef.current.onmessage = (event) => {
            console.log('Raw WebSocket message:', event.data);
            try {
                const msg = JSON.parse(event.data);
                switch (msg.type) {
                    case 'output':
                        terminalInstance.current.write(msg.data);
                        break;
                    case 'connected':
                        // terminalInstance.current.writeln('\r\n[SSH CONNECTED]');
                        // terminalInstance.current.write('\r\n> ');
                        break;
                    case 'disconnected':
                        terminalInstance.current.writeln('\r\n[SSH DISCONNECTED]');
                        break;
                    case 'error':
                        terminalInstance.current.writeln(`\r\n[ERROR]: ${msg.message}`);
                        break;
                    case 'status':
                        terminalInstance.current.writeln(`\r\n[STATUS]: ${msg.message}`);
                        break;
                    default:
                        terminalInstance.current.write(event.data); // fallback
                        break;
                }
            } catch {
                terminalInstance.current.write(event.data);
            }
        };




        socketRef.current.onclose = () => {
            terminalInstance.current.writeln('\r\nConnection closed');
            setConnected(false);
            socketRef.current = null;
        };

        socketRef.current.onerror = (error) => {
            terminalInstance.current.writeln(`\r\n[ERROR]: ${error.message}`);
        };


        return () => {
            window.removeEventListener('resize', handleResize);

        };
    }, []);

    return (
        <div
            ref={terminalRef}
            style={{
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                zIndex: 1, // Ensure the terminal is visible and not obstructed
            }}
            onClick={() => terminalInstance.current?.focus()} // Refocus the terminal on click
        />
    );
};

export default TerminalSSH;