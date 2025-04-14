import React, { useCallback, useState } from 'react';
import '@xyflow/react/dist/style.css';
import { Box, Typography, Select, MenuItem } from '@mui/material';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
} from '@xyflow/react';

// Import the base components for the specific node types
import { PromptNode, CodeNode, LoadFileNode, OutputNode, LogNode, InputNode } from '../components/Nodes';

// Custom Node Renderer
const CustomNode = ({ data }) => {
  const { type, label } = data;

  // Render different node types based on the type property
  switch (type) {
    case 'AI':
      return <PromptNode label={label} />;
    case 'Code':
      return <CodeNode label={label} />;
    case 'Data':
      return <LoadFileNode label={label} />;
    case 'Feedback':
      return label.includes('Log') ? <LogNode label={label} /> : <OutputNode label={label} />;
    case 'Control':
      return <InputNode label={label} />;
    default:
      return <Box>Unknown Node Type</Box>;
  }
};

const initialNodes = [
  { id: '1', position: { x: 150, y: 150 }, data: { label: 'AI Node', type: 'AI' }, type: 'custom' },
  { id: '2', position: { x: 400, y: 150 }, data: { label: 'Code Node', type: 'Code' }, type: 'custom' },
  { id: '3', position: { x: 250, y: 300 }, data: { label: 'Data Node', type: 'Data' }, type: 'custom' },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
];

const Automation = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedModel, setSelectedModel] = useState('openai');
  const [contextMenu, setContextMenu] = useState(null);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addNodeAtPosition = (position, type) => {
    const newNode = {
      id: `node_${nodes.length + 1}`,
      position,
      data: { label: `Node ${nodes.length + 1}`, type },
      type: 'custom',
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const handleRightClick = (e) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleContextMenuAction = (action, type) => {
    if (action === 'addNode' && contextMenu) {
      const canvasPosition = { x: contextMenu.x, y: contextMenu.y };
      addNodeAtPosition(canvasPosition, type);
    }
    setContextMenu(null);
  };

  const handleModelChange = (event) => {
    setSelectedModel(event.target.value);
  };

  return (
    <ReactFlowProvider>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100vh',
        }}
      >
        {/* Controls */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '15px',
          }}
        >
          <Typography variant="h6" sx={{ flexGrow: 1, paddingLeft: '10px' }}>
            Controls
          </Typography>

          <Select
            value={selectedModel}
            onChange={handleModelChange}
            size="small"
            sx={{ marginLeft: 2, minWidth: 150 }}
          >
            <MenuItem value="openai">OpenAI Gemini</MenuItem>
            <MenuItem value="local">Local Model</MenuItem>
          </Select>
        </Box>

        {/* React Flow Canvas */}
        <Box
          sx={{
            flexGrow: 1,
            backgroundColor: '#f5f5f5',
            width: '100%',
            position: 'relative',
          }}
          onContextMenu={handleRightClick}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={{ custom: CustomNode }}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
          >
            <MiniMap />
            <Controls />
            <Background variant="dots" gap={12} size={1} />

            {contextMenu && (
              <Box
                sx={{
                  position: 'absolute',
                  top: contextMenu.y,
                  left: contextMenu.x,
                  background: '#fff',
                  border: '1px solid #ccc',
                  padding: '10px',
                  borderRadius: '4px',
                  zIndex: 10,
                }}
              >
                {/* Context menu options for different node types */}
                <Typography
                  variant="body1"
                  sx={{ cursor: 'pointer', marginBottom: '5px' }}
                  onClick={() => handleContextMenuAction('addNode', 'AI')}
                >
                  Add AI Node (Prompt)
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ cursor: 'pointer', marginBottom: '5px' }}
                  onClick={() => handleContextMenuAction('addNode', 'Code')}
                >
                  Add Code Node
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ cursor: 'pointer', marginBottom: '5px' }}
                  onClick={() => handleContextMenuAction('addNode', 'Data')}
                >
                  Add Data Node (Load File)
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ cursor: 'pointer', marginBottom: '5px' }}
                  onClick={() => handleContextMenuAction('addNode', 'Feedback')}
                >
                  Add Feedback Node (Output/Log)
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ cursor: 'pointer', marginBottom: '5px' }}
                  onClick={() => handleContextMenuAction('addNode', 'Control')}
                >
                  Add Control Node (Input)
                </Typography>
              </Box>
            )}
          </ReactFlow>
        </Box>
      </Box>
    </ReactFlowProvider>
  );
};

export default Automation;
