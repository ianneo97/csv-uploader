import {
    Box,
    Button,
    Grid,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
} from '@mui/material';
import axios from 'axios';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

interface FileInfoResponse {
    file_id: string;
    invoice_no: string;
    stock_code: string;
    description: string;
    quantity: number;
    invoice_date: string;
    unit_price: string;
    customer_id: string;
    country: string;
}

export default function FileInfoPage() {
    const navigate = useNavigate();
    const { file_id } = useParams();
    const [data, setData] = React.useState<FileInfoResponse[]>([]);
    const [searchOption, setSearchOption] =
        React.useState<string>('stock_code');
    const [searchInput, setSearchInput] = React.useState<string>('');
    const searchOptions = [
        { value: 'stock_code', label: 'Stock Code' },
        { value: 'description', label: 'Description' },
        { value: 'quantity', label: 'Quantity' },
        { value: 'invoice_date', label: 'Invoice Date' },
        { value: 'unit_price', label: 'Unit Price' },
        { value: 'customer_id', label: 'Customer ID' },
        { value: 'country', label: 'Country' },
    ];
    const columns = [
        { field: 'file_id', hide: true },
        { field: 'invoice_no', headerName: 'Invoice No', flex: 1 },
        { field: 'stock_code', headerName: 'Stock Code', flex: 1 },
        { field: 'description', headerName: 'Description', flex: 1 },
        { field: 'quantity', headerName: 'Quantity', flex: 1 },
        { field: 'invoice_date', headerName: 'Invoice Date', flex: 1 },
        { field: 'unit_price', headerName: 'Unit Price', flex: 1 },
        { field: 'customer_id', headerName: 'Customer ID', flex: 1 },
        { field: 'country', headerName: 'Country', flex: 1 },
    ];

    const handleSearchChange = (event: SelectChangeEvent) => {
        setSearchOption(event.target.value);
    };

    const handleSearchInputChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setSearchInput(event.target.value);
    };

    const searchData = async () => {
        const response = await axios.post<FileInfoResponse[]>(
            `http://localhost:8080/reader/${file_id}`,
            { option: searchOption, value: searchInput }
        );

        setData(response.data);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            searchData();
        }
    }

    const backToMainPage = () => {
        navigate('/');
    };

    React.useEffect(() => {
        async function fetchData() {
            const response = await axios.post<FileInfoResponse[]>(
                `http://localhost:8080/reader/${file_id}`
            );
            setData(response.data);
        }

        fetchData();
    }, [file_id]);

    return (
        <div>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    p: 1,
                    m: 1,
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    width: '100%',
                }}
            >
                <Grid container spacing={4}>
                    <Grid item xs={8}>
                        <Select
                            value={searchOption}
                            onChange={(event: SelectChangeEvent) =>
                                handleSearchChange(event)
                            }
                        >
                            {searchOptions.map((option) => (
                                <MenuItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                        <TextField
                            variant="outlined"
                            onChange={(
                                event: React.ChangeEvent<HTMLInputElement>
                            ) => handleSearchInputChange(event)}
                            onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {handleKeyDown(event)}}
                        />
                    </Grid>

                    <Grid
                        item
                        xs={4}
                        style={{ display: 'flex', justifyContent: 'right' }}
                    >
                        <Button
                            onClick={() => backToMainPage()}
                            variant="outlined"
                            style={{ height: '100%', marginRight: '16px' }}
                        >
                            Back
                        </Button>
                        <Button
                            variant="outlined"
                            style={{ height: '100%', marginRight: "16px" }}
                            onClick={() => searchData()}
                        >
                            Search
                        </Button>
                    </Grid>
                </Grid>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    p: 1,
                    m: 1,
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    justifyContent: 'center',
                }}
            >
                <div
                    className="ag-theme-alpine"
                    style={{ height: '400px', width: '100%' }}
                >
                    <AgGridReact
                        rowData={data}
                        columnDefs={columns}
                        pagination={true}
                        suppressRowClickSelection={true}
                        paginationPageSize={25}
                    ></AgGridReact>
                </div>
            </Box>
        </div>
    );
}
