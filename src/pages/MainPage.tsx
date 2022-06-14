import { Backdrop, Box, CircularProgress, Snackbar } from '@mui/material';
import axios from 'axios';
import MaterialTable from 'material-table';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { Upload } from '../components/Upload';

interface FileLinkResponse {
    file_name: string;
    file_url: string;
    file: File;
}

interface FileResponse {
    file_id: string;
    file_name: string;
    uploaded_time: string;
}

interface FileListResponse {
    file_list: FileResponse[];
}

const url = process.env.BACKEND_URL;

export default function MainPage() {
    const navigate = useNavigate();
    const [alignment, setAlignment] = React.useState('recent');
    const [data, setData] = React.useState<FileResponse[]>([]);
    const [files, setFiles] = React.useState<File[]>([]);
    const [open, setOpen] = React.useState<boolean>(false);
    const [message, setMessage] = React.useState<string>('');
    const [isLoading, setLoading] = React.useState<boolean>(false);
    const [uploadMode, setUploadMode] = React.useState<boolean>(false);
    const columns = [
        { title: 'File ID', field: 'file_id', hidden: true },
        { title: 'File Name', field: 'file_name' },
        {
            title: 'Upload Date',
            field: 'uploaded_time',
            render: (rowData: FileResponse) => {
                return rowData.uploaded_time.split('T')[0];
            },
        },
        {
            title: 'Actions',
            field: 'download_line',
            render: (rowData: FileResponse) => {
                return (
                    <div>
                        <button
                            onClick={() =>
                                generatePresignedUrl(rowData.file_name)
                            }
                            style={{
                                marginRight: '10px',
                            }}
                        >
                            Download File
                        </button>
                        <button
                            onClick={() => {
                                redirectLink(rowData.file_id);
                            }}
                        >
                            List File Info
                        </button>
                    </div>
                );
            },
        },
    ];

    const generatePresignedUrl = async (file_name: string) => {
        const response = await axios.post<FileLinkResponse>(
            `${url}/generate-url/download`,
            { file_name: file_name }
        );

        window.open(response.data.file_url);
    };

    const redirectLink = async (file_id: string) => {
        navigate('/file/' + file_id);
    };

    React.useEffect(() => {
        async function fetchData() {
            const response = await axios.get<FileListResponse>(
                `${url}/file-list`
            );
            setData(response.data.file_list);
        }

        fetchData();
    }, [alignment]);

    return (
        <div>
            <Header
                value={alignment}
                value_action={setAlignment}
                set_upload_mode={setUploadMode}
            />
            <Snackbar
                open={open}
                autoHideDuration={5000}
                onClose={() => setOpen(false)}
                message={message}
            />

            <Backdrop
                sx={{
                    color: '#fff',
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={isLoading}
            >
                <CircularProgress
                    sx={{
                        color: 'white',
                    }}
                />
            </Backdrop>

            <Upload
                uploadMode={uploadMode}
                files={files}
                setUploadMode={setUploadMode}
                setAlignment={setAlignment}
                setFiles={setFiles}
                setLoading={setLoading}
                setOpen={setOpen}
                setMessage={setMessage}
            />

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
                <MaterialTable
                    columns={columns}
                    data={data}
                    title="File Upload"
                    options={{
                        actionsColumnIndex: -1,
                    }}
                    style={{
                        width: '100%',
                    }}
                />
            </Box>
        </div>
    );
}
