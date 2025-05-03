import React, { useState } from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, IconButton } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Editor } from '@monaco-editor/react';

const CodeEditor = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileContent, setFileContent] = useState('// Select a file to edit or create a new one.');
    const [isExplorerVisible, setIsExplorerVisible] = useState(false); // Default to hidden

    const files = [
        { name: 'index.js', type: 'file', content: '// This is the index.js file.' },
        { name: 'App.js', type: 'file', content: '// This is the App.js file.' },
        {
            name: 'components', type: 'folder', children: [
                { name: 'Header.js', type: 'file', content: '// This is the Header.js file.' },
                { name: 'Footer.js', type: 'file', content: '// This is the Footer.js file.' },
            ]
        },
    ];

    const handleFileClick = (file) => {
        if (file.type === 'file') {
            setSelectedFile(file.name);
            setFileContent(file.content);
        }
    };

    const handleEditorChange = (value) => {
        setFileContent(value);
    };

    return (
        <Box sx={{ display: 'flex', height: '100vh', width: '100%' }}>
            {/* Toggle Button */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                    zIndex: 10,
                }}
            >
                <IconButton
                    onClick={() => setIsExplorerVisible(!isExplorerVisible)}
                    size="small"
                    sx={{
                        backgroundColor: '#f5f5f5',
                        border: '1px solid #ddd',
                        '&:hover': { backgroundColor: '#e0e0e0' },
                    }}
                >
                    {isExplorerVisible ? <CloseIcon /> : <MenuIcon />}
                </IconButton>
            </Box>

            {/* File Explorer */}
            {isExplorerVisible && (
                <Box
                    sx={{
                        width: 240,
                        backgroundColor: '#f5f5f5',
                        borderRight: '1px solid #ddd',
                        overflowY: 'auto',
                        transition: 'width 0.3s ease',
                    }}
                >
                    <Typography variant="h6" sx={{ padding: 2, borderBottom: '1px solid #ddd' }}>
                        Scripts
                    </Typography>
                    <List>
                        {files.map((file) => (
                            <React.Fragment key={file.name}>
                                <ListItem disablePadding>
                                    <ListItemButton onClick={() => handleFileClick(file)}>
                                        <ListItemIcon>
                                            {file.type === 'file' ? <InsertDriveFileIcon /> : <FolderIcon />}
                                        </ListItemIcon>
                                        <ListItemText primary={file.name} />
                                    </ListItemButton>
                                </ListItem>
                                {file.type === 'folder' && file.children && (
                                    <List sx={{ paddingLeft: 4 }}>
                                        {file.children.map((child) => (
                                            <ListItem key={child.name} disablePadding>
                                                <ListItemButton onClick={() => handleFileClick(child)}>
                                                    <ListItemIcon>
                                                        <InsertDriveFileIcon />
                                                    </ListItemIcon>
                                                    <ListItemText primary={child.name} />
                                                </ListItemButton>
                                            </ListItem>
                                        ))}
                                    </List>
                                )}
                            </React.Fragment>
                        ))}
                    </List>
                </Box>
            )}

            {/* Code Editor */}
            <Box sx={{ flexGrow: 1 }}>
                <Typography
                    variant="h6"
                    sx={{
                        padding: 2,
                        borderBottom: '1px solid #ddd',
                        backgroundColor: '#f5f5f5',
                    }}
                >
                    {selectedFile || 'No File Selected'}
                </Typography>
                <Editor
                    height="calc(100% - 64px)" // Adjust height to account for the header
                    language="javascript"
                    theme="vs-light"
                    value={fileContent}
                    onChange={(e, value) => handleEditorChange(value)}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                    }}
                />
            </Box>
        </Box>
    );
};

export default CodeEditor;