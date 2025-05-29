import React, { useState, useRef } from "react";
import Box from "@mui/material/Box";
import { SigmaContainer, useLoadGraph } from "react-sigma-v2";
import "react-sigma-v2/lib/react-sigma-v2.css";
const ResizableLayoutMui = ({ leftComponent, rightComponent }) => {
    const editorRef = useRef(null);
    const [leftWidth, setLeftWidth] = useState(200);

    const handleMouseDown = (e) => {
        const startX = e.clientX;
        const startWidth = leftWidth;

        const onMouseMove = (event) => {
            const newWidth = startWidth + event.clientX - startX;
            setLeftWidth(Math.max(newWidth, 100));
        };

        const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    };

    // Example: More nodes and edges
    const graphData = {
        nodes: [
            { id: "n1", label: "Node 1", x: 0, y: 0, size: 10, color: "#f00" },
            { id: "n2", label: "Node 2", x: 100, y: 100, size: 10, color: "#0f0" },
            { id: "n3", label: "Node 3", x: 200, y: 0, size: 10, color: "#00f" },
            { id: "n4", label: "Node 4", x: 100, y: -100, size: 10, color: "#ff0" },
            { id: "n5", label: "Node 5", x: 300, y: 100, size: 10, color: "#0ff" },
        ],
        edges: [
            { id: "e1", source: "n1", target: "n2", color: "#ccc" },
            { id: "e2", source: "n2", target: "n3", color: "#ccc" },
            { id: "e3", source: "n3", target: "n4", color: "#ccc" },
            { id: "e4", source: "n4", target: "n1", color: "#ccc" },
            { id: "e5", source: "n2", target: "n4", color: "#ccc" },
            { id: "e6", source: "n3", target: "n5", color: "#ccc" },
        ],
    };

    function LoadGraph() {
        useLoadGraph(graphData);
        return null;
    }

    return (
        <Box
            sx={{
                display: "flex",
                width: "100%",
                height: "100vh", // or any fixed value
                minHeight: "400px",
            }}
        >
            {/* Left Panel */}
            <Box
                sx={{
                    width: `${leftWidth}px`,
                    backgroundColor: "lightgray",
                    borderRight: "2px solid #ccc",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {leftComponent}



                {/* Resizable Divider */}
                <Box
                    sx={{
                        width: "10px",
                        cursor: "ew-resize",
                        backgroundColor: "#ccc",
                    }}
                    onMouseDown={handleMouseDown}
                />


            </Box>


            {/* Resizable Divider */}
            <Box
                sx={{
                    width: "10px",
                    cursor: "ew-resize",
                    backgroundColor: "#ccc",
                }}
                onMouseDown={handleMouseDown}
            />

            {/* Right Panel */}
            <Box
                sx={{
                    backgroundColor: "#e0e0e0",
                    display: "flex",
                    flexDirection: "column",
                    width: `calc(100% - ${leftWidth + 10}px)`, // set width based on left panel and divider
                }}
            >
                {rightComponent}



            </Box>
        </Box>
    );
};

export default ResizableLayoutMui;