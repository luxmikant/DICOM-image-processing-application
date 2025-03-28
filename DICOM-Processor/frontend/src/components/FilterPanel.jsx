import React, { useState } from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Slider, Button, Grid } from '@mui/material';

const FilterPanel = ({ onApplyFilter }) => {
  const [filterType, setFilterType] = useState('gaussian');
  const [params, setParams] = useState({ sigma: 1.0 });
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleParamChange = (param, value) => {
    setParams(prev => ({ ...prev, [param]: value }));
  };
  
  const handleApply = () => {
    setIsProcessing(true);
    
    onApplyFilter(filterType, params);
    
    // Reset processing state after a short delay to show feedback
    setTimeout(() => {
      setIsProcessing(false);
    }, 1000);
  };
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>Image Filter Options</Typography>
      
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel id="filter-type-label">Filter Type</InputLabel>
            <Select
              labelId="filter-type-label"
              id="filter-type"
              value={filterType}
              label="Filter Type"
              onChange={(e) => setFilterType(e.target.value)}
            >
              <MenuItem value="gaussian">Gaussian Smoothing</MenuItem>
              <MenuItem value="median">Median Filter</MenuItem>
              <MenuItem value="bilateral">Edge-Preserving Bilateral</MenuItem>
              <MenuItem value="clahe">Contrast Enhancement (CLAHE)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        {filterType === 'gaussian' && (
          <Grid item xs={12} md={4}>
            <Typography id="sigma-slider-label" gutterBottom>
              Sigma: {params.sigma.toFixed(1)}
            </Typography>
            <Slider
              value={params.sigma}
              onChange={(_, value) => handleParamChange('sigma', value)}
              step={0.1}
              min={0.1}
              max={5}
              aria-labelledby="sigma-slider-label"
            />
          </Grid>
        )}
        
        {filterType === 'bilateral' && (
          <Grid item xs={12} md={4}>
            <Typography id="sigma-spatial-slider-label" gutterBottom>
              Spatial Sigma: {params.sigmaSpatial || 1.5}
            </Typography>
            <Slider
              value={params.sigmaSpatial || 1.5}
              onChange={(_, value) => handleParamChange('sigmaSpatial', value)}
              step={0.1}
              min={0.1}
              max={5}
              aria-labelledby="sigma-spatial-slider-label"
            />
          </Grid>
        )}
        
        {filterType === 'clahe' && (
          <Grid item xs={12} md={4}>
            <Typography id="clip-limit-slider-label" gutterBottom>
              Clip Limit: {params.clipLimit || 0.03}
            </Typography>
            <Slider
              value={params.clipLimit || 0.03}
              onChange={(_, value) => handleParamChange('clipLimit', value)}
              step={0.01}
              min={0.01}
              max={0.5}
              aria-labelledby="clip-limit-slider-label"
            />
          </Grid>
        )}
        
        <Grid item xs={12} md={4}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleApply}
            disabled={isProcessing}
            fullWidth
          >
            {isProcessing ? 'Processing...' : 'Apply Filter'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FilterPanel;