import React from "react";

// BaseNode Component
const typeColorMap = {
    AI: "border-purple-500",
    Code: "border-yellow-500",
    Control: "border-red-500",
    Data: "border-blue-500",
    Feedback: "border-green-500",
};

export function BaseNode({
    id,
    type,
    label,
    icon,
    inputs = [],
    outputs = [],
    config = {},
    style = {},
    onExecute,
}) {
    return (
        <div
            className={`rounded-2xl shadow-md p-3 w-48 bg-white border-l-4 ${typeColorMap[type] || "border-gray-300"
                }`}
            style={style}
        >
            <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6">{icon}</div>
                <div className="text-md font-bold">{label}</div>
            </div>
            {/* Add the type */}
            <div className="text-xs text-gray-500 mb-2">
                Type: {type || "Undefined"}
            </div>

            <div className="flex flex-col text-sm mb-1">
                {inputs.map((input, idx) => (
                    <div key={idx} className="text-left text-blue-600">
                        ● {input}
                    </div>
                ))}
            </div>

            <div className="flex flex-col text-sm">
                {outputs.map((output, idx) => (
                    <div key={idx} className="text-right text-green-600">
                        {output} ●
                    </div>
                ))}
            </div>

            {onExecute && (
                <button
                    className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
                    onClick={onExecute}
                >
                    Run
                </button>
            )}
        </div>
    );
}

// Extended Nodes
export function PromptNode(props) {
    const handleExecute = () => {
        console.log("Executing PromptNode with config:", props.config);
    };

    return (
        <BaseNode
            {...props}
            type="AI"
            label="Prompt Node"
            inputs={["Prompt Input"]}
            outputs={["AI Response"]}
            icon={<svg /* Replace with AI icon */ />}
            config={{ model: "openai", maxTokens: 100 }}
            onExecute={handleExecute}
        />
    );
}

export function LoadFileNode(props) {
    const handleExecute = () => {
        console.log("Loading File with config:", props.config);
    };

    return (
        <BaseNode
            {...props}
            type="Data"
            label="Load File Node"
            inputs={[]}
            outputs={["File Data"]}
            icon={<svg /* Replace with File icon */ />}
            config={{ fileType: "csv" }}
            onExecute={handleExecute}
        />
    );
}

export function OutputNode(props) {
    const handleExecute = () => {
        console.log("Displaying Output with config:", props.config);
    };

    return (
        <BaseNode
            {...props}
            type="Feedback"
            label="Output Node"
            inputs={["Final Result"]}
            outputs={[]}
            icon={<svg /* Replace with Feedback icon */ />}
            config={{ displayMode: "log" }}
            onExecute={handleExecute}
        />
    );
}

export function LogNode(props) {
    const handleExecute = () => {
        console.log("Logging Message with config:", props.config);
    };

    return (
        <BaseNode
            {...props}
            type="Feedback"
            label="Log Node"
            inputs={["Message"]}
            outputs={["Log Output"]}
            icon={<svg /* Replace with Log icon */ />}
            config={{ logLevel: "info" }}
            onExecute={handleExecute}
        />
    );
}

export function InputNode(props) {
    const handleExecute = () => {
        console.log("Processing Input with config:", props.config);
    };

    return (
        <BaseNode
            {...props}
            type="Control"
            label="Input Node"
            inputs={["User Input"]}
            outputs={["Processed Input"]}
            icon={<svg /* Replace with Input icon */ />}
            config={{ inputType: "text" }}
            onExecute={handleExecute}
        />
    );
}