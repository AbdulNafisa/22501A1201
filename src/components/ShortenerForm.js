import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Grid, Paper } from '@mui/material';
import logger from '../middleware/logger';
import { v4 as uuidv4 } from 'uuid';
import { removeExpiredLinks } from '../utils/cleanExpired'; // Make sure this utility exists

const ShortenerForm = () => {
  const [urls, setUrls] = useState([
    { id: uuidv4(), longUrl: '', validity: '', shortcode: '' }
  ]);
  const [results, setResults] = useState([]);

  // 🧹 Clean up expired links on mount
  useEffect(() => {
    removeExpiredLinks();
  }, []);

  const handleChange = (id, field, value) => {
    setUrls(prev =>
      prev.map(item => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const addField = () => {
    if (urls.length < 5) {
      setUrls([...urls, { id: uuidv4(), longUrl: '', validity: '', shortcode: '' }]);
    }
  };

  const handleSubmit = () => {
    const newResults = urls.map((urlObj) => {
      if (!urlObj.longUrl.trim()) return null;

      const short = urlObj.shortcode || Math.random().toString(36).substring(2, 8);
      const validMin = urlObj.validity ? parseInt(urlObj.validity, 10) : 30;
      const expiry = new Date(Date.now() + validMin * 60000).toISOString(); // ✅ ISO format

      const result = {
        ...urlObj,
        shortcode: short,
        shortUrl: `http://localhost:3000/${short}`,
        expiry,
      };

      logger("URL Shortened", result);
      return result;
    }).filter(Boolean);

    // Save to localStorage
    const stored = JSON.parse(localStorage.getItem('shortLinks')) || [];
    const updated = [...stored, ...newResults];
    localStorage.setItem('shortLinks', JSON.stringify(updated));

    removeExpiredLinks(); // Optional: Clean up after save
    setResults(newResults);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>🔗 URL Shortener</Typography>
      
      {urls.map((url, index) => (
        <Paper key={url.id} sx={{ padding: 2, marginBottom: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Original Long URL"
                value={url.longUrl}
                onChange={(e) => handleChange(url.id, 'longUrl', e.target.value)}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                label="Validity (mins)"
                type="number"
                value={url.validity}
                onChange={(e) => handleChange(url.id, 'validity', e.target.value)}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                label="Custom Shortcode"
                value={url.shortcode}
                onChange={(e) => handleChange(url.id, 'shortcode', e.target.value)}
              />
            </Grid>
          </Grid>
        </Paper>
      ))}

      <Button
        variant="outlined"
        onClick={addField}
        disabled={urls.length >= 5}
      >
        + Add Another
      </Button>

      <Button
        variant="contained"
        color="primary"
        sx={{ ml: 2 }}
        onClick={handleSubmit}
      >
        Shorten
      </Button>

      {results.length > 0 && (
        <>
          <Typography variant="h6" mt={4}>✅ Shortened URLs:</Typography>
          {results.map((res, idx) => (
            <Paper key={idx} sx={{ p: 2, mt: 1 }}>
              <Typography><strong>Short URL:</strong> <a href={res.shortUrl}>{res.shortUrl}</a></Typography>
              <Typography><strong>Expires At:</strong> {new Date(res.expiry).toLocaleString()}</Typography>
            </Paper>
          ))}
        </>
      )}
    </Container>
  );
};

export default ShortenerForm;
