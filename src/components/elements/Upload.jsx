import { useState, useEffect,useRef } from "react";
import "src/assets/styles/upload.css";

export default function Upload({ onFilesSelected }) {
  const [files, setFiles] = useState([]);
  const fileInput = useRef()
  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const newFiles = Array.from(selectedFiles);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles.length > 0) {
      const newFiles = Array.from(droppedFiles);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const handleRemoveFile = (e, index) => {
    e.stopPropagation();
    e.preventDefault();
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    if (fileInput.current) {
      fileInput.current.value = null;
    }
  };

  useEffect(() => {
    if (files.length == 0) return undefined;
    onFilesSelected(files);
  }, [files, onFilesSelected]);


  return (
    <div className="upload-wrapper">
    <label
      htmlFor="dropzone-file"
      className="dropzone"
      onDrop={handleDrop}
      onDragOver={(event) => event.preventDefault()}
    >
      <div className="dropzone-container">
        <svg
          className="upload-icon"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 16"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
          />
        </svg>
        <p className="upload-title">
          <span className="font-semibold">Click to upload</span> or drag and
          drop
        </p>

        {files.length > 0 && (
        <div className="file-list">
          <div className="file-list__container">
            {files.map((file, index) => (
              <div className="file-item" key={index}>
                <div className="file-info">
                  <p>{file.name}</p>
                  {/* <p>{file.type}</p> */}
                </div>
                <div className="file-actions">
                  <button onClick={(e) => handleRemoveFile(e,index)}>x</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
        {files.length > 0 && (
          <p className="upload-title">
            <span className="font-semibold">{files.length}</span> file(s)
            selected
          </p>
        )}
      </div>
      <input
        id="dropzone-file"
        type="file"
        hidden
        ref={fileInput}
        onChange={handleFileChange}
      />
    </label>
  </div>
  );
}