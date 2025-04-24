import { useEffect, useRef, useState } from "react";
import { getCart, CartItem } from "../services/cart";
import toast from "react-hot-toast";

export const useCartPolling = () => {
  const [carts, setCarts] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [hasBannedProduct, setHasBannedProduct] = useState<boolean>(false); // ✅ Thêm trạng thái này
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const previousCartsRef = useRef<CartItem[]>([]);
  const shownNotificationsRef = useRef<Set<string>>(new Set());
  const userDeletedItemsRef = useRef<Set<string>>(new Set());

  const checkCartUpdates = async () => {
    try {
      const { data } = await getCart();
      const newCarts = data.cart.items || [];
      const newTotalAmount = data.cart.totalSalePrice || 0;

      let foundBannedProduct = false;

      newCarts.forEach((item) => {
        if (item.productId.status === "banned") {
          foundBannedProduct = true;

          const itemKey = `banned-${item.productId._id}-${item.variantId}`;
          if (!shownNotificationsRef.current.has(itemKey)) {
            toast.error(
              `Sản phẩm "${item.productId.name}" (${item.color} / ${item.capacity}) đã bị chặn và không thể thanh toán.`
            );
            shownNotificationsRef.current.add(itemKey);
          }
        }
      });

      setHasBannedProduct(foundBannedProduct); // ✅ Cập nhật trạng thái

      // Xử lý sản phẩm bị xóa
      // const removedItems = previousCartsRef.current.filter(
      //   (prevItem) =>
      //     !newCarts.some(
      //       (newItem) =>
      //         newItem.productId._id === prevItem.productId._id &&
      //         newItem.variantId === prevItem.variantId
      //     )
      // );

      // removedItems.forEach((item) => {
      //   const itemKey = `${item.productId._id}-${item.variantId}`;
      //   if (!userDeletedItemsRef.current.has(itemKey)) {
      //     const notificationKey = `removed-${itemKey}`;
      //     if (!shownNotificationsRef.current.has(notificationKey)) {
      //       toast.error(
      //         `Sản phẩm "${item.productId.name}" (${item.color} / ${item.capacity}) đã bị xóa khỏi giỏ hàng do được cập nhật.`
      //       );
      //       shownNotificationsRef.current.add(notificationKey);
      //     }
      //   }
      // });

      newCarts.forEach((newItem) => {
        const prevItem = previousCartsRef.current.find(
          (item) =>
            item.productId._id === newItem.productId._id &&
            item.variantId === newItem.variantId
        );

        if (prevItem) {
          if (prevItem.quantity !== newItem.quantity) {
            const notificationKey = `quantity-${newItem.productId._id}-${newItem.variantId}`;
            if (!shownNotificationsRef.current.has(notificationKey)) {
              toast.info(
                `Số lượng sản phẩm "${newItem.productId.name}" đã được điều chỉnh từ ${prevItem.quantity} xuống ${newItem.quantity}`
              );
              shownNotificationsRef.current.add(notificationKey);
            }
          }

          if (prevItem.salePrice !== newItem.salePrice) {
            const notificationKey = `price-${newItem.productId._id}-${newItem.variantId}`;
            if (!shownNotificationsRef.current.has(notificationKey)) {
              toast.info(
                `Giá sản phẩm "${newItem.productId.name
                }" đã thay đổi từ ${prevItem.salePrice.toLocaleString()} VND xuống ${newItem.salePrice.toLocaleString()} VND`
              );
              shownNotificationsRef.current.add(notificationKey);
            }
          }
        }
      });

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
    hasBannedProduct, // ✅ Trả ra trạng thái này
  };
};
