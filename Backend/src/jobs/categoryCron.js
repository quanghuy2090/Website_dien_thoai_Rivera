import cron from "node-cron";
import Category from "../models/Category.js";

export const setupCategoryCron = () => {
  console.log("Khởi động cron job xóa category...");

  // Chạy mỗi 1 phút
  const deleteSoftDeletedCategories = cron.schedule("*/1 * * * *", async () => {
    try {
      console.log("Đang kiểm tra category cần xóa...");

      // Tìm tất cả các danh mục đã bị xóa mềm hơn 1 phút trước
      const oneMinuteAgo = new Date();
      oneMinuteAgo.setMinutes(oneMinuteAgo.getMinutes() - 1);

      const deletedCategories = await Category.find({
        isDeleted: true,
        updatedAt: { $lt: oneMinuteAgo },
      });

      console.log("Số category tìm thấy:", deletedCategories.length);

      if (deletedCategories.length > 0) {
        // Xóa cứng các danh mục
        await Category.deleteMany({
          _id: { $in: deletedCategories.map((cat) => cat._id) },
        });

        console.log(`Đã xóa ${deletedCategories.length} danh mục`);
      }
    } catch (error) {
      console.error("Lỗi khi xóa danh mục:", error);
    }
  });

  // Khởi động cron job
  deleteSoftDeletedCategories.start();
  console.log("Cron job đã được khởi động");
};
