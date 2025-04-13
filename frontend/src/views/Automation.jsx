import React, { useState } from 'react';
import 'reactflow/dist/style.css';
import { Box, IconButton, Typography, Select, MenuItem } from '@mui/material';
import { AddBox, PlayArrow, Layers, DeleteOutline, Psychology, UploadFile, Download } from '@mui/icons-material';
import ReactFlow, { addEdge, MiniMap, Controls } from 'reactflow';

const Automation = () => {
  const [elements, setElements] = useState([]);
  const [nodeId, setNodeId] = useState(0);
  const [selectedModel, setSelectedModel] = useState('openai'); // Default model

  const addNode = () => {
    const newNode = {
      id: `node_${nodeId}`,
      type: 'default',
      position: { x: Math.random() * 250, y: Math.random() * 250 },
      data: { label: `Node ${nodeId}` },
    };
    setNodeId(nodeId + 1);
    setElements((els) => [...els, newNode]);
  };

  const onConnect = (params) => setElements((els) => addEdge(params, els));

  const onDelete = () => setElements((els) => removeElements(els.filter((el) => el.selected), els));

  const removeElements = (elementsToRemove, elements) => {
    return elements.filter((el) => !elementsToRemove.includes(el.id));
  };

  const handleModelChange = (event) => {
    setSelectedModel(event.target.value);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column', // Ensure vertical stacking for controls and canvas
        width: '100%', // Full width
        height: '100vh', // Full height
      }}
    >
      {/* Box with Controls */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row', // Horizontal stacking for controls
          alignItems: 'center',
          padding: '15px', // Add padding if needed
        }}
      >
        <Typography variant="h6" sx={{ flexGrow: 1, paddingLeft: '10px' }}>
          Controls
        </Typography>

        {/* Model Selector */}
        <Select
          value={selectedModel}
          onChange={handleModelChange}
          size="small"
          sx={{ marginLeft: 2, minWidth: 150 }}
        >
          <MenuItem value="openai">OpenAI Gemini</MenuItem>
          <MenuItem value="local">Local Model</MenuItem>
        </Select>

        <IconButton onClick={addNode}>
          <AddBox />
        </IconButton>
        <IconButton>
          <PlayArrow />
        </IconButton>
        <IconButton>
          <Layers />
        </IconButton>
        <IconButton onClick={onDelete}>
          <DeleteOutline />
        </IconButton>
        <IconButton>
          <Psychology />
        </IconButton>
        <IconButton>
          <UploadFile />
        </IconButton>
        <IconButton>
          <Download />
        </IconButton>
      </Box>

      {/* React Flow Canvas */}
      <Box
        sx={{
          flexGrow: 1, // Expand to fill remaining height
          backgroundColor: '#f5f5f5', // Set a background color
          width: '100%', // Full width
        }}
      >
        <ReactFlow elements={elements} onConnect={onConnect} onElementsRemove={onDelete}>
          <MiniMap />
          <Controls />
        </ReactFlow>
      </Box>
    </Box>
  );
};

export default Automation;