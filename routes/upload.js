import express from "express";
import multer from "multer";
import Upload from "../models/File.js";
import auth from "../middleware/auth.js";

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024   
  },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/gif", "application/pdf"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "Only images and PDFs are allowed"));
    }
  }
});

router.post("/", auth, upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ msg: "No file provided" });
  }

  try {
    const { originalname, mimetype, buffer } = req.file;

    const newFile = new Upload({
      name: originalname,
      file: {
        data: buffer,
        contentType: mimetype
      },
      user: req.user.id
    });

    await newFile.save();
    res.json({ msg: "File uploaded", fileId: newFile._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
