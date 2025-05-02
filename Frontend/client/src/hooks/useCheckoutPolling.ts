import { useEffect, useRef, useState, useContext } from "react";
import { getCart, CartItem } from "../services/cart";
import { CartContext } from "../context/CartContext";

export const useCheckoutPolling = () => {
  const [carts, setCarts] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [hasBannedProduct, setHasBannedProduct] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const previousCartsRef = useRef<CartItem[]>([]);
  const shownNotificationsRef = useRef<Set<string>>(new Set());
  const { showError, showSuccess, getCarts } = useContext(CartContext);

  const checkCartUpdates = async () => {
    try {
      const { data } = await getCart();
      const newCarts = data.cart.items || [];
      const newTotalAmount = data.cart.totalSalePrice || 0;

      let foundBannedProduct = false;

      // Kiểm tra sản phẩm bị chặn
      newCarts.forEach((item: CartItem) => {
        if (item.productId.status === "banned") {
          foundBannedProduct = true;
          const itemKey = `banned-${item.productId._id}-${item.variantId}`;
          if (!shownNotificationsRef.current.has(itemKey)) {
            showError(
              `Sản phẩm "${item.productId.name}" (${item.color} / ${item.capacity}) đã bị chặn và không thể thanh toán.`
            );
            shownNotificationsRef.current.add(itemKey);
          }
        }
      });

      setHasBannedProduct(foundBannedProduct);

      // Kiểm tra thay đổi số lượng và giá
      newCarts.forEach((newItem: CartItem) => {
        const prevItem = previousCartsRef.current.find(
          (item) =>
            item.productId._id === newItem.productId._id &&
            item.variantId === newItem.variantId
        );

        if (prevItem) {
          if (prevItem.quantity !== newItem.quantity) {
            const notificationKey = `quantity-${newItem.productId._id}-${newItem.variantId}`;
            if (!shownNotificationsRef.current.has(notificationKey)) {
              showSuccess(
                `Số lượng sản phẩm "${newItem.productId.name}" đã được điều chỉnh từ ${prevItem.quantity} xuống ${newItem.quantity}`
              );
              shownNotificationsRef.current.add(notificationKey);
            }
          }

          if (prevItem.salePrice !== newItem.salePrice) {
            const notificationKey = `price-${newItem.productId._id}-${newItem.variantId}`;
            if (!shownNotificationsRef.current.has(notificationKey)) {
              showSuccess(
                `Giá sản phẩm "${
                  newItem.productId.name
                }" đã thay đổi từ ${prevItem.salePrice.toLocaleString()} VND xuống ${newItem.salePrice.toLocaleString()} VND`
              );
              shownNotificationsRef.current.add(notificationKey);
            }
          }
        }
      });

      // Xóa thông báo cũ khi có thay đổi mới
      if (
        JSON.stringify(previousCartsRef.current) !== JSON.stringify(newCarts)
      ) {
        shownNotificationsRef.current.clear();
        // Cập nhật CartContext khi có thay đổi
        await getCarts();
      }

      previousCartsRef.current = newCarts;
      setCarts(newCarts);
      setTotalAmount(newTotalAmount);
    } catch (error) {
      console.error("Lỗi khi kiểm tra cập nhật giỏ hàng:", error);
    }
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
    hasBannedProduct,
  };
};
