import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Button, TextField, Grid } from '@mui/material';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';

const StatsPage = () => {
  const [shortLinks, setShortLinks] = useState([]);
  const [clicks, setClicks] = useState([]);
  const [filteredClicks, setFilteredClicks] = useState([]);
  const [filterCode, setFilterCode] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    const links = JSON.parse(localStorage.getItem('shortLinks')) || [];
    const logs = JSON.parse(localStorage.getItem('clicks')) || [];
    setShortLinks(links);
    setClicks(logs);
    setFilteredClicks(logs);
  }, []);

  const getClickCount = (shortcode) => {
    return filteredClicks.filter(click => click.shortcode === shortcode).length;
  };

  const filterData = () => {
    const filtered = clicks.filter(click => {
      const clickTime = new Date(click.timestamp);
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;
      const matchShortcode = !filterCode || click.shortcode === filterCode;

      const matchDate = (!from || clickTime >= from) && (!to || clickTime <= to);
      return matchShortcode && matchDate;
    });

    setFilteredClicks(filtered);
  };

  const exportCSV = () => {
    const exportData = filteredClicks.map(click => {
      const link = shortLinks.find(l => l.shortUrl.endsWith(`/${click.shortcode}`));
      return {
        Shortcode: click.shortcode,
        LongURL: link?.longUrl || '',
        Expiry: link?.expiry || '',
        ClickTime: click.timestamp,
        Referrer: click.referrer,
        Geo: click.geo
      };
    });

    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'filtered-url-stats.csv');
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>📊 URL Stats</Typography>

      <Grid container spacing={2} sx={{ my: 2 }}>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Filter by Shortcode"
            fullWidth
            value={filterCode}
            onChange={e => setFilterCode(e.target.value.trim())}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <TextField
            label="From Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={fromDate}
            onChange={e => setFromDate(e.target.value)}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <TextField
            label="To Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={toDate}
            onChange={e => setToDate(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button variant="contained" color="primary" fullWidth onClick={filterData}>
            Filter
          </Button>
        </Grid>
      </Grid>

      <Button variant="contained" onClick={exportCSV}>📁 Export Filtered CSV</Button>

      {shortLinks.map((link, i) => (
        <Paper key={i} sx={{ p: 2, my: 2 }}>
          <Typography><strong>Short URL:</strong> <a href={link.shortUrl}>{link.shortUrl}</a></Typography>
          <Typography><strong>Long URL:</strong> {link.longUrl}</Typography>
          <Typography><strong>Expires:</strong> {link.expiry}</Typography>
          <Typography><strong>Filtered Clicks:</strong> {getClickCount(link.shortUrl.split('/').pop())}</Typography>
        </Paper>
      ))}
    </Container>
  );
};

export default StatsPage;
