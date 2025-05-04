import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Typography, Box } from '@mui/material';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to NearFix Connect
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Find and post local service jobs
        </Typography>
        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/signup')}
          >
            Sign Up
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Home; 