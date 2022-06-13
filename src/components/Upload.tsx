import { Box, Modal } from '@mui/material';
import Dropzone from 'react-dropzone';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import axios from 'axios';

interface UploadProps {
    uploadMode: boolean;
    files: File[];
    setUploadMode: (uploadMode: boolean) => void;
    setAlignment: (alignment: string) => void;
    setFiles: (files: File[]) => void;
    setLoading: (loading: boolean) => void;
    setOpen: (open: boolean) => void;
    setMessage: (message: string) => void;
}

interface FileLinkResponse {
    file_name: string;
    file_url: string;
    file: File;
}

export function Upload(props: UploadProps) {
    const {
        uploadMode,
        files,
        setUploadMode,
        setAlignment,
        setFiles,
        setLoading,
        setOpen,
        setMessage,
    } = props;

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

    return (
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
    );
}
