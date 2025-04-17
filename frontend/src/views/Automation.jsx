
import React, { useState } from 'react';
import '@xyflow/react/dist/style.css'; // Importing ReactFlow styles
import { ReactFlow, useNodesState, useEdgesState, ReactFlowProvider } from '@xyflow/react';
const initialNodes = [
  // Child Nodes (Stacked Vertically)
  {
    id: '1',
    type: 'PromptNode',
    position: { x: 80, y: 100 }, // Position relative to group
    data: {
      label: 'AI Prompt',
      icon: <svg>/* Replace with your PromptNode SVG */</svg>,
      inputs: ['Prompt Input'],
      outputs: ['AI Response'],
      config: { model: 'openai', maxTokens: 150 },
      style: { border: '2px solid purple', borderRadius: '8px' },
      onExecute: () => console.log('PromptNode executed!'),
      parentNode: 'group-1', // Assign to group
    },
  },
  {
    id: '2',
    type: 'LoadFileNode',
    position: { x: 80, y: 200 },
    data: {
      label: 'File Loader',
      icon: <svg>/* Replace with your LoadFileNode SVG */</svg>,
      inputs: [],
      outputs: ['File Data'],
      config: { fileType: 'csv' },
      style: { border: '2px solid blue', borderRadius: '8px' },
      onExecute: () => console.log('LoadFileNode executed!'),
      parentNode: 'group-1',
    },
  },
  {
    id: '4',
    type: 'LogNode',
    position: { x: 80, y: 400 },
    data: {
      label: 'Log Message',
      icon: <svg>/* Replace with your LogNode SVG */</svg>,
      inputs: ['Message'],
      outputs: ['Log Output'],
      config: { logLevel: 'info' },
      style: { border: '2px solid orange', borderRadius: '8px' },
      onExecute: () => console.log('LogNode executed!'),
      parentNode: 'group-1',
    },

  },
  {
    id: '3',
    type: 'TransformNode',
    position: { x: 80, y: 300 },
    data: {
      label: 'Data Transformer',
      icon: <svg>/* Replace with your TransformNode SVG */</svg>,
      inputs: ['Input Data'],
      outputs: ['Transformed Data'],
      config: { transformationType: 'uppercase' },
      style: { border: '2px solid green', borderRadius: '8px' },
      onExecute: () => console.log('TransformNode executed!'),
      parentNode: 'group-1',
    },
  }
];

// Define initial edges (none for now)
const initialEdges = [];

const Automation = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [contextMenuVisible, setContextMenuVisible] = useState(false); // Context menu visibility state
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 }); // Menu position state
  const [selectedEdge, setSelectedEdge] = useState(null); // Keep track of the clicked edge

  // Show the context menu on right-click
  const handleContextMenu = (event, edge = null) => {
    event.preventDefault(); // Prevent the default browser context menu
    setMenuPosition({ x: event.clientX, y: event.clientY }); // Get mouse position
    setContextMenuVisible(true); // Show the custom menu
    setSelectedEdge(edge); // Track the clicked edge (if applicable)
  };

  // Hide context menu on click outside
  const handleClickOutside = () => {
    if (contextMenuVisible) {
      setContextMenuVisible(false);
    }
  };

  // Action to delete edge
  const handleDeleteEdge = () => {
    if (selectedEdge) {
      setEdges((eds) => eds.filter((edge) => edge.id !== selectedEdge.id)); // Remove the clicked edge
    }
    setContextMenuVisible(false); // Hide the menu
  };

  return (
    <div
      onContextMenu={(e) => handleContextMenu(e)} // Detect right-clicks anywhere
      onClick={handleClickOutside} // Detect clicks outside to hide menu
      style={{ width: '99.8%', height: '100vh', backgroundColor: '#f8f8f8' }}
    >
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={(params) => setEdges((eds) => [...eds, params])}
          connectionLineType="smoothstep"
          onEdgeClick={(event, edge) => handleContextMenu(event, edge)} // Show menu on edge right-click
          fitView
        />
      </ReactFlowProvider>

      {/* Context Menu */}
      {contextMenuVisible && (
        <div
          style={{
            position: 'absolute',
            top: menuPosition.y,
            left: menuPosition.x,
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            padding: '10px',
            zIndex: 10,
          }}
        >
          {selectedEdge ? (
            <div
              style={{
                cursor: 'pointer',
                color: 'red',
                fontWeight: 'bold',
                padding: '5px 10px',
              }}
              onClick={handleDeleteEdge}
            >
              Delete Edge
            </div>
          ) : (
            <div style={{ padding: '5px 10px', cursor: 'not-allowed', color: 'gray' }}>
              No Actions Available
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Automation;
