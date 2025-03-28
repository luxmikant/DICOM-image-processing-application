import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, Button, CircularProgress, Paper } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const UploadComponent = ({ onFileUploaded, isUploading: externalUploading }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  
  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];
    if (!file) return;
    
    setIsUploading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('file', file);
    
    fetch('http://localhost:5000/api/upload', {
      method: 'POST',
      body: formData,
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(data => {
            throw new Error(data.error || 'Upload failed');
          });
        }
        return response.json();
      })
      .then(data => {
        onFileUploaded(data);
        setIsUploading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setError(error.message || 'Failed to upload file');
        setIsUploading(false);
      });
  }, [onFileUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'application/dicom': ['.dcm'],
      'application/octet-stream': ['.dcm']
    },
    multiple: false
  });

  const uploading = isUploading || externalUploading;

  return (
    <Box>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      
      <Paper
        {...getRootProps()}
        sx={{
          p: 3,
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: isDragActive ? 'rgba(0, 0, 0, 0.05)' : 'white',
          border: '2px dashed #cccccc',
          borderRadius: 2,
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.05)'
          }
        }}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <CircularProgress />
        ) : (
          <>
            <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6">Drag & drop a DICOM file here</Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1, mb: 2 }}>
              or click to select a file
            </Typography>
            <Button variant="contained" color="primary">
              Select File
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default UploadComponent;