import express from "express";
import uploadCloud from './../controllers/upload.js';
const router = express.Router();
router.post("/upload", uploadCloud.array("images", 5), (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }
  const imageUrls = req.files.map((file) => file.path);

  res.json({ imageUrls });
});
export default router;
