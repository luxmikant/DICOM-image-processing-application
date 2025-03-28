# backend/filters.py
import numpy as np
import pydicom
from scipy.ndimage import gaussian_filter
import os
from pydicom.uid import ExplicitVRLittleEndian

PROCESSED_FOLDER = 'processed'
os.makedirs(PROCESSED_FOLDER, exist_ok=True)

def apply_gaussian(dicom_path, sigma=1.0):
    """
    Apply Gaussian filter to DICOM image
    
    Parameters:
    -----------
    dicom_path : str
        Path to the input DICOM file
    sigma : float
        Standard deviation for Gaussian kernel
        
    Returns:
    --------
    str
        Path to the processed DICOM file
    """
    # Read the DICOM file
    ds = pydicom.dcmread(dicom_path)
    
    # Convert to NumPy array and apply filter
    img_array = ds.pixel_array.astype(np.float32)
    filtered = gaussian_filter(img_array, sigma=sigma)
    
    # Convert back to original data type
    if hasattr(ds, 'PixelRepresentation') and ds.PixelRepresentation == 1:
        filtered = np.clip(filtered, np.iinfo(ds.pixel_array.dtype).min, np.iinfo(ds.pixel_array.dtype).max)
    else:
        filtered = np.clip(filtered, 0, np.iinfo(ds.pixel_array.dtype).max)
    
    filtered = filtered.astype(ds.pixel_array.dtype)
    
    # Create new DICOM object with filtered pixels
    ds_filtered = ds.copy()
    
    # Change transfer syntax to uncompressed - this is the fix for the error
    ds_filtered.file_meta.TransferSyntaxUID = ExplicitVRLittleEndian
    
    # Set the pixel data
    ds_filtered.PixelData = filtered.tobytes()
    
    # Save to processed folder
    base_filename = os.path.basename(dicom_path)
    file_id = os.path.splitext(base_filename)[0]
    output_path = os.path.join(PROCESSED_FOLDER, f"{file_id}_gaussian_{sigma}.dcm")
    ds_filtered.save_as(output_path)
    
    return output_path