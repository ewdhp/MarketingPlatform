import React, { useState, useRef } from "react";
import Box from "@mui/material/Box";

const DIVIDER_WIDTH = 5; // px

const ResizableLayoutMui = ({ leftComponent, rightComponent }) => {
    const containerRef = useRef(null);
    const [leftWidthPercent, setLeftWidthPercent] = useState(65);

    const handleMouseDown = (e) => {
        const startX = e.clientX;
        const containerWidth = containerRef.current.offsetWidth;
        const startWidthPx = (leftWidthPercent / 100) * containerWidth;

        const onMouseMove = (event) => {
            const dx = event.clientX - startX;
            let newLeftWidthPx = startWidthPx + dx;
            // Clamp to min/max
            newLeftWidthPx = Math.max(100, Math.min(newLeftWidthPx, containerWidth - 100 - DIVIDER_WIDTH));
            const newLeftWidthPercent = (newLeftWidthPx / containerWidth) * 100;
            setLeftWidthPercent(newLeftWidthPercent);
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
            ref={containerRef}
            sx={{
                display: "flex",
                width: "100%",
                height: "100%",
            }}
        >
            {/* Left Panel */}
            <Box
                sx={{
                    width: `calc(${leftWidthPercent}% - ${DIVIDER_WIDTH / 2}px)`,
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
                    width: `${DIVIDER_WIDTH}px`,
                    cursor: "ew-resize",
                    backgroundColor: "#ccc",
                    zIndex: 1,
                }}
                onMouseDown={handleMouseDown}
            />

            {/* Right Panel */}
            <Box
                sx={{
                    width: `calc(${100 - leftWidthPercent}% - ${DIVIDER_WIDTH / 2}px)`,
                    backgroundColor: "#e0e0e0",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "auto",
                }}
            >
                {rightComponent}
            </Box>
        </Box>
    );
};

export default ResizableLayoutMui;