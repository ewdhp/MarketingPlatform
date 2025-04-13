import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';
import { useTerminalSocket } from '../context/TerminalSocketProvider';

const MultiTerminal = () => {
    const { terminalRef, socketRef } = useTerminalSocket();
    const terminalContainerRef = useRef(null); // Local DOM ref


    console.log('TerminalRef:', terminalRef);
    console.log('SocketRef:', socketRef);

    useEffect(() => {
        if (!terminalRef.current) {
            console.log('Initializing Terminal...');
            const terminal = new Terminal({
                cursorBlink: true,
                theme: {
                    background: '#1e1e1e',
                    foreground: '#ffffff',
                },
            });

            terminalRef.current = terminal; // Persist terminal in context

            if (terminalContainerRef.current) {
                terminal.open(terminalContainerRef.current);
                console.log('Terminal initialized');
            }

        } else if (terminalRef.current && terminalContainerRef.current) {
            // Reuse the existing terminal
            console.log('Reusing existing Terminal instance...');
            terminalRef.current.open(terminalContainerRef.current);
        }

        return () => {

        };
    }, [socketRef, terminalRef]);

    return (
        <div
            style={{
                width: '100%',
                height: '300px',
                backgroundColor: '#000',
                overflow: 'hidden',
            }}
            ref={terminalContainerRef} // Attach container ref
        />
    );
};

export default MultiTerminal;


