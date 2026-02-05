import {  Box, Typography, Button } from "@mui/material";

export function ErrorFallback({ error, resetErrorBoundary }: any) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      textAlign="center"
      p={3}
    >
      <Typography variant="h4" color="error" gutterBottom>
        Something went wrong
      </Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
        {error.message}
      </Typography>
      <Button variant="contained" color="primary" onClick={resetErrorBoundary}>
        Try Again
      </Button>
    
    </Box>
  );
}
