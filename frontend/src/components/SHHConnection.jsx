import React, { useEffect, useRef, useState } from 'react';

const SSHConnection = () => {
    const socketRef = useRef(null); // Reference to the WebSocket connection
    const [connected, setConnected] = useState(false); // Connection state
    const [messages, setMessages] = useState([]); // List of received messages
    const [input, setInput] = useState(''); // Input message

    useEffect(() => {
        // Initialize WebSocket connection
        socketRef.current = new WebSocket('wss://localhost:5500');

        socketRef.current.onopen = () => {
            console.log('Connected to WebSocket server');
            setConnected(true);

            // Send connection details
            socketRef.current.send(
                JSON.stringify({
                    type: 'connect',
                    host: '127.0.0.1',
                    username: 'ewd',
                    password: '2020',
                })
            );
        };

        socketRef.current.onmessage = (event) => {
            console.log('Message received:', event.data);
            setMessages((prevMessages) => [...prevMessages, event.data]); // Append received message
        };

        socketRef.current.onclose = () => {
            console.log('Connection closed');
            setConnected(false);
        };

        socketRef.current.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        // Cleanup on component unmount
        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, []);

    const sendMessage = () => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(
                JSON.stringify({
                    type: 'command',
                    command: input,
                })
            );
            setInput(''); // Clear the input field
        } else {
            console.warn('WebSocket is not connected or ready.');
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2>SSH Connection</h2>
            <div>
                <strong>Status:</strong> {connected ? 'Connected' : 'Disconnected'}
            </div>
            <div style={{ marginTop: '20px' }}>
                <textarea
                    rows="10"
                    cols="50"
                    value={messages.join('\n')}
                    readOnly
                    style={{
                        width: '100%',
                        height: '200px',
                        resize: 'none',
                        backgroundColor: '#f0f0f0',
                        padding: '10px',
                        border: '1px solid #ccc',
                        fontFamily: 'monospace',
                    }}
                />
            </div>
            <div style={{ marginTop: '20px' }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter command"
                    style={{
                        width: '80%',
                        padding: '10px',
                        border: '1px solid #ccc',
                        fontFamily: 'monospace',
                    }}
                />
                <button
                    onClick={sendMessage}
                    style={{
                        padding: '10px 20px',
                        marginLeft: '10px',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer',
                    }}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default SSHConnection;