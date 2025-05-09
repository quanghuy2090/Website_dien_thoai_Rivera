import { useEffect, useRef, useState, useContext } from "react";
import { getCart, CartItem } from "../services/cart";
import { CartContext } from "../context/CartContext";

export const useCartPolling = () => {
  const [carts, setCarts] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [hasBannedProduct, setHasBannedProduct] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const previousCartsRef = useRef<CartItem[]>([]);
  const shownNotificationsRef = useRef<Set<string>>(new Set());
  const userDeletedItemsRef = useRef<Set<string>>(new Set());
  const { showError, showSuccess, getCarts, removeFromCart } =
    useContext(CartContext);

  const checkCartUpdates = async () => {
    try {
      const { data } = await getCart();
      const newCarts = data.cart.items || [];
      const newTotalAmount = data.cart.totalSalePrice || 0;

      let foundBannedProduct = false;

      // Kiểm tra và xóa các biến thể không tồn tại
      const validCarts = newCarts.filter((item: CartItem) => {
        if (
          !item.productId ||
          !item.productId.name ||
          item.color === "NA" ||
          item.capacity === "NA"
        ) {
          const itemKey = `invalid-${item.productId?._id}-${item.variantId}`;
          if (!shownNotificationsRef.current.has(itemKey)) {
            showError(
              `Phiên bản sản phẩm "${
                item.productId?.name || "Không xác định"
              }" (${item.color} / ${
                item.capacity
              }) không tồn tại, vui lòng chọn phiên bản khác.`
            );
            shownNotificationsRef.current.add(itemKey);
            // Tự động xóa biến thể không tồn tại
            if (item.productId?._id && item.variantId) {
              removeFromCart(item.productId._id, item.variantId);
            }
          }
          return false;
        }
        return true;
      });

      // Kiểm tra sản phẩm bị chặn
      validCarts.forEach((item: CartItem) => {
        if (item.productId.status === "banned") {
          foundBannedProduct = true;
          const itemKey = `banned-${item.productId._id}-${item.variantId}`;
          if (!shownNotificationsRef.current.has(itemKey)) {
            showError(
              `Sản phẩm "${item.productId.name}" (${item.color} / ${item.capacity}) đã dừng hoạt động và không thể thanh toán.`
            );
            shownNotificationsRef.current.add(itemKey);
          }
        }
      });

      setHasBannedProduct(foundBannedProduct);

      // Kiểm tra thay đổi số lượng và giá
      validCarts.forEach((newItem: CartItem) => {
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
        JSON.stringify(previousCartsRef.current) !== JSON.stringify(validCarts)
      ) {
        shownNotificationsRef.current.clear();
        // Cập nhật CartContext khi có thay đổi
        await getCarts();
      }

      previousCartsRef.current = validCarts;
      setCarts(validCarts);
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
    hasBannedProduct,
  };
};
