import cron from "node-cron";
import Color from "../models/Color.js";

export const setupColorCron = () => {
    console.log("Khởi động cron job xóa color...");

    // Chạy mỗi 1 phút
    const deleteSoftDeletedColors = cron.schedule("*/1 * * * *", async () => {
        try {
            console.log("Đang kiểm tra color cần xóa...");

            // Tìm tất cả các màu đã bị xóa mềm hơn 1 phút trước
            const oneMinuteAgo = new Date();
            oneMinuteAgo.setMinutes(oneMinuteAgo.getMinutes() - 1);

            const deletedColors = await Color.find({
                isDeleted: true,
                updatedAt: { $lt: oneMinuteAgo },
            });

            console.log("Số color tìm thấy:", deletedColors.length);

            if (deletedColors.length > 0) {
                // Xóa cứng các màu
                await Color.deleteMany({
                    _id: { $in: deletedColors.map((color) => color._id) },
                });

                console.log(`Đã xóa ${deletedColors.length} màu`);
            }
        } catch (error) {
            console.error("Lỗi khi xóa màu:", error);
        }
    });

    // Khởi động cron job
    deleteSoftDeletedColors.start();
    console.log("Cron job xóa color đã được khởi động");
};