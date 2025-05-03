import React, { useState } from "react";
import Box from "@mui/material/Box";

const ResizableLayoutMui = ({ leftComponent, rightComponent }) => {
    const [leftWidth, setLeftWidth] = useState(200); // Initial width of the left panel

    const handleMouseDown = (e) => {
        const startX = e.clientX;
        const startWidth = leftWidth;

        const onMouseMove = (event) => {
            const newWidth = startWidth + event.clientX - startX;
            setLeftWidth(Math.max(newWidth, 100)); // Minimum width of 100px
        };

        const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    };

    return (
        <Box
            sx={{
                display: "flex",
                width: "100%",
                height: "100%",
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
            </Box>

            {/* Resizable Divider */}
            <Box
                sx={{
                    width: "5px",
                    cursor: "ew-resize",
                    backgroundColor: "#ccc",
                }}
                onMouseDown={handleMouseDown}
            />

            {/* Right Panel */}
            <Box
                sx={{
                    flex: 1,
                    backgroundColor: "#e0e0e0",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {rightComponent}
            </Box>
        </Box>
    );
};

export default ResizableLayoutMui;