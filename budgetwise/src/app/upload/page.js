'use client'
import { useState } from 'react'

export default function UploadPage() {
  const [file, setFile] = useState(null)
  const [message, setMessage] = useState('')
  const [preview, setPreview] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!file) return setMessage('Please select a file first')

    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/statements', {
      method: 'POST',
      body: formData,
    })

    const data = await res.json()
    if (res.ok) {
      setMessage(`✅ Uploaded successfully: ${data.file}`)
      console.log(data);
      localStorage.setItem('parsed_transaction',JSON.stringify(data.transaction) );
    } else {
      setMessage(`❌ Upload failed: ${data.error}`)
    }
  }

  function handleFileChange(e) {
    const selected = e.target.files?.[0]
    setFile(selected)
    if (selected) {
      setPreview(selected.name)
      setMessage('')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-2xl font-semibold mb-4">Upload CSV File</h1>
      <form
        onSubmit={handleSubmit}
        className="border-2 border-dashed border-gray-400 rounded-xl p-6 w-full max-w-md flex flex-col items-center"
      >
        <input
          type="file"
          name="file"
          accept=".csv"
          onChange={handleFileChange}
          className="mb-4"
        />
        {preview && (
          <p className="text-sm text-gray-600 mb-2">Selected: {preview}</p>
        )}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Upload
        </button>
      </form>
      {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
    </div>
  )
}
