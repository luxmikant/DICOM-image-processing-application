# DICOM Image Processing Application

This repository contains a full-stack DICOM image processing application that allows users to upload, process, and view DICOM files. The application uses a Flask-based backend and a React-based frontend to filter and display medical images efficiently.

## Features

- **DICOM Upload**  
  Users can upload DICOM files via the `/api/upload` endpoint. The backend generates a unique file ID and extracts basic metadata from the DICOM file.
  
- **Image Processing**  
  Users can apply various image processing filters (e.g., Gaussian filtering) via the `/api/process` endpoint. Processed images are saved to a designated folder for later retrieval.
  
- **Processed Image Retrieval**  
  Processed DICOM images can be retrieved via the `/api/processed/<file_id>` endpoint.

- **Frontend Integration**  
  This project includes a React frontend for displaying DICOM images using libraries like Cornerstone.

## Technologies Used

- **Backend**: Python, Flask, Flask-CORS, pydicom
- **Frontend**: React, Material UI, Cornerstone, dicom-parser
- **Other Tools**: Docker and Docker Compose for containerization, optional MongoDB integration for metadata storage

## Project Structure

```
DICOM-image-processing-application/
├── README.md                   # This file
├── docker-compose.yml          # Docker configuration for backend, frontend, and optional MongoDB
└── DICOM-Processor/
    ├── frontend/               # React application source code
    │   ├── package.json
    │   └── src/...
    └── backend/                # Flask backend code
        ├── app.py              # Main Flask application with API endpoints
        ├── filters.py          # Image processing functions (e.g., apply_gaussian)
        └── ...
```

## Getting Started

### Prerequisites

- Python 3.7+ and pip
- Node.js and npm
- (Optional) MongoDB, if integrating database support
- Docker (for containerized deployment, optional)

### Backend Setup

1. **Install Python dependencies**  
   Navigate to the backend folder and install the required packages:

   ```bash
   cd DICOM-Processor/backend
   pip install -r requirements.txt
   ```

   *If no requirements file exists, install Flask, Flask-CORS, and pydicom manually:*
   ```bash
   pip install Flask flask-cors pydicom
   ```

2. **Run the Flask application**:

   ```bash
   python app.py
   ```

   The backend runs on `http://localhost:5000`.

### Frontend Setup

1. **Install Node dependencies**:

   ```bash
   cd DICOM-Processor/frontend
   npm install
   ```

2. **Run the React application**:

   ```bash
   npm start
   ```

   The frontend runs on `http://localhost:3000`.

## API Endpoints

- **Upload DICOM File**  
  **URL**: `/api/upload`  
  **Method**: POST  
  **Description**: Upload a DICOM file. Generates a unique file ID and extracts basic metadata.

- **Process DICOM File**  
  **URL**: `/api/process`  
  **Method**: POST  
  **Description**: Applies a specified filter (e.g., Gaussian) to the uploaded DICOM file and stores the processed image.  
  **Example Payload**:

  ```json
  {
    "fileId": "unique-file-id",
    "filterType": "gaussian",
    "params": {
      "sigma": 1.0
    }
  }
  ```

- **Retrieve Processed Image**  
  **URL**: `/api/processed/<file_id>`  
  **Method**: GET  
  **Description**: Retrieves the processed DICOM image associated with the provided file ID.

## Docker Integration (Optional)

This application is containerizable with Docker and Docker Compose. To launch the backend, frontend, and MongoDB services together, run:

```bash
docker-compose up
```

## Contributing

Contributions are welcome! Please fork this repository and submit pull requests for improvements or bug fixes. For issues or feature requests, open an issue in this repository.

## License

This project is licensed under the MIT License.

## Acknowledgments

- The Cornerstone community for their excellent medical imaging libraries.
- Contributors and researchers in the DICOM image analysis field.