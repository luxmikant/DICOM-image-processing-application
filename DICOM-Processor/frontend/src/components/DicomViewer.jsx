import React, { useEffect, useRef, useState } from 'react';
import cornerstone from 'cornerstone-core';
import { Box, Typography } from '@mui/material';
import { initCornerstone } from '../utils/cornerstoneSetup';

// Ensure Cornerstone is initialized so loaders are registered
initCornerstone();

const DicomViewer = ({ imageId }) => {
  const viewportRef = useRef(null);
  const [error, setError] = useState(null);

  // Enable the element for Cornerstone on mount
  useEffect(() => {
    const element = viewportRef.current;
    if (!element) return;
    
    try {
      cornerstone.enable(element);
    } catch (e) {
      console.error('Error enabling cornerstone:', e);
      setError('Failed to initialize viewer');
    }
    
    return () => {
      if (element) {
        try {
          cornerstone.disable(element);
        } catch (e) {
          console.error('Error disabling cornerstone:', e);
        }
      }
    };
  }, []);

  // Load and display image when imageId changes
  useEffect(() => {
    if (!imageId) return;
    const element = viewportRef.current;
    if (!element) return;
    
    console.log("Loading image:", imageId);
    // Optionally log the scheme for debugging:
    const scheme = imageId.split(':')[0];
    console.log("Image scheme:", scheme);
    
    // Remove strict loader check: assume that using registerImageLoader means the loader exists.
    setError(null); // Clear any previous error

    cornerstone.loadImage(imageId)
      .then(image => {
        try {
          cornerstone.displayImage(element, image);
        } catch (displayError) {
          console.error('Error displaying image:', displayError);
          setError(`Display error: ${displayError.message}`);
        }
      })
      .catch(loadError => {
        console.error('Error loading image:', loadError);
        setError(`Loading error: ${loadError.message}`);
      });
  }, [imageId]);

  return (
    <Box sx={{
      width: '100%', 
      height: '100%',
      position: 'relative',
      backgroundColor: '#000',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {error ? (
        <Typography color="error">{error}</Typography>
      ) : !imageId ? (
        <Typography color="textSecondary">No image selected</Typography>
      ) : (
        <div
          ref={viewportRef}
          style={{ width: '100%', height: '100%', position: 'relative' }}
        />
      )}
    </Box>
  );
};

export default DicomViewer;