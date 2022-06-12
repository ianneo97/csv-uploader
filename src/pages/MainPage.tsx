import FileUploadIcon from '@mui/icons-material/FileUpload';
import {
    Backdrop,
    Box,
    CircularProgress,
    Modal,
    Snackbar,
} from '@mui/material';
import axios from 'axios';
import MaterialTable from 'material-table';
import * as React from 'react';
import Dropzone from 'react-dropzone';
import Header from '../components/Header';

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

export default function MainPage() {
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
                    <button
                        onClick={() => generatePresignedUrl(rowData.file_name)}
                    >
                        Download File
                    </button>
                );
            },
        },
    ];

    const generatePresignedUrl = async (file_name: string) => {
        const response = await axios.post<FileLinkResponse>(
            'http://localhost:8080/generate-url/download',
            { file_name: file_name }
        );

        window.open(response.data.file_url);
    };

    const handleClose = (_: any, reason: string) => {
        setUploadMode(false);
        setAlignment('recent');
    };

    const onDrop = (uploaded_files: File[]) => {
        setFiles([...files, ...uploaded_files]);
    };

    const uploadFiles = async () => {
        setLoading(true);
        setUploadMode(false);

        const response: FileLinkResponse[] = await Promise.all(
            files.map(async (file) => {
                const response = await axios.post<FileLinkResponse>(
                    'http://localhost:8080/generate-url/upload',
                    { file_name: file.name }
                );

                return { ...response.data, file: file };
            })
        );

        await Promise.all(
            response.map(async (file: FileLinkResponse) => {
                const form_data = new FormData();
                form_data.append('file', file.file);

                await axios.put(file.file_url, form_data);
            })
        );

        const timer = setTimeout(() => {
            setFiles([]);
            setUploadMode(false);
            setOpen(true);
            setMessage('File uploaded successfully');
            setAlignment('recent');
            setLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    };

    React.useEffect(() => {
        async function fetchData() {
            const response = await axios.get<FileListResponse>(
                'http://localhost:8080/file-list'
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

            <Modal
                open={uploadMode}
                onClose={(event, reason) => handleClose(event, reason)}
                disableEscapeKeyDown={true}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: 400,
                        bgcolor: 'background.paper',
                        transform: 'translate(-50%, -50%)',
                        boxShadow: 24,
                        p: 4,
                        border: '1px solid #000',
                    }}
                >
                    <div>
                        <Dropzone onDrop={onDrop}>
                            {({ getRootProps, getInputProps }) => (
                                <section>
                                    <Box
                                        sx={{
                                            p: 4,
                                            border: '1px dashed',
                                            textAlign: 'center',
                                        }}
                                    >
                                        <FileUploadIcon
                                            sx={{
                                                color: '#bbbbbb',
                                                fontSize: '46px',
                                            }}
                                        />
                                        <div {...getRootProps()}>
                                            <input {...getInputProps()} />
                                            {files &&
                                            Array.isArray(files) &&
                                            files.length > 0 ? (
                                                <div className="selected-file">
                                                    {files.length > 3
                                                        ? `${files.length} files`
                                                        : files
                                                              .map(
                                                                  (file) =>
                                                                      file.name
                                                              )
                                                              .join(', ')}
                                                </div>
                                            ) : (
                                                `Drag and drop files here, or click to select files`
                                            )}
                                        </div>
                                    </Box>
                                    <br />
                                    <aside className="selected-file-wrapper">
                                        <button
                                            className="btn btn-success"
                                            disabled={!files}
                                            onClick={uploadFiles}
                                            style={{
                                                float: 'right',
                                            }}
                                        >
                                            Upload
                                        </button>
                                    </aside>
                                </section>
                            )}
                        </Dropzone>
                    </div>
                </Box>
            </Modal>
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
