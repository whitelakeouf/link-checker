import { TextField } from '@mui/material';
import React, { useState, useEffect, useRef } from 'react';

type ISearchInputField = {
    handleInput: (text: string) => void;
};

const SearchInputField: React.FC<ISearchInputField> = ({ handleInput }) => {
    const [inputText, setInputText] = useState<string>('');
    const inputRef = useRef<HTMLInputElement>();

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Escape') {
            inputRef.current.blur();
        }
    };

    useEffect(() => {
        const timerId: NodeJS.Timer = setTimeout(() => handleInput(inputText), 400);
        return () => clearTimeout(timerId);
    }, [inputText]);

    return (
        <TextField
            id="domain_input"
            label="search input"
            variant="outlined"
            size="small"
            value={inputText}
            inputRef={inputRef}
            onKeyDown={handleKeyDown}
            onChange={(e) => setInputText(e.target.value)}
            sx={{ flex: '1' }}
        />
    );
};

export default SearchInputField;
