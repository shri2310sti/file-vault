import { useState, useEffect, useCallback } from "react";
import { getFiles, uploadFile, deleteFile } from "../services/api";

export function useFiles() {
    const [files, setFiles] = useState([]);
    const [totalSize, setTotalSize] = useState(0);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [toast, setToast] = useState(null);

    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    const fetchFiles = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await getFiles();
            console.log("API response:", data); // 👈 temp log — remove after fixing
            setFiles(data.files ?? []);
            setTotalSize(data.totalOccupiedSize ?? 0);
        } catch {
            showToast("Failed to load files.", "error");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFiles();
    }, [fetchFiles]);

    const upload = async (file) => {
        const fd = new FormData();
        fd.append("file", file);
        setUploading(true);
        setProgress(0);
        try {
            const { data } = await uploadFile(fd, setProgress);
            showToast(data.duplicate ? "Duplicate detected — count updated!" : "File uploaded!", "success");
            await fetchFiles();
        } catch {
            showToast("Upload failed.", "error");
        } finally {
            setUploading(false);
            setProgress(0);
        }
    };

    const remove = async (id) => {
        try {
            const { data } = await deleteFile(id);
            showToast(data.deleted ? "File permanently deleted." : "Occurrence decremented.", "success");
            await fetchFiles();
        } catch {
            showToast("Delete failed.", "error");
        }
    };

    return { files, totalSize, loading, uploading, progress, toast, upload, remove };
}