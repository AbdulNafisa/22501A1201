import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, List, ListItem, ListItemText, Button, Stack } from '@mui/material';

const LoggerViewer = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const logEntries = [];
    for (let key in localStorage) {
      if (key.startsWith('log-')) {
        try {
          const entry = JSON.parse(localStorage.getItem(key));
          logEntries.push(entry);
        } catch (e) {
          // skip broken logs
        }
      }
    }

    // Sort by timestamp
    logEntries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    setLogs(logEntries);
  }, []);

  const clearLogs = () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('log-')) {
        localStorage.removeItem(key);
      }
    });
    setLogs([]);
  };

  const exportLogs = () => {
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'logs.json';
    a.click();
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>📋 Logger Viewer</Typography>

      <Stack direction="row" spacing={2} mb={2}>
        <Button variant="outlined" color="error" onClick={clearLogs}>
          🗑️ Clear Logs
        </Button>
        <Button variant="contained" onClick={exportLogs}>
          ⬇️ Export Logs
        </Button>
      </Stack>

      {logs.length === 0 ? (
        <Typography>No logs found.</Typography>
      ) : (
        <Paper sx={{ padding: 2 }}>
          <List>
            {logs.map((log, idx) => (
              <ListItem key={idx} divider>
                <ListItemText
                  primary={`🕒 ${log.timestamp} — ${log.message}`}
                  secondary={JSON.stringify(log, null, 2)}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Container>
  );
};

export default LoggerViewer;
