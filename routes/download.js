import express from "express";
import archiver from "archiver";
import Upload from "../models/File.js";
import auth from "../middleware/auth.js";

const router = express.Router();


router.get("/files", auth, async (req, res) => {
  try {
    const files = await Upload.find({ user: req.user.id });
    if (!files.length) {
      return res.status(404).json({ msg: "No files found" });
    }

    res.set({
      "Content-Type": "application/zip",
      "Content-Disposition": 'attachment; filename="all_files.zip"',
    });

    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.on("error", (err) => res.status(500).send({ error: err.message }));
    archive.pipe(res);

    files.forEach((f) => {
      archive.append(f.file.data, { name: f.name });
    });

    archive.finalize();
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

/**
 * @route   GET /download/file
 * @query   filename=<filename>
 * @desc    Download a single file by its original name (only if it belongs to the user)
 * @access  Private
 */
router.get("/file", auth, async (req, res) => {
  const { filename } = req.query;
  if (!filename) return res.status(400).json({ msg: "filename query is required" });

  try {
    const file = await Upload.findOne({ user: req.user.id, name: filename });
    if (!file) return res.status(404).json({ msg: "File not found" });

    res.set({
      "Content-Type": file.file.contentType,
      "Content-Disposition": `attachment; filename="${file.name}"`,
    });
    res.send(file.file.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;