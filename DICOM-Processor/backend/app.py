# backend/app.py
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import pydicom
import os
import uuid
from filters import apply_gaussian



app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'temp_uploads'
PROCESSED_FOLDER = 'processed'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    # Generate a unique file ID
    file_id = str(uuid.uuid4())
    file_ext = os.path.splitext(file.filename)[1]
    filepath = os.path.join(UPLOAD_FOLDER, f"{file_id}{file_ext}")
    file.save(filepath)
    
    # Read basic DICOM metadata
    try:
        ds = pydicom.dcmread(filepath)
        metadata = {
            'fileId': file_id,
            'filename': file.filename,
            'PatientID': getattr(ds, 'PatientID', 'Unknown'),
            'Modality': getattr(ds, 'Modality', 'Unknown'),
            'StudyDate': getattr(ds, 'StudyDate', 'Unknown'),
            'Rows': getattr(ds, 'Rows', 0),
            'Columns': getattr(ds, 'Columns', 0),
        }
        return jsonify(metadata)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/process', methods=['POST'])
def process_image():
    data = request.json
    file_id = data.get('fileId')
    filter_type = data.get('filterType', 'gaussian')
    params = data.get('params', {})
    
    # Find the file by ID
    for filename in os.listdir(UPLOAD_FOLDER):
        if file_id in filename:
            input_path = os.path.join(UPLOAD_FOLDER, filename)
            
            try:
                if filter_type == 'gaussian':
                    sigma = float(params.get('sigma', 1.0))
                    output_path = apply_gaussian(input_path, sigma)
                    
                    return jsonify({
                        'status': 'success',
                        'fileId': file_id,
                        'processedPath': output_path,
                        'filter': filter_type
                    })
                else:
                    return jsonify({'error': f'Filter type {filter_type} not implemented'}), 400
            except Exception as e:
                return jsonify({'error': str(e)}), 500
    
    return jsonify({'error': 'File not found'}), 404

@app.route('/api/processed/<file_id>', methods=['GET'])
def get_processed(file_id):
    # Find the processed file
    for filename in os.listdir(PROCESSED_FOLDER):
        if file_id in filename:
            return send_file(os.path.join(PROCESSED_FOLDER, filename))
            
    return jsonify({'error': 'Processed file not found'}), 404

if __name__ == '__main__':
    app.run(debug=True)