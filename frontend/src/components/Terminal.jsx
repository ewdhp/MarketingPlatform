import React, { useState, useEffect, useRef } from 'react';
import { useTerminalSocket } from '../context/TerminalProvider';
import { Tabs, Tab, Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { FitAddon } from 'xterm-addon-fit';
import SigmaGraph from './SigmaGraph';
import { Editor } from "@monaco-editor/react";
const Terminal = ({ terminalId }) => {
    const { createTerminal, disposeTerminal } = useTerminalSocket();
    const terminalContainerRef = useRef(null);
    const editorRef = useRef(null);
    useEffect(() => {
        if (!terminalContainerRef.current) {
            console.error('Terminal container is not available.');
            return;
        }

        // Create or get the terminal for the given ID
        const { terminal } = createTerminal(terminalId);

        if (terminal && terminalContainerRef.current) {
            terminal.open(terminalContainerRef.current);
            // Add custom styles to hide the scrollbar
            const viewport = terminalContainerRef
                .current.querySelector('.xterm-viewport');
            if (viewport) {
                viewport.style.scrollbarWidth = 'none'; // Firefox
                viewport.style.msOverflowStyle = 'none'; // IE and Edge
            }
            // Use the FitAddon to fit the terminal to the container
            const fitAddon = new FitAddon();
            terminal.loadAddon(fitAddon);
            fitAddon.fit(); // Automatically adjusts rows and columns

            // Optionally, add a resize event listener
            window.addEventListener('resize', () => fitAddon.fit());
            console.log(`Terminal "${terminalId}" initialized.`);
        } else {
            console.error(`Failed to initialize terminal "${terminalId}".`);
            return
        }
    }, [createTerminal, disposeTerminal, terminalId]);

    return (
        <>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                height: '100%',
                background: 'gray',
                overflow: 'hidden',
                padding: '5px',
            }}>
                <div style={{
                    display: 'flex', flexDirection: 'column',
                    height: '100%', width: '100%'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'row', width: '100%', height: '65%' }}>
                        <SigmaGraph />

                    </div>


                    <div
                        style={{
                            width: '100%',
                            height: '35%',
                            background: '#041f4b',
                            overflow: 'hidden',
                            padding: '5px',
                        }}
                        ref={terminalContainerRef}

                    ></div>

                </div>

            </div>
        </>
    );
};

const TerminalTabs = () => {
    const [terminals, setTerminals] = useState([]); // Track terminal IDs
    const [activeTab, setActiveTab] = useState(0); // Track the active tab
    const { createTerminal, getAllTerminals } = useTerminalSocket();

    useEffect(() => {
        // Get all active terminals when the component is mounted
        const activeTerminals = getAllTerminals();
        setTerminals(activeTerminals);

        // Reinitialize terminals for the retrieved IDs
        activeTerminals.forEach((id) => {
            createTerminal(id);
        });
    }, [getAllTerminals, createTerminal]);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue); // Update active tab when clicked
    };

    const handleAddTerminal = () => {
        const newTerminalId = `terminal${terminals.length + 1}`;
        setTerminals((prev) => [...prev, newTerminalId]); // Add new terminal
        setActiveTab(terminals.length); // Switch to the newly added terminal
    };

    return (
        <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Tabs Section at the Top */}
            <Box sx={{ display: 'flex', alignItems: 'center', padding: '8px', borderBottom: '1px solid #ccc' }}>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="Terminal Tabs"
                    sx={{ flexGrow: 1 }} // Make tabs take the available width
                >
                    {terminals.map((id, index) => (
                        <Tab key={id} label={`Terminal ${index + 1}`} />
                    ))}
                </Tabs>
                <Button
                    onClick={handleAddTerminal}
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    sx={{ marginLeft: 2 }}
                >
                    Add Terminal
                </Button>
            </Box>

            {/* Terminal Content Section */}

            {terminals.map((id, index) => (
                <Box
                    key={id}
                    sx={{
                        display: activeTab === index ? 'block' : 'none', // Show only active terminal
                        width: '100%',
                        height: '100%',
                    }}
                >
                    <Terminal terminalId={id} />
                </Box>
            ))}

        </Box>
    );
};

export default TerminalTabs;

