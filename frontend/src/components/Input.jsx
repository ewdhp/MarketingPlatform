import React from 'react';
import TextField from '@mui/material/TextField';

const Input = ({ placeholder, onEnter }) => {
    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && onEnter) {
            onEnter(event.target.value); // Trigger the onEnter event with the input value
        }
    };

    return (
        <TextField
            variant="outlined"
            placeholder={placeholder}
            onKeyPress={handleKeyPress}
            InputProps={{
                style: {
                    textAlign: 'center', // Center the placeholder text
                },
            }}
            fullWidth
        />
    );
};

export default Input;