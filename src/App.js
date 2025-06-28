import React, { useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import ShortenerForm from './components/ShortenerForm';
import StatsPage from './components/StatsPage';
import RedirectHandler from './components/RedirectHandler';
import LoggerViewer from './components/LoggerViewer';
import Navbar from './components/Navbar';
import LinkExpiredPage from './pages/LinkExpiredPage';
function App() {
  const [mode, setMode] = useState('light');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar toggleTheme={toggleTheme} currentMode={mode} />
        <Routes>
          <Route path="/" element={<ShortenerForm />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/logs" element={<LoggerViewer />} />
          <Route path="/:shortcode" element={<RedirectHandler />} />
          <Route path="/link-expired" element={<LinkExpiredPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
