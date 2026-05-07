import { useRef, useState } from "react";

export default function UploadZone({ onUpload, uploading, progress }) {
    const inputRef = useRef();
    const [dragging, setDragging] = useState(false);

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) onUpload(file);
    };

    const handleChange = (e) => {
        if (e.target.files[0]) onUpload(e.target.files[0]);
    };

    return (
        <div
            className={`upload-zone ${dragging ? "dragging" : ""} ${uploading ? "uploading" : ""}`}
            onClick={() => !uploading && inputRef.current.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
        >
            <input ref={inputRef} type="file" hidden onChange={handleChange} />

            {uploading ? (
                <div className="upload-progress">
                    <div className="progress-ring">
                        <svg viewBox="0 0 60 60">
                            <circle cx="30" cy="30" r="26" />
                            <circle
                                cx="30" cy="30" r="26"
                                style={{ strokeDashoffset: 163.36 - (163.36 * progress) / 100 }}
                            />
                        </svg>
                        <span>{progress}%</span>
                    </div>
                    <p>Uploading…</p>
                </div>
            ) : (
                <div className="upload-idle">
                    <div className="upload-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M12 16V8m0 0-3 3m3-3 3 3" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <p className="upload-title">Drop file here or <span>browse</span></p>
                    <p className="upload-sub">Any file up to 50 MB</p>
                </div>
            )}
        </div>
    );
}