import { useEffect, useRef, useState } from "react";
import { getAllOrder, getOrderById } from "../services/order";
import toast from "react-hot-toast";

interface OrderResponse {
  orderId: string;
  userId: string;
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

export const useOrderPolling = (orderId?: string) => {
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const previousOrderRef = useRef<OrderResponse | null>(null);
  const previousOrdersRef = useRef<OrderResponse[]>([]);
  const hasShownErrorRef = useRef<boolean>(false);

  const checkOrderUpdates = async () => {
    try {
      if (orderId) {
        // Check single order updates
        const { data } = await getOrderById(orderId);
        if (!data || !data.order) {
          throw new Error("Không thể lấy thông tin đơn hàng");
        }

        const newOrder = data.order;

        // Compare with previous order
        if (
          JSON.stringify(previousOrderRef.current) !== JSON.stringify(newOrder)
        ) {
          if (previousOrderRef.current) {
            // Show notification for status changes
            if (previousOrderRef.current.status !== newOrder.status) {
              toast.success(
                `Trạng thái đơn hàng đã thay đổi từ "${previousOrderRef.current.status}" thành "${newOrder.status}"`
              );
            }
          }
          previousOrderRef.current = newOrder;
          setOrder(newOrder);
        }
      } else {
        // Check all orders updates
        const { data } = await getAllOrder();
        if (!data || !data.orders) {
          throw new Error("Không có đơn hàng");
        }

        const newOrders = data.orders;

        // Compare with previous orders
        if (
          JSON.stringify(previousOrdersRef.current) !==
          JSON.stringify(newOrders)
        ) {
          // Check for status changes
          const statusChanges = newOrders.filter((newOrder: OrderResponse) => {
            const prevOrder = previousOrdersRef.current.find(
              (o: OrderResponse) => o.orderId === newOrder.orderId
            );
            return prevOrder && prevOrder.status !== newOrder.status;
          });

          statusChanges.forEach((order: OrderResponse) => {
            const prevOrder = previousOrdersRef.current.find(
              (o: OrderResponse) => o.orderId === order.orderId
            );
            if (prevOrder) {
              toast(
                `Đơn hàng #${order.orderId} đã thay đổi trạng thái từ "${prevOrder.status}" thành "${order.status}"`,
                {
                  icon: "ℹ️",
                }
              );
            }
          });

          previousOrdersRef.current = newOrders;
          setOrders(newOrders);
        }
      }

      // Reset error state if successful
      if (error) {
        setError(null);
        hasShownErrorRef.current = false;
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra cập nhật đơn hàng:", error);
      // Chỉ hiển thị lỗi một lần
      if (!hasShownErrorRef.current) {
        const errorMessage =
          error instanceof Error ? error.message : "Không có đơn hàng";
        setError(errorMessage);
        hasShownErrorRef.current = true;
      }
    }
  };

  useEffect(() => {
    checkOrderUpdates();
    intervalRef.current = setInterval(checkOrderUpdates, 3000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [orderId]);

  return {
    order,
    orders,
    error,
    setOrder,
    setOrders,
  };
};
