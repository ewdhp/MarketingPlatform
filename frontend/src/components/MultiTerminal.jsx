import React, { useState, useEffect, useRef } from 'react';
import { useTerminalSocket } from '../context/TerminalSocketProvider';
import { Tabs, Tab, Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';


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

const MultiTabTerminal = () => {
    const [terminals, setTerminals] = useState([]); // Track terminal IDs
    const [activeTab, setActiveTab] = useState(0); // Track the active tab

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
            <Box
                sx={{
                    flexGrow: 1, // Allow terminal content to take remaining height
                    backgroundColor: '#000',
                    overflow: 'hidden',
                }}
            >
                {terminals.map((id, index) => (
                    <div
                        key={id}
                        style={{
                            display: activeTab === index ? 'block' : 'none', // Show only active terminal
                            width: '100%',
                            height: '100%',
                        }}
                    >
                        <MultiTerminal terminalId={id} />
                    </div>
                ))}
            </Box>
        </Box>
    );
};

export default MultiTabTerminal;
