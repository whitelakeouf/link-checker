import styled from '@emotion/styled';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import {
    Box,
    Button,
    CircularProgress,
    IconButton,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Codestetic from '../components/images/Codestetic';
import Theme from '../components/theme/PopupTheme';

const mainColor = 'rgba(63, 81, 181)';
const mainColorHO = 'rgba(63, 81, 181, 0.5)';

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    min-width: 300px;
    min-height: 420px;
`;

const MainContainer = styled.div`
    padding: 20px 20px 0 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Header = styled.div`
    height: 68px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: ${mainColor};
    color: white;
    padding: 0 20px;
    box-sizing: border-box;
`;

const ButtonsContainer = styled.div`
    display: flex;
`;

const Popup = () => {
    const [infoForDetails, setInfoForDetails] = useState({ links: [], pageUrl: '' });
    const [countLinks, setCountLinks] = useState({ valid: 0, warnings: 0, broken: 0, redirect: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const port = chrome.runtime.connect({ name: 'send_request' });
        chrome.tabs.query({ currentWindow: true, active: true }, ([tab]) => {
            port.postMessage(tab.id);
            port.onMessage.addListener(() => {
                setLoading(false);
                chrome.storage.local.get(null, (result) => {
                    chrome.storage.sync.get(null, (res) => {
                        setInfoForDetails(result[tab.id]);
                        setCountLinks(amountCheckedLinks(result[tab.id].links, res.hashWarning, res.emptyValueWarning));
                    });
                });
            });
        });
    }, []);

    const amountCheckedLinks = (links, hashWarning: boolean, emptyValueWarning: boolean) => {
        const send = { valid: 0, warnings: 0, broken: 0, redirect: 0 };
        links.map((link) => {
            if (link !== '*') {
                if (link.ok) {
                    if ((hashWarning && link.url.includes('#')) || (emptyValueWarning && link.url === '')) {
                        send.warnings++;
                    } else send.valid++;
                } else send.broken++;
                if (link.redirect) {
                    send.redirect++;
                }
            }
        });
        return send;
    };

    const openReport = () => {
        chrome.tabs.create(
            {
                url: 'details.html',
            },
            (tab) => {
                chrome.storage.local.set({
                    [tab.id]: { links: infoForDetails.links, pageUrl: infoForDetails.pageUrl },
                });
            },
        );
    };

    const handleOpenSettings = () => {
        chrome.tabs.create({
            url: `options.html`,
        });
    };

    const handleOpenAbout = () => {
        chrome.tabs.create({
            url: `https://codestetic.com/en`,
        });
    };

    function createData(name: string, count: number) {
        return { name, count };
    }

    const rows = [
        createData('Valid', countLinks.valid),
        createData('Redirect', countLinks.redirect),
        createData('Warning', countLinks.warnings),
        createData('Broken', countLinks.broken),
    ];

    return (
        <Theme>
            <PageContainer>
                <Header>
                    <Typography sx={{ color: '#FFFFFF', fontSize: '20px' }}>Link checker</Typography>
                    <ButtonsContainer>
                        <IconButton onClick={handleOpenAbout} sx={{ p: '4px' }}>
                            <HelpOutlineOutlinedIcon sx={{ color: '#FFFFFF' }} />
                        </IconButton>
                        <IconButton onClick={handleOpenSettings} sx={{ p: '4px' }}>
                            <SettingsOutlinedIcon sx={{ color: '#FFFFFF' }} />
                        </IconButton>
                    </ButtonsContainer>
                </Header>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '100px', color: mainColor }}>
                        <CircularProgress size={100} color="inherit" />
                    </Box>
                ) : (
                    <MainContainer>
                        <TableContainer component={Paper}>
                            <Table sx={{ width: '100%' }} aria-label="simple table">
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: mainColorHO }}>
                                        <TableCell sx={{ color: 'white', p: '12px 16px' }}>Links status</TableCell>
                                        <TableCell sx={{ color: 'white', p: '12px 16px' }}>Count</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map((row) => (
                                        <TableRow
                                            hover
                                            key={row.name}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row" sx={{ p: '12px 16px', width: '55%' }}>
                                                {row.name}
                                            </TableCell>
                                            <TableCell sx={{ p: '12px 16px' }}>{row.count}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Button
                            variant="contained"
                            onClick={() => {
                                openReport();
                            }}
                            sx={{ p: '8px 6px', marginTop: '16px', backgroundColor: mainColor, width: '120px' }}
                        >
                            Open Report
                        </Button>
                    </MainContainer>
                )}

                <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                        width: 'fit-content',
                        alignSelf: 'center',
                        p: 1,
                        alignItems: 'center',
                        fontSize: '0.8rem',
                        mt: 'auto',
                    }}
                >
                    <Typography variant="inherit" sx={{ color: '#E4E4E4', pt: '3px' }}>
                        {'by codestetic'}
                    </Typography>
                    <Codestetic sx={{ fontSize: 12, marginLeft: '5px' }} />
                </Stack>
            </PageContainer>
        </Theme>
    );
};

const root = document.createElement('div');
document.body.appendChild(root);
ReactDOM.render(<Popup />, root);
