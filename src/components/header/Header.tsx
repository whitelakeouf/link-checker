import { Box, Stack, Typography } from '@mui/material';
import React from 'react';

type IHeaderProps = {
    rightMenu?: JSX.Element;
};

const Header: React.FC<IHeaderProps> = ({ rightMenu }) => {
    return (
        <Box sx={{ backgroundColor: '#3F51B5' }}>
            <Stack
                direction="row"
                sx={{
                    p: 1,
                    pl: 2,
                    pr: 2,
                    m: '0 auto',
                    height: '60px',
                    maxWidth: '1200px',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <Typography sx={{ color: '#FFFFFF', fontSize: '20px' }}>Link checker</Typography>
                <Stack>{rightMenu}</Stack>
            </Stack>
        </Box>
    );
};

export default Header;
