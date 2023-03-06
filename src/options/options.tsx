import {
    Box,
    Button,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    IconButton,
    FormGroup,
    FormControlLabel,
    Checkbox,
} from '@mui/material';
import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Header from '../components/header/Header';
import Codestetic from '../components/images/Codestetic';
import InputField from '../components/inputField/InputField';
import Theme from '../components/theme/Theme';
import { numberGenerator } from '../utils/helpers';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';

const Options: React.FC = () => {
    const [blockedDomains, setBlockedDomains] = useState<string[]>([]);
    const [hashWarning, setHashWarning] = useState<boolean>(true);
    const [emptyValueWarning, setEmptyValueWarning] = useState<boolean>(true);

    const generateId = numberGenerator();

    useEffect(() => {
        chrome.storage.sync.get(null, (result) => {
            setBlockedDomains(result?.blockedDomains ?? []);
            setHashWarning(result.hashWarning);
            setEmptyValueWarning(result.emptyValueWarning);
        });
    }, []);

    useEffect(() => {
        chrome.storage.sync.set({ blockedDomains });
    }, [blockedDomains]);

    useEffect(() => {
        chrome.storage.sync.set({ hashWarning });
    }, [hashWarning]);

    useEffect(() => {
        chrome.storage.sync.set({ emptyValueWarning });
    }, [emptyValueWarning]);

    const handleOpenAbout = () => {
        chrome.tabs.create({
            url: `https://codestetic.com/en`,
        });
    };

    const handleHashCheckbox = (e) => {
        setHashWarning(e.target.checked);
    };

    const handleEmptyValueCheckbox = (e) => {
        setEmptyValueWarning(e.target.checked);
    };

    const handleAddDomain = (input: string) => {
        const newDomains = [...blockedDomains];
        newDomains.push(input);

        setBlockedDomains(newDomains);
    };

    const handleRemoveDomain = (index: number) => {
        const newDomains = [...blockedDomains];
        newDomains.splice(index, 1);

        setBlockedDomains(newDomains);
    };

    return (
        <>
            <Header
                rightMenu={
                    <IconButton onClick={handleOpenAbout}>
                        <HelpOutlineOutlinedIcon sx={{ color: '#FFFFFF' }} />
                    </IconButton>
                }
            />
            <Theme>
                <Stack>
                    <Stack sx={{ pt: 3, pb: 3 }}>
                        <Typography variant="h3">Settings</Typography>
                    </Stack>

                    <Box sx={{ maxHeight: '300px', overflowX: 'auto', pb: 4 }}>
                        <Typography variant="h5" sx={{ pb: 1 }}>
                            Warnings
                        </Typography>
                        <FormGroup>
                            <FormControlLabel
                                control={<Checkbox />}
                                label="Warn if href value ends with hash, <a href=”/blog/index.html#readalso”>Read also</a> "
                                checked={hashWarning}
                                onChange={(e) => handleHashCheckbox(e)}
                            />
                            <FormControlLabel
                                control={<Checkbox />}
                                label="Warn if href value is empty or absent"
                                checked={emptyValueWarning}
                                onChange={(e) => handleEmptyValueCheckbox(e)}
                            />
                        </FormGroup>
                    </Box>

                    <Box sx={{ maxHeight: '400px', overflowX: 'auto' }}>
                        <Typography variant="h5" sx={{ pb: 1 }}>
                            Blocked domains
                        </Typography>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ pt: 1, pb: 1, fontWeight: 'bold' }}>Domains</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {blockedDomains.map((domain, index) => (
                                    <TableRow key={`domain_${generateId.next().value}`}>
                                        <TableCell sx={{ pt: 1, pb: 1, pr: 0 }}>
                                            <Stack sx={{ p: 0 }} spacing={1} direction="row" alignItems="center">
                                                <Typography sx={{ flex: '1', display: 'block' }}>{domain}</Typography>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    onClick={() => handleRemoveDomain(index)}
                                                    sx={{ width: '115px' }}
                                                >
                                                    Delete
                                                </Button>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Box>

                    <InputField handleInput={handleAddDomain} />
                </Stack>

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
ReactDOM.render(<Options />, root);
