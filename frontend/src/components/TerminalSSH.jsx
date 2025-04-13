import React, { useEffect, useRef, useState } from 'react';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';

const TerminalSSH = () => {
    const terminalRef = useRef(null);
    const terminalInstance = useRef(null);
    const socketRef = useRef(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        // Initialize the terminal
        terminalInstance.current = new Terminal({
            cursorBlink: true,
            theme: {
                background: '#1e1e1e', // Dark background
                foreground: '#ffffff', // Light text
            },
        });

        // Attach the terminal to the DOM
        if (terminalRef.current) {
            terminalInstance.current.open(terminalRef.current);
        }

        // Connect to the WebSocket server
        socketRef.current = new WebSocket('ws://localhost:8080'); // Replace with your WebSocket server URL

        socketRef.current.onopen = () => {
            terminalInstance.current.writeln('Connected to WebSocket server');
            setConnected(true);

            // Send SSH connection details
            socketRef.current.send(
                JSON.stringify({
                    type: 'connect',
                    host: 'your-ssh-server.com', // Replace with your SSH server
                    username: 'your-username', // Replace with your SSH username
                    password: 'your-password', // Replace with your SSH password
                })
            );
        };

        socketRef.current.onmessage = (event) => {
            const message = JSON.parse(event.data);

            if (message.type === 'output') {
                terminalInstance.current.write(message.data);
            } else if (message.type === 'status') {
                terminalInstance.current.writeln(`\r\n[STATUS]: ${message.message}`);
            } else if (message.type === 'error') {
                terminalInstance.current.writeln(`\r\n[ERROR]: ${message.message}`);
            }
        };

        socketRef.current.onclose = () => {
            terminalInstance.current.writeln('\r\nConnection closed');
            setConnected(false);
        };

        // Handle terminal input
        terminalInstance.current.onData((data) => {
            if (connected) {
                socketRef.current.send(
                    JSON.stringify({
                        type: 'command',
                        command: data,
                    })
                );
            }
        });

        return () => {
            // Cleanup on component unmount
            terminalInstance.current.dispose();
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, [connected]);

    return (
        <div
            ref={terminalRef}
            style={{
                width: '100%',
                height: '100%',
                overflow: 'hidden',
            }}
        ></div>
    );
};

export default TerminalSSH;