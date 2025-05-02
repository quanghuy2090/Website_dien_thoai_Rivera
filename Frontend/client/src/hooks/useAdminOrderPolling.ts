import { useEffect, useRef, useState } from "react";
import { getAllOrder } from "../services/order";
import toast from "react-hot-toast";

interface OrderResponse {
  orderId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  items: {
    productId: string;
    productName: string;
    productImage: string;
    color: string;
    capacity: string;
    price: number;
    salePrice: number;
    quantity: number;
  }[];
  totalAmount: number;
  shippingAddress: {
    userName: string;
    phone: string;
    street: string;
    ward: string;
    district: string;
    city: string;
  };
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  cancelReason?: string;
  cancelledBy?: string;
  cancelHistory?: {
    cancelledAt: Date;
    cancelledBy: string;
    cancelReason: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
  deliveredAt?: Date;
  completedAt?: Date;
}

export const useAdminOrderPolling = () => {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const previousOrdersRef = useRef<OrderResponse[]>([]);
  const lastUpdateTimeRef = useRef<number>(0);

  const checkOrderUpdates = async () => {
    try {
      const { data } = await getAllOrder();
      const newOrders = data.orders || [];

      // Sắp xếp đơn hàng theo thời gian tạo mới nhất
      const sortedOrders = newOrders.sort(
        (a: OrderResponse, b: OrderResponse) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      // Kiểm tra thay đổi trạng thái đơn hàng
      const currentTime = Date.now();
      const hasChanges = sortedOrders.some((newOrder: OrderResponse) => {
        const prevOrder = previousOrdersRef.current.find(
          (order) => order.orderId === newOrder.orderId
        );

        if (prevOrder && prevOrder.status !== newOrder.status) {
          // Chỉ hiển thị thông báo nếu thay đổi xảy ra trong 5 giây gần nhất
          if (currentTime - lastUpdateTimeRef.current < 5000) {
            toast.success(
              `Đơn hàng #${newOrder.orderId} đã chuyển từ trạng thái "${prevOrder.status}" sang "${newOrder.status}"`
            );
          }
          return true;
        }
        return false;
      });

      // Cập nhật danh sách đơn hàng khi có thay đổi
      if (
        hasChanges ||
        JSON.stringify(previousOrdersRef.current) !==
          JSON.stringify(sortedOrders)
      ) {
        previousOrdersRef.current = sortedOrders;
        setOrders(sortedOrders);
        lastUpdateTimeRef.current = currentTime;
      }

      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi kiểm tra cập nhật đơn hàng:", error);
      toast.error("Không thể cập nhật danh sách đơn hàng");
      setLoading(false);
    }
  };

  useEffect(() => {
    checkOrderUpdates();
    intervalRef.current = setInterval(checkOrderUpdates, 2000); // Giảm thời gian polling xuống 2 giây

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    orders,
    loading,
    checkOrderUpdates, // Thêm hàm checkOrderUpdates vào return để có thể gọi từ bên ngoài
  };
};
