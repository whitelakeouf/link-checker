import { Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import React from 'react';

const theme = createTheme({
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
                        width: 15,
                        height: 15,
                        cursor: 'auto',
                    },
                    '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
                        border: '5px solid transparent',
                        boxShadow: 'inset 0 0 10px 10px #3F51B5',
                        transition: 'border-width 3s',
                    },
                    '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover': {
                        borderWidth: 2,
                        borderRadius: 8,
                    },
                    margin: 0,
                    boxSizing: 'border-box',
                    '> div': {
                        width: '100%',
                        height: '100vh',
                    },
                },
            },
        },
    },
});

const Theme: React.FC = ({ children }) => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box
                sx={{
                    pl: 2,
                    pr: 2,
                    display: 'flex',
                    minHeight: 'calc(100vh - 62px)',
                    maxWidth: '1200px',
                    margin: '0 auto',
                    flexDirection: 'column',
                }}
            >
                {children}
            </Box>
        </ThemeProvider>
    );
};

export default Theme;
