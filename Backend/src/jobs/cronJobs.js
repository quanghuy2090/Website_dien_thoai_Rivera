import cron from "node-cron";
import Order from "../models/Order.js";

export const setupCronJobs = () => {
  // Chạy mỗi ngày vào 00:00
  cron.schedule("0 */2 * * *", async () => {
    try {
      console.log("Checking orders for auto-completion...");

      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000); // 3 ngày trước
      const ordersToUpdate = await Order.find({
        status: "Đã giao hàng",
        deliveredAt: { $lte: threeDaysAgo },
      });

      for (const order of ordersToUpdate) {
        order.status = "Hoàn thành";
        await order.save();
        console.log(`Order ${order._id} auto-completed`);
      }
    } catch (error) {
      console.error("Error in auto-completion cron job:", error);
    }
  });
};



