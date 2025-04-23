import { useEffect, useRef, useState } from "react";
import { getAllOrder, getOrderById } from "../services/order";
import toast from "react-hot-toast";

export const useOrderPolling = (orderId?: string) => {
  const [order, setOrder] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const previousOrderRef = useRef<any>(null);
  const previousOrdersRef = useRef<any[]>([]);

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
                `Trạng thái đơn hàng đã thay đổi từ "${previousOrderRef.current.status}" thành "${newOrder.status}"`,
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
          throw new Error("Không thể lấy danh sách đơn hàng");
        }

        const newOrders = data.orders;

        // Compare with previous orders
        if (
          JSON.stringify(previousOrdersRef.current) !==
          JSON.stringify(newOrders)
        ) {
          // Check for new orders
          const newOrderIds = newOrders.map((o: any) => o.orderId);
          const previousOrderIds = previousOrdersRef.current.map(
            (o: any) => o.orderId
          );
          const addedOrders = newOrders.filter(
            (o: any) => !previousOrderIds.includes(o.orderId)
          );

          // Check for status changes
          const statusChanges = newOrders.filter((newOrder: any) => {
            const prevOrder = previousOrdersRef.current.find(
              (o: any) => o.orderId === newOrder.orderId
            );
            return prevOrder && prevOrder.status !== newOrder.status;
          });

          // Show notifications
          // if (addedOrders.length > 0) {
          //   toast.success(`Bạn có ${addedOrders.length} đơn hàng mới`);
          // }

          statusChanges.forEach((order: any) => {
            const prevOrder = previousOrdersRef.current.find(
              (o: any) => o.orderId === order.orderId
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
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra cập nhật đơn hàng:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi cập nhật đơn hàng";
      setError(errorMessage);
      toast.error(errorMessage);
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
