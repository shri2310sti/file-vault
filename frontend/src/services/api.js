import axios from "axios";

const BASE = import.meta.env.VITE_API_URL;

export const uploadFile = (formData, onProgress) =>
    axios.post(`${BASE}/files`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
            if (onProgress) onProgress(Math.round((e.loaded * 100) / e.total));
        },
    });

export const getFiles = () => axios.get(`${BASE}/files`);

export const deleteFile = (id) => axios.delete(`${BASE}/files/${id}`);