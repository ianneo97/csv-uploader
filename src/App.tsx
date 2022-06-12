import { CssBaseline, ThemeProvider } from '@mui/material';
import { FC } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import MainPage from './pages/MainPage';
import theme from './theme/theme';

const App: FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <Routes>
                    <Route path="" element={<MainPage />}></Route>
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
};

export default App;
