import React, { useState, useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { ReactFlow, useNodesState, useEdgesState, ReactFlowProvider } from "@xyflow/react";
import { Editor } from "@monaco-editor/react";
import "@xyflow/react/dist/style.css";

const initialNodes = [
    { id: "1", type: "input", data: { label: "Input Node" }, position: { x: 250, y: 0 } },
    { id: "2", data: { label: "Default Node" }, position: { x: 250, y: 100 } },
    { id: "3", data: { label: "Another Node" }, position: { x: 250, y: 200 } },
    { id: "4", type: "output", data: { label: "Output Node" }, position: { x: 250, y: 300 } },
];

const initialEdges = [
    { id: "e1-2", source: "1", target: "2", animated: true },
    { id: "e2-3", source: "2", target: "3", animated: true },
    { id: "e3-4", source: "3", target: "4", animated: true },
];

const Automation = ({ instanceId }) => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const editorRef = useRef(null);

    // Load nodes and edges from localStorage specific to the instance on mount
    useEffect(() => {
        const savedNodes = localStorage.getItem(`nodes-${instanceId}`);
        const savedEdges = localStorage.getItem(`edges-${instanceId}`);
        if (savedNodes) setNodes(JSON.parse(savedNodes));
        if (savedEdges) setEdges(JSON.parse(savedEdges));
    }, [setNodes, setEdges, instanceId]);

    // Save nodes and edges to localStorage specific to the instance on change
    const handleNodesChange = (changes) => {
        onNodesChange(changes);
        localStorage.setItem(`nodes-${instanceId}`, JSON.stringify(nodes));
    };

    const handleEdgesChange = (changes) => {
        onEdgesChange(changes);
        localStorage.setItem(`edges-${instanceId}`, JSON.stringify(edges));
    };

    return (
        <ReactFlowProvider>
            <Box sx={{ display: "flex", width: "100%", height: "100%" }}>
                {/* Left Section for Nodes */}
                <Box
                    sx={{
                        width: "60%", // Fixed width for the left section
                        backgroundColor: "lightgray",
                        borderRight: "2px solid #ccc",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={handleNodesChange}
                        onEdgesChange={handleEdgesChange}
                        onConnect={(params) => setEdges((eds) => [...eds, params])}
                        connectionLineType="smoothstep"
                        fitView
                    />
                </Box>

                {/* Right Section for Code Editor */}
                <Box
                    sx={{
                        flex: 1, // Take the remaining space
                        backgroundColor: "#e0e0e0",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Editor
                        language="javascript"
                        theme="vs-light"
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                        }}
                        onMount={(editor) => (editorRef.current = editor)}
                    />
                </Box>
            </Box>
        </ReactFlowProvider>
    );
};

export default Automation;