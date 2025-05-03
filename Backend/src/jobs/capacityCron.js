import cron from "node-cron";
import Capacity from "../models/Capacity.js";

export const setupCapacityCron = () => {
    console.log("Khởi động cron job xóa capacity...");

    // Chạy mỗi 1 phút
    const deleteSoftDeletedCapacities = cron.schedule("*/1 * * * *", async () => {
        try {
            console.log("Đang kiểm tra capacity cần xóa...");

            // Tìm tất cả các bộ nhớ đã bị xóa mềm hơn 1 phút trước
            const oneMinuteAgo = new Date();
            oneMinuteAgo.setMinutes(oneMinuteAgo.getMinutes() - 1);

            const deletedCapacities = await Capacity.find({
                isDeleted: true,
                updatedAt: { $lt: oneMinuteAgo },
            });

            console.log("Số capacity tìm thấy:", deletedCapacities.length);

            if (deletedCapacities.length > 0) {
                // Xóa cứng các bộ nhớ
                await Capacity.deleteMany({
                    _id: { $in: deletedCapacities.map((capacity) => capacity._id) },
                });

                console.log(`Đã xóa ${deletedCapacities.length} bộ nhớ`);
            }
        } catch (error) {
            console.error("Lỗi khi xóa bộ nhớ:", error);
        }
    });

    // Khởi động cron job
    deleteSoftDeletedCapacities.start();
    console.log("Cron job xóa capacity đã được khởi động");
};