import { useEffect, useRef, useState } from "react";
import { getCart } from "../services/cart";
import { CartItem } from "../services/cart";
import toast from "react-hot-toast";

export const useCartPolling = () => {
  const [carts, setCarts] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const previousCartsRef = useRef<CartItem[]>([]);
  const shownNotificationsRef = useRef<Set<string>>(new Set());
  const userDeletedItemsRef = useRef<Set<string>>(new Set());

  const checkCartUpdates = async () => {
    try {
      const { data } = await getCart();
      const newCarts = data.cart.items || [];
      const newTotalAmount = data.cart.totalSalePrice || 0;

      // Kiểm tra các sản phẩm bị xóa
      const removedItems = previousCartsRef.current.filter(
        (prevItem) =>
          !newCarts.some(
            (newItem) =>
              newItem.productId._id === prevItem.productId._id &&
              newItem.variantId === prevItem.variantId
          )
      );

      // Hiển thị thông báo cho các sản phẩm bị xóa tự động
      removedItems.forEach((item) => {
        const itemKey = `${item.productId._id}-${item.variantId}`;
        // Chỉ hiển thị thông báo nếu không phải do người dùng xóa
        if (!userDeletedItemsRef.current.has(itemKey)) {
          const notificationKey = `removed-${itemKey}`;
          if (!shownNotificationsRef.current.has(notificationKey)) {
            toast.error(
              `Sản phẩm "${item.productId.name}" (${item.color} / ${item.capacity}) đã bị xóa khỏi giỏ hàng do được cập nhật`
            );
            shownNotificationsRef.current.add(notificationKey);
          }
        }
      });

      // Kiểm tra các sản phẩm bị cập nhật
      newCarts.forEach((newItem) => {
        const prevItem = previousCartsRef.current.find(
          (item) =>
            item.productId._id === newItem.productId._id &&
            item.variantId === newItem.variantId
        );

        if (prevItem) {
          // Kiểm tra thay đổi số lượng
          if (prevItem.quantity !== newItem.quantity) {
            const notificationKey = `quantity-${newItem.productId._id}-${newItem.variantId}`;
            if (!shownNotificationsRef.current.has(notificationKey)) {
              toast.info(
                `Số lượng sản phẩm "${newItem.productId.name}" đã được điều chỉnh từ ${prevItem.quantity} xuống ${newItem.quantity}`
              );
              shownNotificationsRef.current.add(notificationKey);
            }
          }

          // Kiểm tra thay đổi giá
          if (prevItem.salePrice !== newItem.salePrice) {
            const notificationKey = `price-${newItem.productId._id}-${newItem.variantId}`;
            if (!shownNotificationsRef.current.has(notificationKey)) {
              toast.info(
                `Giá sản phẩm "${
                  newItem.productId.name
                }" đã thay đổi từ ${prevItem.salePrice.toLocaleString()} VND xuống ${newItem.salePrice.toLocaleString()} VND`
              );
              shownNotificationsRef.current.add(notificationKey);
            }
          }
        }
      });

      // Reset notifications khi có thay đổi
      if (
        JSON.stringify(previousCartsRef.current) !== JSON.stringify(newCarts)
      ) {
        shownNotificationsRef.current.clear();
      }

      previousCartsRef.current = newCarts;
      setCarts(newCarts);
      setTotalAmount(newTotalAmount);
    } catch (error) {
      console.error("Lỗi khi kiểm tra cập nhật giỏ hàng:", error);
    }
  };

  // Hàm để đánh dấu sản phẩm bị xóa bởi người dùng
  const markItemAsUserDeleted = (productId: string, variantId: string) => {
    userDeletedItemsRef.current.add(`${productId}-${variantId}`);
  };

  useEffect(() => {
    checkCartUpdates();
    intervalRef.current = setInterval(checkCartUpdates, 3000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    carts,
    totalAmount,
    setCarts,
    setTotalAmount,
    markItemAsUserDeleted,
  };
};
