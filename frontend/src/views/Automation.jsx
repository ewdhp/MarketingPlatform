import React from 'react';
import '@xyflow/react/dist/style.css'; // Importing ReactFlow styles
import { ReactFlow, useNodesState, useEdgesState, ReactFlowProvider } from '@xyflow/react';
import { PromptNode, LoadFileNode, OutputNode, LogNode, InputNode } from "../components/Node";

// Define initial nodes with positions and labels
const initialNodes = [
  { id: '1', position: { x: 100, y: 100 }, data: { label: 'Node 1' }, type: 'default' },
  { id: '2', position: { x: 300, y: 100 }, data: { label: 'Node 2' }, type: 'default' },
];

// Define initial edges (none for now)
const initialEdges = [];

const Automation = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Handle edge deletion with right-click on an edge
  const handleEdgeContextMenu = (event, edge) => {
    event.preventDefault(); // Prevent the default browser context menu
    const edgeId = edge.id;
    const userConfirmed = window.confirm(`Do you want to delete edge ${edgeId}?`);
    if (userConfirmed) {
      handleEdgeDelete(edgeId); // Call edge delete logic
    }
  };

  // Remove edges programmatically by ID
  const handleEdgeDelete = (edgeId) => {
    setEdges((eds) => eds.filter((edge) => edge.id !== edgeId)); // Filter edges by ID
  };

  // Double-click on a node to disconnect all connected edges
  const handleNodeDoubleClick = (event, node) => {
    setEdges((eds) => eds.filter((edge) => edge.source !== node.id && edge.target !== node.id)); // Remove edges connected to the node
  };

  return (
    <div style={{ width: '99.8%', height: '100vh', backgroundColor: '#f8f8f8' }}> {/* Ensure proper canvas styling */}
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={(params) => setEdges((eds) => [...eds, params])} // Handle edge creation
          connectionLineType="smoothstep" // Display smooth connection lines
          onEdgeClick={handleEdgeContextMenu} // Add right-click listener for edges
          onNodeDoubleClick={handleNodeDoubleClick} // Add double-click listener for nodes
        // Adjust the view to fit all nodes in the canvas
        />
      </ReactFlowProvider>
    </div>
  );
};

export default Automation;