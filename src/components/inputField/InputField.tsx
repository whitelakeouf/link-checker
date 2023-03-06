import { Button, Stack, TextField } from '@mui/material';
import React, { useState, useRef } from 'react';

type IInputFieldProps = {
    handleInput: (input: string) => void;
};

const InputField: React.FC<IInputFieldProps> = ({ handleInput }) => {
    const [inputText, setInputText] = useState<string>('');
    const inputRef = useRef<HTMLInputElement>();

    const handleBtnClick = () => {
        if (inputText !== '') {
            handleInput(inputText);
            setInputText('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') {
            handleBtnClick();
            inputRef.current.blur();
        }

        if (e.key === 'Escape') {
            inputRef.current.blur();
        }
    };

    return (
        <Stack sx={{ mt: 2 }} spacing={1} direction="row" alignItems="flex-start">
            <TextField
                id="domain_input"
                label="Domain"
                helperText="example: google.com"
                variant="outlined"
                size="small"
                value={inputText}
                inputRef={inputRef}
                onKeyDown={handleKeyDown}
                onChange={(e) => setInputText(e.target.value)}
                sx={{ flex: '1' }}
            />

            <Button variant="contained" color="success" onClick={handleBtnClick} sx={{ width: '115px' }}>
                add
            </Button>
        </Stack>
    );
};

export default InputField;
