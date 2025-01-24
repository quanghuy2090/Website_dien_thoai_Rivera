import express from "express";
import uploadCloud from './../controllers/upload.js';
const router = express.Router();
router.post("/upload", uploadCloud.single("image"), (req, res, next) => {
  if (!req.file) {
    next(new Error("no file upload"));
    return;
  }
  res.json({ secure_url: req.file.path });
});
export default router;
