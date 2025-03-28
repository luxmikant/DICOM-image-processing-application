# backend/test_api.py
import requests
import os
import json

# Replace with your actual DICOM file path
DICOM_FILE_PATH = "path/to/your/test.dcm"

def test_upload():
    url = "http://localhost:5000/api/upload"
    
    if not os.path.exists(DICOM_FILE_PATH):
        print(f"Test file not found: {DICOM_FILE_PATH}")
        return
    
    with open(DICOM_FILE_PATH, 'rb') as f:
        files = {'file': f}
        response = requests.post(url, files=files)
    
    print("Upload Response:")
    print(json.dumps(response.json(), indent=2))
    return response.json()

def test_process(file_id):
    url = "http://localhost:5000/api/process"
    data = {
        "fileId": file_id,
        "filterType": "gaussian",
        "params": {
            "sigma": 1.5
        }
    }
    
    response = requests.post(url, json=data)
    print("Process Response:")
    print(json.dumps(response.json(), indent=2))

if __name__ == "__main__":
    result = test_upload()
    if result and 'fileId' in result:
        test_process(result['fileId'])