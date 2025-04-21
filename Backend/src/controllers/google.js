import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import User from "../models/User.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const loginWithGoogle = async (req, res) => {
    const { token } = req.body;

    try {
        // Bước 1: Xác thực token từ Google
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name, picture } = payload;

        // Bước 2: Kiểm tra user tồn tại
        let user = await User.findOne({ email });

        if (!user) {
            // Bước 3: Tạo user nếu chưa có
            user = await User.create({
                userName: name || email.split("@")[0], // sửa 'username' → 'userName'
                email,
                phone: null,
                image: picture,
                password: "google_auth_placeholder", // hoặc random string
                googleLogin: true,
                status: "active",
            });

        }

        // Bước 4: Kiểm tra trạng thái tài khoản
        if (user.status !== "active") {
            return res.status(403).json({
                message: "Tài khoản của bạn đã bị vô hiệu hóa",
            });
        }

        // Bước 5: Tạo JWT
        const SECRET_CODE = process.env.SECRET_CODE || "default_secret";
        const accessToken = jwt.sign({ _id: user._id }, SECRET_CODE, {
            expiresIn: "1d",
        });

        // Bước 6: Trả về client
        user.password = undefined;
        return res.status(200).json({
            message: "Đăng nhập Google thành công",
            data: {
                user,
                accessToken,
                expiresIn: "1d",
            },
        });
    } catch (error) {
        console.error("Google login error:", error);
        res.status(500).json({ message: "Login with Google failed", error: error.message });
    }
};
