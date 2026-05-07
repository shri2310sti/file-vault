const BASE = import.meta.env.VITE_API_URL;

const ICONS = {
    image: "🖼️", video: "🎬", audio: "🎵", pdf: "📄",
    zip: "🗜️", text: "📝", default: "📁",
};

function getIcon(type) {
    if (type.startsWith("image/")) return ICONS.image;
    if (type.startsWith("video/")) return ICONS.video;
    if (type.startsWith("audio/")) return ICONS.audio;
    if (type === "application/pdf") return ICONS.pdf;
    if (type.includes("zip") || type.includes("rar")) return ICONS.zip;
    if (type.startsWith("text/")) return ICONS.text;
    return ICONS.default;
}

function fmtSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(2)} MB`;
}

export default function FileCard({ file, onDelete }) {
    const isImage = file.type.startsWith("image/");
    const imgUrl = `${BASE}/${file.path.replace(/\\/g, "/")}`;

    return (
        <div className="file-card">
            <div className="file-preview">
                {isImage ? (
                    <img src={imgUrl} alt={file.name} />
                ) : (
                    <span className="file-icon">{getIcon(file.type)}</span>
                )}
            </div>

            <div className="file-info">
                <p className="file-name" title={file.name}>{file.name}</p>
                <div className="file-meta">
                    <span>{fmtSize(file.size)}</span>
                    <span className="dot">·</span>
                    <span>{file.type.split("/")[1]?.toUpperCase()}</span>
                    <span className="dot">·</span>
                    <span className="occur">×{file.occurrenceCount}</span>
                </div>
                <p className="file-date">{new Date(file.uploadDate).toLocaleDateString()}</p>
            </div>

            <button className="delete-btn" onClick={() => onDelete(file._id)} title="Delete">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
        </div>
    );
}