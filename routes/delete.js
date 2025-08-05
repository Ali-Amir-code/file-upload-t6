import express from "express";
import Upload from "../models/File.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.delete("/", auth, async (req, res) => {
  const { filename } = req.query;
  const userId = req.user.id;

  try {
    if (filename) {
      const deleted = await Upload.findOneAndDelete({ user: userId, name: filename });
      if (!deleted) {
        return res.status(404).json({ msg: "File not found or not yours" });
      }
      return res.json({ msg: `Deleted file: ${filename}` });
    } else {
      const result = await Upload.deleteMany({ user: userId });
      if (result.deletedCount === 0) {
        return res.status(404).json({ msg: "No files to delete" });
      }
      return res.json({ msg: `Deleted ${result.deletedCount} file(s)` });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
