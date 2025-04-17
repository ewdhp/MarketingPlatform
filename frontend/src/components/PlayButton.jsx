import React, { useState } from 'react';

const PlayButton = ({ onClick }) => {
    const [isClicked, setIsClicked] = useState(false);

    const handleClick = () => {
        setIsClicked(true); // Change color to green on click
        if (onClick) {
            onClick(); // Trigger the passed onClick event
        }
    };

    return (
        <button
            onClick={handleClick}
            style={{
                backgroundColor: isClicked ? 'green' : 'transparent', // Green when clicked
                border: '2px solid #ccc',
                borderRadius: '50%',
                cursor: 'pointer',
                padding: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.3s ease',
            }}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={isClicked ? 'white' : 'currentColor'} // White fill when clicked
                width="16px"
                height="16px"
            >
                <circle cx="12" cy="12" r="11" stroke="none" fill="none" />
                <path d="M8 5v14l11-7z" />
            </svg>
        </button>
    );
};

export default PlayButton;