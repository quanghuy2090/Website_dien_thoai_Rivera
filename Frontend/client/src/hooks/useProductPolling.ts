import { useEffect, useRef } from "react";
import { getProductById } from "../services/product";
import { Product } from "../types/Product";

export const useProductPolling = (
  productId: string | undefined,
  currentProduct: Product | null,
  setProduct: (product: Product) => void,
  setRelatedProducts: (products: Product[]) => void,
  selectedVariant: Product["variants"][0] | null,
  setSelectedVariant: (variant: Product["variants"][0]) => void
) => {
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const checkProductUpdates = async () => {
    try {
      if (!productId) return;

      const { data } = await getProductById(productId);
      const updatedProduct = data.data;

      // So sánh với product hiện tại
      if (JSON.stringify(currentProduct) !== JSON.stringify(updatedProduct)) {
        setProduct(updatedProduct);
        setRelatedProducts(data.relatedProducts);

        // Cập nhật selectedVariant nếu cần
        if (selectedVariant) {
          const updatedVariant = updatedProduct.variants.find(
            (v: Product["variants"][0]) => v._id === selectedVariant._id
          );
          if (updatedVariant) {
            setSelectedVariant(updatedVariant);
          }
        }
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra cập nhật sản phẩm:", error);
    }
  };

  useEffect(() => {
    // Kiểm tra mỗi 5 giây
    pollingIntervalRef.current = setInterval(checkProductUpdates, 2000);

    // Cleanup khi component unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [productId, currentProduct, selectedVariant]);
};
