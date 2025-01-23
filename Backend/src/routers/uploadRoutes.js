import express from "express";
import uploadCloudinary from "../controllers/uploadController";

const router = express.Router();

router.post("/upload", uploadCloudinary.single("image"), (req, res, next) => {
    if (!req.file) {
        next(new Error("no file to upload"))
    }
    res.json({ secure_url: req.file.path });
});
export default router;