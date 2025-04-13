import React, { useEffect, useRef } from 'react';
import { useTerminalSocket } from '../context/TerminalSocketProvider';

const MultiTerminal = ({ terminalId }) => {
    const { createTerminal, disposeTerminal } = useTerminalSocket();
    const terminalContainerRef = useRef(null);

    useEffect(() => {
        if (!terminalContainerRef.current) {
            console.error('Terminal container is not available.');
            return;
        }

        // Create or get the terminal for the given ID
        const { terminal } = createTerminal(terminalId);

        if (terminal && terminalContainerRef.current) {
            terminal.open(terminalContainerRef.current);
            console.log(`Terminal "${terminalId}" initialized.`);
        } else {
            console.error(`Failed to initialize terminal "${terminalId}".`);
        }

    }, [createTerminal, disposeTerminal, terminalId]);

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#000',
                overflow: 'hidden',
            }}
            ref={terminalContainerRef}
        />
    );
};

export default MultiTerminal;