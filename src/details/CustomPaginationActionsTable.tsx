import {
    Link,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TablePagination,
    TableRow,
} from '@mui/material';
import { numberGenerator } from '../utils/helpers';
import TablePaginationActions from '@mui/material/TablePagination/TablePaginationActions';
import React from 'react';

export default function CustomPaginationActionsTable({ processedData }) {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const generateId = numberGenerator();

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - processedData.length) : 0;

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const colors = {
        Valid: '#2e7d32',
        Redirect: '#1976d2',
        Warning: '#ed6c02',
        Broken: '#d32f2f',
    };

    const mainColorHO = 'rgba(63, 81, 181, 0.5)';
    const mainColor = 'rgba(63, 81, 181)';

    return (
        <TableContainer component={Paper} sx={{ mb: 5 }}>
            <Table sx={{ minWidth: 500 }} aria-label="custom pagination table" id="xlsxExport">
                <TableHead>
                    <TableRow sx={{ backgroundColor: mainColorHO }}>
                        <TableCell sx={{ color: 'white' }}>Url</TableCell>
                        <TableCell sx={{ color: 'white' }}>Status</TableCell>
                        <TableCell sx={{ color: 'white' }}>Response</TableCell>
                        <TableCell sx={{ color: 'white' }}>Type</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(rowsPerPage > 0
                        ? processedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        : processedData
                    ).map((row) => (
                        <TableRow hover key={`domain_${generateId.next().value}`}>
                            <TableCell
                                sx={{
                                    maxWidth: 550,
                                    textOverflow: 'ellipsis',
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                }}
                                style={{ width: 550 }}
                            >
                                <img
                                    src={`https://${new URL(row.url).hostname}/favicon.ico`}
                                    alt=""
                                    style={{
                                        minWidth: '16px',
                                        width: '16px',
                                        marginRight: '10px',
                                        verticalAlign: 'middle',
                                    }}
                                />
                                <Link href={row.url} color="inherit" underline="hover" target="_blank">
                                    {row.url}
                                </Link>
                            </TableCell>
                            <TableCell style={{ width: 160, color: colors[row.status] }}>{row.status}</TableCell>
                            <TableCell style={{ width: 160 }}>{row.response}</TableCell>
                            <TableCell style={{ width: 160 }}>{row.type}</TableCell>
                        </TableRow>
                    ))}
                    {emptyRows > 0 && (
                        <TableRow style={{ height: 53 * emptyRows }}>
                            <TableCell colSpan={6} />
                        </TableRow>
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                            colSpan={3}
                            count={processedData.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            SelectProps={{
                                inputProps: {
                                    'aria-label': 'rows per page',
                                },
                                native: true,
                            }}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            ActionsComponent={TablePaginationActions}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    );
}
