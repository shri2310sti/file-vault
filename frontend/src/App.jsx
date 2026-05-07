import UploadZone from "./components/UploadZone";
import FileCard from "./components/FileCard";
import StatsBar from "./components/StatsBar";
import { useFiles } from "./hooks/useFiles";
import "./App.css";

export default function App() {
  const { files, totalSize, loading, uploading, progress, toast, upload, remove } = useFiles();

  return (
    <div className="app">
      {/* Toast */}
      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}

      <header className="header">
        <div className="logo">
          <span className="logo-icon">🔐</span>
          <div>
            <h1>File Vault</h1>
            <p>Secure · Deduplicated · Smart</p>
          </div>
        </div>
        <StatsBar total={totalSize} count={files.length} />
      </header>

      <main className="main">
        <section className="upload-section">
          <h2>Upload a File</h2>
          <UploadZone onUpload={upload} uploading={uploading} progress={progress} />
        </section>

        <section className="files-section">
          <h2>Your Files <span className="count-badge">{files.length}</span></h2>
          {loading ? (
            <div className="loading">
              <div className="spinner" />
              <p>Loading vault…</p>
            </div>
          ) : files.length === 0 ? (
            <div className="empty">
              <span>🗃️</span>
              <p>No files yet. Upload something!</p>
            </div>
          ) : (
            <div className="file-grid">
              {files.map((f) => (
                <FileCard key={f._id} file={f} onDelete={remove} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}