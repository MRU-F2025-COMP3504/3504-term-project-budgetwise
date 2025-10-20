'use client';

import { ParseCSV } from '@/helpers/StatementProcessor';
import { Finger_Paint } from 'next/font/google';
import { useState } from 'react';

export default function FileUploadPage() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

  
    try {
      const text = await file.text();
      const data = ParseCSV(text);
      localStorage.setItem("parsedData",JSON.stringify(data));
      await PostCSV(formData);
    } catch (error) {
      
    }
    

    setFile(null);

  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Upload File</h1>
        
        <input
          type="file"
          accept='.csv'
          onChange={handleFileChange}
          className="w-full mb-4 p-2 border rounded"
        />
        
        {file && (
          <p className="mb-4 text-sm text-gray-600">
            Selected: {file.name}
          </p>
        )}
        
        <button
          onClick={handleUpload}
          disabled={!file}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-300"
        >
          Upload
        </button>
      </div>
    </div>
  );
}


async function PostCSV(formData){
 
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        
        if (response.ok) {
          alert('File uploaded successfully!');
          console.log(localStorage.getItem("parsedData"));
          setFile(null);
        } else {
          alert('Upload failed: ' + data.error);
        }
     
}

