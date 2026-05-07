function fmtSize(bytes) {
    if (!bytes) return "0 B";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(2)} MB`;
}

export default function StatsBar({ total, count }) {
    return (
        <div className="stats-bar">
            <div className="stat">
                <span className="stat-val">{count}</span>
                <span className="stat-label">Unique Files</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
                <span className="stat-val">{fmtSize(total)}</span>
                <span className="stat-label">Occupied Storage</span>
            </div>
        </div>
    );
}