const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const fs = require("fs");
const FileModel = require("../models/File");
const upload = require("../middleware/upload");

// POST /files — Upload
router.post("/", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded." });
        }

        const filePath = req.file.path;
        const fileBuffer = fs.readFileSync(filePath);
        const sha256 = crypto.createHash("sha256").update(fileBuffer).digest("hex");

        const existing = await FileModel.findOne({ sha256 });

        if (existing) {
            fs.unlinkSync(filePath);
            existing.occurrenceCount += 1;
            await existing.save();
            return res.status(200).json({
                message: "Duplicate detected. Occurrence count updated.",
                file: existing,
                duplicate: true,
            });
        }

        const newFile = new FileModel({
            name: req.file.originalname,
            size: req.file.size,
            type: req.file.mimetype,
            sha256,
            path: filePath,
            occurrenceCount: 1,
        });

        await newFile.save();

        return res.status(201).json({
            message: "File uploaded successfully.",
            file: newFile,
            duplicate: false,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error during upload." });
    }
});

// GET /files — List All
router.get("/", async (req, res) => {
    try {
        const files = await FileModel.find().sort({ uploadDate: -1 });
        const totalOccupiedSize = files.reduce((sum, f) => sum + f.size, 0);
        res.status(200).json({ files, totalOccupiedSize });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch files." });
    }
});

// DELETE /files/:id
router.delete("/:id", async (req, res) => {
    try {
        const file = await FileModel.findById(req.params.id);
        if (!file) return res.status(404).json({ error: "File not found." });

        if (file.occurrenceCount > 1) {
            file.occurrenceCount -= 1;
            await file.save();
            return res.status(200).json({
                message: "Occurrence count decremented.",
                file,
                deleted: false,
            });
        }

        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        await FileModel.findByIdAndDelete(file._id);

        return res.status(200).json({
            message: "File permanently deleted.",
            deleted: true,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete file." });
    }
});

module.exports = router;