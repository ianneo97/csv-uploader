import { CssBaseline, ThemeProvider } from '@mui/material';
import { FC } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import FileInfoPage from './pages/FileInfoPage';
import MainPage from './pages/MainPage';
import theme from './theme/theme';

const App: FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <Routes>
                    <Route path="" element={<MainPage />}></Route>
                    <Route path="file/:file_id" element={<FileInfoPage />}></Route>
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
};

export default App;
