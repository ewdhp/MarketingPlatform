import React from "react";

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
            className={
                `rounded-2xl shadow-md p-3 w-48 
                bg-white border-l-4 ${typeColorMap[type] ||
                "border-gray-300"
                }`}
            style={style}
        >
            <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6">{icon}</div>
                <div className="text-md font-bold">{label}</div>
            </div>
            <div className="text-xs text-gray-500 mb-2">{type}</div>

            <div className="flex flex-col text-sm mb-1">
                {inputs.map((input, idx) => (
                    <div key={idx} className="
                    text-left text-blue-600">
                        ● {input}
                    </div>
                ))}
            </div>

            <div className="flex flex-col text-sm">
                {outputs.map((output, idx) => (
                    <div key={idx} className="
                    text-right text-green-600">
                        {output} ●
                    </div>
                ))}
            </div>

            {onExecute && (
                <button
                    className="mt-2 bg-blue-500 
                    hover:bg-blue-600 text-white 
                    px-2 py-1 rounded text-xs"
                    onClick={onExecute}
                >
                    Run
                </button>
            )}
        </div>
    );
}

export function InputNode({ id, label, icon, inputs, outputs, params, style, onExecute }) {
    return (
        <BaseNode
            id={id}
            label={label}
            type="Control"
            icon={icon}
            inputs={inputs}
            outputs={outputs}
            params={params}
            style={style}
            onExecute={onExecute}
        />
    );
}

export function OutputNode({ id, label, icon, inputs, outputs, params, style, onExecute }) {
    return (
        <BaseNode
            id={id}
            label={label}
            type="Feedback"
            icon={icon}
            inputs={inputs}
            outputs={outputs}
            params={params}
            style={style}
            onExecute={onExecute}
        />
    );
}

export function LoadFileNode({ id, label, icon, inputs, outputs, params, style, onExecute }) {
    return (
        <BaseNode
            id={id}
            label={label}
            type="Data"
            icon={icon}
            inputs={inputs}
            outputs={outputs}
            params={params}
            style={style}
            onExecute={onExecute}
        />
    );
}

export function CodeNode({ id, label, icon, inputs, outputs, params, style, onExecute }) {
    return (
        <BaseNode
            id={id}
            label={label}
            type="Code"
            icon={icon}
            inputs={inputs}
            outputs={outputs}
            params={params}
            style={style}
            onExecute={onExecute}
        />
    );
}

export function PromptNode({ id, label, icon, inputs, outputs, params, style, onExecute }) {
    return (
        <BaseNode
            id={id}
            label={label}
            type="AI"
            icon={icon}
            inputs={inputs}
            outputs={outputs}
            params={params}
            style={style}
            onExecute={onExecute}
        />
    );
}

export function FeedbackNode({ id, label, icon, inputs, outputs, params, style, onExecute }) {
    return (
        <BaseNode
            id={id}
            label={label}
            type="Feedback"
            icon={icon}
            inputs={inputs}
            outputs={outputs}
            params={params}
            style={style}
            onExecute={onExecute}
        />
    );
}

export function ControlNode({ id, label, icon, inputs, outputs, params, style, onExecute }) {
    return (
        <BaseNode
            id={id}
            label={label}
            type="Control"
            icon={icon}
            inputs={inputs}
            outputs={outputs}
            params={params}
            style={style}
            onExecute={onExecute}
        />
    );
}

export function DataNode({ id, label, icon, inputs, outputs, params, style, onExecute }) {
    return (
        <BaseNode
            id={id}
            label={label}
            type="Data"
            icon={icon}
            inputs={inputs}
            outputs={outputs}
            params={params}
            style={style}
            onExecute={onExecute}
        />
    );
}
export function LogNode({ id, label, icon, inputs, outputs, params, style, onExecute }) {
    return (
        <BaseNode
            id={id}
            label={label}
            type="Feedback"
            icon={icon}
            inputs={inputs}
            outputs={outputs}
            params={params}
            style={style}
            onExecute={onExecute}
        />
    );
}

