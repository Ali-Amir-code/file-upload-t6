import express from "express";
import Upload from "../models/File.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/**
 * @route   GET /files
 * @desc    Get metadata list of all the user’s files
 * @access  Private
 */
router.get("/files", auth, async (req, res) => {
  try {
    const files = await Upload.find({ user: req.user.id }).select("name file uploadAt");
    const list = files.map((f) => ({
      name:     f.name,
      size:     f.file.data.length,        // size in bytes
      type:     f.file.contentType,
      uploadAt: f.uploadAt,
    }));
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

/**
 * @route   GET /file
 * @query   filename=<filename>
 * @desc    Get metadata about one specific file (if it belongs to the user)
 * @access  Private
 */
router.get("/file", auth, async (req, res) => {
  const { filename } = req.query;
  if (!filename) return res.status(400).json({ msg: "filename query is required" });

  try {
    const f = await Upload.findOne({ user: req.user.id, name: filename }).select("name file uploadAt");
    if (!f) return res.status(404).json({ msg: "File not found" });

    res.json({
      name:     f.name,
      size:     f.file.data.length,
      type:     f.file.contentType,
      uploadAt: f.uploadAt,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
