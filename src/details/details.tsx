import styled from '@emotion/styled';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { Box, Button, Checkbox, FormControlLabel, FormGroup, IconButton, Link, Stack, Typography } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import XLSX from 'xlsx';
import Header from '../components/header/Header';
import Codestetic from '../components/images/Codestetic';
import Theme from '../components/theme/Theme';
import CustomPaginationActionsTable from './CustomPaginationActionsTable';

function removeValidLinks(links) {
    return links.filter((link) => link.status !== 'Valid');
}

function removeRedirectsLinks(links) {
    return links.filter((link) => link.status !== 'Redirect');
}

function removeWarningLinks(links) {
    return links.filter((link) => link.status !== 'Warning');
}

function removeBrokenLinks(links) {
    return links.filter((link) => link.status !== 'Broken');
}

function removeInternalLinks(links) {
    return links.filter((link) => link.type !== 'Internal');
}

function removeExternalLinks(links) {
    return links.filter((link) => link.type !== 'External');
}

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const ButtonsContainer = styled.div`
    display: flex;
`;

const Details = () => {
    const [sourceData, setSourceData] = useState({ links: [], pageUrl: 'undefined' });
    // const [processedData, setProcessedData] = useState([]);

    const [showValid, setShowValid] = useState(true);
    const [showRedirects, setShowRedirects] = useState(true);
    const [showWarning, setShowWarning] = useState(true);
    const [showBroken, setShowBroken] = useState(true);
    const [showInternal, setShowInternal] = useState(true);
    const [showExternal, setShowExternal] = useState(true);

    useEffect(() => {
        chrome.tabs.query({ currentWindow: true, active: true }, ([tab]) => {
            chrome.storage.local.get(null, (result) => {
                setSourceData(result[tab.id]);
                // setProcessedData(prepareData(result[tab.id].links, result[tab.id].pageUrl));
            });
        });
    }, []);

    const prepareData = (data, pageUrl) => {
        const arr = [];
        for (const obj of data) {
            const result = { url: '', status: '', response: '', type: '' };
            if (obj !== '*') {
                if (obj.url !== '') {
                    const pageDomain = new URL(pageUrl).hostname;
                    const linkDomain = new URL(obj.url).hostname;
                    pageDomain === linkDomain ? (result.type = 'Internal') : (result.type = 'External');
                } else result.type = 'Internal';

                if (obj.ok) {
                    if (obj.url.includes('#') || obj.url === '') {
                        result.status = 'Warning';
                    } else if (obj.redirect) {
                        result.status = 'Redirect';
                    } else result.status = 'Valid';
                } else result.status = 'Broken';
            } else continue;
            result.url = obj.url;
            result.response = obj.status;
            arr.push(result);
        }
        return arr;
    };

    const processedData = useMemo(() => {
        let newProcessedData = prepareData(sourceData.links, sourceData.pageUrl);

        if (!showValid) {
            newProcessedData = removeValidLinks(newProcessedData);
        }

        if (!showRedirects) {
            newProcessedData = removeRedirectsLinks(newProcessedData);
        }

        if (!showWarning) {
            newProcessedData = removeWarningLinks(newProcessedData);
        }

        if (!showBroken) {
            newProcessedData = removeBrokenLinks(newProcessedData);
        }

        if (!showInternal) {
            newProcessedData = removeInternalLinks(newProcessedData);
        }

        if (!showExternal) {
            newProcessedData = removeExternalLinks(newProcessedData);
        }

        return newProcessedData;
        // setProcessedData(newProcessedData);
    }, [showValid, showRedirects, showWarning, showBroken, showInternal, showExternal, sourceData]);

    console.log(processedData);

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

    const handleDownloadCSV = () => {
        const csvContent = processedData.reduce((acc, el) => {
            console.log(el);
            return acc + `${el.url} ` + `${el.status} ` + `${el.response} ` + `${el.type}\n`;
        }, '');

        const hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvContent);
        hiddenElement.target = '_blank';

        hiddenElement.download = 'Link checking report.csv';
        hiddenElement.click();
    };

    const handleDownloadXLSX = () => {
        const xlsxContent = [];
        xlsxContent.push(Object.keys(processedData[0]));
        processedData.forEach((el) => {
            xlsxContent.push(Object.values(el));
        });

        const worksheet = XLSX.utils.aoa_to_sheet(xlsxContent);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
        return XLSX.writeFile(wb, `Link checking report for the page ${sourceData.pageUrl} .xlsx`);
    };

    return (
        <>
            <Header
                rightMenu={
                    <ButtonsContainer>
                        <IconButton onClick={handleOpenSettings}>
                            <SettingsOutlinedIcon sx={{ color: '#FFFFFF' }} />
                        </IconButton>
                        <IconButton onClick={handleOpenAbout}>
                            <HelpOutlineOutlinedIcon sx={{ color: '#FFFFFF' }} />
                        </IconButton>
                    </ButtonsContainer>
                }
            />
            <Theme>
                <PageContainer>
                    <Stack sx={{ pt: 3, pb: 3 }}>
                        <Typography variant="h3">Link checking report</Typography>
                        <Typography variant="h5" sx={{ pt: 1, pb: 1 }}>
                            for the page:{' '}
                            <Link href={sourceData.pageUrl} underline="hover">
                                {sourceData.pageUrl}
                            </Link>
                        </Typography>
                    </Stack>

                    <Stack>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <FormGroup row={true} sx={{ pb: 1 }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            color="success"
                                            checked={showValid}
                                            onChange={() => setShowValid(!showValid)}
                                        />
                                    }
                                    label="Valid"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            color="primary"
                                            checked={showRedirects}
                                            onChange={() => setShowRedirects(!showRedirects)}
                                        />
                                    }
                                    label="Redirects"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            color="warning"
                                            checked={showWarning}
                                            onChange={() => setShowWarning(!showWarning)}
                                        />
                                    }
                                    label="Warning"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            color="error"
                                            checked={showBroken}
                                            onChange={() => setShowBroken(!showBroken)}
                                        />
                                    }
                                    label="Broken"
                                />
                            </FormGroup>
                            <FormGroup row={true} sx={{ pb: 1 }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            color="default"
                                            checked={showInternal}
                                            onChange={() => setShowInternal(!showInternal)}
                                        />
                                    }
                                    label="Internal"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            color="default"
                                            checked={showExternal}
                                            onChange={() => setShowExternal(!showExternal)}
                                        />
                                    }
                                    label="External"
                                />
                            </FormGroup>
                            <Stack direction="row" sx={{ pb: 1 }}>
                                <Button
                                    variant="outlined"
                                    endIcon={<DownloadOutlinedIcon />}
                                    onClick={handleDownloadXLSX}
                                    sx={{ mr: 1 }}
                                >
                                    {'XLSX'}
                                </Button>
                                <Button
                                    variant="outlined"
                                    endIcon={<DownloadOutlinedIcon />}
                                    onClick={handleDownloadCSV}
                                >
                                    {'CSV'}
                                </Button>
                            </Stack>
                        </Box>
                        <CustomPaginationActionsTable processedData={processedData}></CustomPaginationActionsTable>
                    </Stack>
                </PageContainer>
                <Stack
                    direction="row"
                    spacing={1}
                    sx={{ width: 'fit-content', alignSelf: 'center', mt: 'auto', p: 2, alignItems: 'center' }}
                >
                    <Typography variant="inherit" sx={{ color: '#E4E4E4', pt: '3px' }}>
                        {'by codestetic'}
                    </Typography>
                    <Codestetic fontSize="small" />
                </Stack>
            </Theme>
        </>
    );
};

const root = document.createElement('div');
document.body.appendChild(root);
ReactDOM.render(<Details />, root);
