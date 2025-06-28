import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LinkExpiredPage = () => {
  const navigate = useNavigate();

  return (
    <Container sx={{ textAlign: 'center', mt: 8 }}>
      <Typography variant="h3" gutterBottom color="error">⏳ Link Expired</Typography>
      <Typography variant="h6" gutterBottom>
        The shortened URL you are trying to access has expired or is no longer valid.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/')}
        sx={{ mt: 3 }}
      >
        🔗 Create New Short Link
      </Button>
    </Container>
  );
};

export default LinkExpiredPage;
