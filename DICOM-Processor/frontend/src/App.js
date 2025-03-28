import React, { useState } from 'react';
import './App.css';
import UploadComponent from './components/UploadComponent';
import DicomViewer from './components/DicomViewer';
import FilterPanel from './components/FilterPanel';
import { Container, Grid, Paper, Typography, Box } from '@mui/material';

function App() {
  const [dicomMetadata, setDicomMetadata] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [originalImageId, setOriginalImageId] = useState(null);
  const [processedImageId, setProcessedImageId] = useState(null);

  const handleFileUploaded = (metadata) => {
    setDicomMetadata(metadata);
    // Make sure to provide a default value in case fileId is undefined
    setOriginalImageId(`dicomfile:${metadata.fileId || 'placeholder'}`);
    setIsUploading(false);
  };

  const handleApplyFilter = (filterType, params) => {
    if (!dicomMetadata) return;

    fetch('http://localhost:5000/api/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileId: dicomMetadata.fileId,
        filterType: filterType,
        params: params
      }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          setProcessedImageId(`processedfile:${data.fileId}`);
        } else if (data.error) {
          console.error('Server error:', data.error);
        }
      })
      .catch(error => console.error('Error applying filter:', error));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        DICOM Image Processor
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <UploadComponent 
              onFileUploaded={handleFileUploaded} 
              isUploading={isUploading} 
            />
          </Paper>
        </Grid>
        
        {dicomMetadata && (
          <>
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <FilterPanel onApplyFilter={handleApplyFilter} />
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6">Original Image</Typography>
                <Box sx={{ height: 500, width: '100%' }}>
                  <DicomViewer imageId={originalImageId} />
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6">Processed Image</Typography>
                <Box sx={{ height: 500, width: '100%' }}>
                  {processedImageId ? (
                    <DicomViewer imageId={processedImageId} />
                  ) : (
                    <Typography color="textSecondary" align="center" sx={{ pt: 20 }}>
                      Apply a filter to see the processed image
                    </Typography>
                  )}
                </Box>
              </Paper>
            </Grid>
          </>
        )}
      </Grid>
    </Container>
  );
}

export default App;