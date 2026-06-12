import  { useRef, useState } from 'react';

const ResumeUpload = ({ currentResumeUrl, onUpload }) => {
  const fileRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setMessage('Only PDF files are accepted.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setMessage('File size must be under 5MB.');
      return;
    }

    setUploading(true);
    setMessage('');
    const result = await onUpload(file);
    setUploading(false);
    setMessage(result.success ? 'Resume uploaded!' : result.message);
  };

  return (
    <div className="resume-upload">
      <h3>Resume</h3>
      {currentResumeUrl ? (
        <div className="resume-current">
          <span>📄</span>
          <a href={currentResumeUrl} target="_blank" rel="noopener noreferrer">
            View current resume
          </a>
          <button onClick={() => fileRef.current.click()} className="btn-secondary">
            Replace
          </button>
        </div>
      ) : (
        <div
          className="resume-dropzone"
          onClick={() => fileRef.current.click()}
        >
          <span>📎</span>
          <p>Click to upload your resume (PDF, max 5MB)</p>
        </div>
      )}
      <input
        type="file"
        ref={fileRef}
        accept="application/pdf"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      {uploading && <p className="upload-status">Uploading...</p>}
      {message && <p className={`upload-message ${message.includes('!') ? 'success' : 'error'}`}>{message}</p>}
    </div>
  );
};

export default ResumeUpload;