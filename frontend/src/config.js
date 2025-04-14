import React, { useState } from 'react';
import '@xyflow/react/dist/style.css';
import { ReactFlow, useNodesState, useEdgesState, ReactFlowProvider } from '@xyflow/react';
import { PromptNode, LoadFileNode, OutputNode, LogNode, InputNode } from '../components/Node';

const initialNodes = [
    { id: '1', type: 'PromptNode', position: { x: 100, y: 100 }, data: { label: 'AI Prompt' } },
    { id: '2', type: 'LoadFileNode', position: { x: 300, y: 100 }, data: { label: 'File Loader' } },
];

const initialEdges = [];

const Automation = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [contextMenuVisible, setContextMenuVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

    const nodeTypes = {
        PromptNode,
        LoadFileNode,
        OutputNode,
        LogNode,
        InputNode,
    };

    const handleContextMenu = (event) => {
        event.preventDefault();
        setMenuPosition({ x: event.clientX, y: event.clientY });
        setContextMenuVisible(true);
    };

    const handleAddNode = (type) => {
        const newNode = {
            id: (nodes.length + 1).toString(),
            type,
            position: { x: menuPosition.x, y: menuPosition.y },
            data: { label: `${type} Node` },
        };
        setNodes((nds) => [...nds, newNode]);
        setContextMenuVisible(false); // Hide the menu after adding a node
    };

    const handleClickOutside = () => {
        if (contextMenuVisible) setContextMenuVisible(false);
    };

    return (
        <div onContextMenu={handleContextMenu} onClick={handleClickOutside} style={{ height: '100vh' }}>
            <ReactFlowProvider>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    connectionLineType="smoothstep"
                />
            </ReactFlowProvider>

            {/* Context Menu */}
            {contextMenuVisible && (
                <div
                    style={{
                        position: 'absolute',
                        top: menuPosition.y,
                        left: menuPosition.x,
                        backgroundColor: 'white',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        padding: '8px',
                        zIndex: 10,
                    }}
                >
                    <div
                        style={{ padding: '4px', cursor: 'pointer' }}
                        onClick={() => handleAddNode('PromptNode')}
                    >
                        Add Prompt Node
                    </div>
                    <div
                        style={{ padding: '4px', cursor: 'pointer' }}
                        onClick={() => handleAddNode('LoadFileNode')}
                    >
                        Add Load File Node
                    </div>
                    <div
                        style={{ padding: '4px', cursor: 'pointer' }}
                        onClick={() => handleAddNode('OutputNode')}
                    >
                        Add Output Node
                    </div>
                    <div
                        style={{ padding: '4px', cursor: 'pointer' }}
                        onClick={() => handleAddNode('LogNode')}
                    >
                        Add Log Node
                    </div>
                    <div
                        style={{ padding: '4px', cursor: 'pointer' }}
                        onClick={() => handleAddNode('InputNode')}
                    >
                        Add Input Node
                    </div>
                </div>
            )}
        </div>
    );
};

export default Automation;