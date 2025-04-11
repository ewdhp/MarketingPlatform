
/**
    Key Features:

- AppBar with Toolbar: Includes buttons for adding nodes, deleting nodes, 
  and triggering actions like play and AI assistance.

- React Flow Canvas: Interactive node graph for creating and managing nodes. 
  Supports connecting nodes, deleting nodes, and viewing the graph's structure.

- Basic Node Management: The "Add Node" button generates nodes with a random 
  position and auto-increments IDs.

- Custom Styles: Added some basic styles for the nodes to look visually neat. 
  You can expand this further by customizing the node components (like machine 
  learning models or APIs).

- Basic UI Structure: A clean MUI-based layout that can be further enhanced 
  with additional components or settings as needed.

 */
import React, { useState } from 'react';
import 'reactflow/dist/style.css';
import { Box, IconButton, 
  AppBar, Toolbar, Typography } 
  from '@mui/material';
import { AddBox, PlayArrow, Layers, 
  DeleteOutline, Psychology, 
  UploadFile, Download } 
  from '@mui/icons-material';
import ReactFlow, { addEdge, 
  MiniMap, Controls } 
  from 'reactflow';
import { applyNodeChanges, applyEdgeChanges } from 'reactflow';


// Custom node style
const nodeStyles = {
  padding: '10px 20px',
  borderRadius: '5px',
  border: '1px solid #ddd',
  backgroundColor: '#fff',
  boxShadow: '0 1px 5px rgba(0, 0, 0, 0.1)',
};

const Automation = () => {
  // Define the initial elements (nodes and edges)
  const [elements, setElements] = useState([]);
  const [nodeId, setNodeId] = useState(0);

  const addNode = () => {
    const newNode = {
      id: `node_${nodeId}`,
      type: 'default',
      position: { 
        x: Math.random() * 250, 
        y: Math.random() * 250 },
      data: { label: `Node ${nodeId}` },
    };
    setNodeId(nodeId + 1);
    setElements((els) => [...els, newNode]);
  };

  const onConnect = (params) => setElements
    ((els) => addEdge(params, els));

  const onDelete = () => setElements
  ((els) => removeElements(els.filter
      ((el) => el.selected), els));
  const removeElements = (elementsToRemove, elements) => {
      return elements.filter(el => !elementsToRemove.includes(el.id));
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
      padding: '15px', // Add padding if needed

    }}
  >
    <Typography variant="h6" sx={{ flexGrow: 1, paddingLeft: '10px' }}>
      Controls
    </Typography><IconButton onClick={addNode}>
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
    
    <ReactFlow
      elements={elements}
      onConnect={onConnect}
      onElementsRemove={onDelete}
    >
      <MiniMap />
      <Controls />
    </ReactFlow>
  </Box>
</Box>

  );
};

export default Automation;
