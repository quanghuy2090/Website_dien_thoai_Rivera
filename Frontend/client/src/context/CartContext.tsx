import { createContext, ReactNode, useEffect, useReducer } from "react";
import cartReducer, { CartState, initialState } from "../reducers/CartReducer";
import { getProductById, Product, Variants } from "../services/product";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  addCart,
  CartItem,
  Carts,
  deleteAllCart,
  deleteCart,
  getCart,
  updateCart,
} from "../services/cart";
import { AxiosError } from "axios";

type CartContextType = {
  state: CartState;
  addToCart: (
    productId: string,
    variant?: Product["variants"][0],
    quantity?: number
  ) => Promise<void>;
  removeFromCart: (productId: string, variantId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  updateQuantity: (
    productId: string,
    variantId: string,
    quantity: number
  ) => Promise<void>;
  getCarts: () => Promise<void>;
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
};

export const CartContext = createContext<CartContextType>({
  state: initialState,
  addToCart: async () => {},
  removeFromCart: async () => {},
  clearCart: async () => {},
  updateQuantity: async () => {},
  getCarts: async () => {},
  showError: () => {},
  showSuccess: () => {},
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const nav = useNavigate();

  const showError = (message: string) => {
    toast.error(message, { duration: 5000 });
  };

  const showSuccess = (message: string) => {
    toast.success(message, { duration: 5000 });
  };

  const getCarts = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user || !user._id) {
        return;
      }

      const { data } = await getCart();
      if (data.cart && data.cart.items) {
        dispatch({ type: "FETCH_CART", payload: data.cart.items });
      } else {
        dispatch({ type: "CLEAR_CART" });
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      console.error("Lỗi khi gọi API giỏ hàng:", err);
      if (err.response?.status === 401) {
        showError("Vui lòng đăng nhập để xem giỏ hàng");
        nav("/login");
      }
    }
  };

  const addToCart = async (
    productId: string,
    variant?: Product["variants"][0],
    quantity: number = 1
  ) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user || !user._id) {
        showError("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
        nav("/login");
        return;
      }
      if (!productId) {
        showError("Không tìm thấy sản phẩm");
        return;
      }
      const { data } = await getProductById(productId);
      const selectedProduct = data.data;
      if (!selectedProduct) {
        showError("Không tìm thấy thông tin sản phẩm");
        return;
      }
      const chosenVariant = variant
        ? selectedProduct.variants.find((v: Variants) => v._id === variant._id)
        : selectedProduct.variants[0];

      if (!chosenVariant) {
        showError("Không tìm thấy thông tin biến thể sản phẩm");
        return;
      }

      if (selectedProduct.status === "banned") {
        showError("Sản phẩm này hiện không khả dụng");
        return;
      }

      if (chosenVariant.stock <= 0) {
        showError("Sản phẩm đã hết hàng");
        return;
      }

      if (quantity > chosenVariant.stock) {
        showError(
          `Số lượng đặt hàng (${quantity}) vượt quá số lượng tồn kho (${chosenVariant.stock})`
        );
        return;
      }

      const MAX_QUANTITY = 100;
      if (quantity > MAX_QUANTITY) {
        showError(`Số lượng tối đa cho phép là ${MAX_QUANTITY}`);
        return;
      }

      const cartItem: CartItem = {
        productId: {
          _id: selectedProduct._id,
          name: selectedProduct.name,
          images: selectedProduct.images[0],
          variants: selectedProduct.variants,
          status: selectedProduct.status,
        },
        variantId: chosenVariant._id,
        quantity: quantity,
        price: chosenVariant.price,
        sale: chosenVariant.sale || "",
        salePrice: chosenVariant.salePrice,
        color:
          typeof chosenVariant.color === "object"
            ? chosenVariant.color.name
            : chosenVariant.color,
        capacity:
          typeof chosenVariant.capacity === "object"
            ? chosenVariant.capacity.value
            : chosenVariant.capacity,
        subtotal: chosenVariant.salePrice * quantity,
      };

      const cartPayload: Carts = {
        userId: user._id,
        productId: selectedProduct._id,
        variantId: chosenVariant._id,
        quantity: quantity,
        price: chosenVariant.price,
        salePrice: chosenVariant.salePrice,
        color:
          typeof chosenVariant.color === "object"
            ? chosenVariant.color.name
            : chosenVariant.color,
        capacity:
          typeof chosenVariant.capacity === "object"
            ? chosenVariant.capacity.value
            : chosenVariant.capacity,
        subtotal: chosenVariant.salePrice * quantity,
      };

      await addCart(cartPayload);
      dispatch({ type: "ADD_ITEM", payload: cartItem });
      showSuccess(
        `Đã thêm sản phẩm vào giỏ hàng! Hiện có ${
          state.totalQuantity + quantity
        } sản phẩm trong giỏ.`
      );
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      console.error("Error adding to cart:", err);
      if (err.response?.status === 400) {
        const errorMessage = err.response?.data?.message || "";
        if (errorMessage.includes("Sản phẩm không tồn tại")) {
          showError("Sản phẩm không tồn tại trong hệ thống");
        } else if (errorMessage.includes("Biến thể sản phẩm không tồn tại")) {
          showError("Phiên bản sản phẩm không còn tồn tại");
        } else if (errorMessage.includes("Số lượng tồn kho không đủ")) {
          showError(
            "Số lượng tồn kho không đủ. Vui lòng điều chỉnh số lượng đặt hàng."
          );
        } else {
          showError(
            errorMessage ||
              "Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại sau."
          );
        }
      } else {
        showError(
          "Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại sau."
        );
      }
    }
  };

  const removeFromCart = async (productId: string, variantId: string) => {
    const productToDelete = state.items.find(
      (item) => item.productId._id === productId && item.variantId === variantId
    );

    if (!productToDelete) {
      showError("Sản phẩm không có trong giỏ hàng");
      return;
    }

    if (
      window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?")
    ) {
      try {
        await deleteCart(productId, variantId);
        dispatch({ type: "REMOVE_ITEM", payload: { productId, variantId } });
        showSuccess(
          `Đã xóa sản phẩm "${
            productToDelete.productId.name
          }" khỏi giỏ hàng! Còn ${
            state.totalQuantity - productToDelete.quantity
          } sản phẩm trong giỏ.`
        );
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        console.error("Error removing from cart:", err);
        if (err.response?.status === 404) {
          showError("Sản phẩm không có trong giỏ hàng hoặc không tồn tại.");
        } else {
          showError("Không thể xóa sản phẩm. Vui lòng thử lại sau.");
        }
      }
    }
  };

  const clearCart = async () => {
    try {
      await deleteAllCart();
      dispatch({ type: "CLEAR_CART" });
      showSuccess("Đã xóa tất cả sản phẩm khỏi giỏ hàng!");
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      console.error("Error clearing cart:", err);
      showError("Không thể xóa giỏ hàng. Vui lòng thử lại sau.");
    }
  };

  const updateQuantity = async (
    productId: string,
    variantId: string,
    quantity: number
  ) => {
    if (quantity <= 0) {
      showError("Số lượng không được nhỏ hơn 1!");
      return;
    }

    if (quantity > 100) {
      showError("Số lượng tối đa cho phép là 100!");
      return;
    }

    try {
      await updateCart(productId, variantId, quantity);
      const existingItem = state.items.find(
        (item) =>
          item.productId._id === productId && item.variantId === variantId
      );

      let updatedQuantity: number;

      if (existingItem) {
        const updatedItem: CartItem = {
          ...existingItem,
          quantity: quantity,
          subtotal: quantity * existingItem.salePrice,
        };
        dispatch({ type: "UPDATE_ITEM", payload: updatedItem });
        updatedQuantity = state.items.reduce(
          (total, item) =>
            total +
            (item.productId._id === productId && item.variantId === variantId
              ? quantity
              : item.quantity),
          0
        );
      } else {
        const { data } = await getProductById(productId);
        const selectedProduct = data.data;
        if (!selectedProduct) {
          showError("Không tìm thấy thông tin sản phẩm");
          return;
        }
        const chosenVariant = selectedProduct.variants.find(
          (v: Variants) => v._id === variantId
        );
        if (!chosenVariant) {
          showError("Không tìm thấy thông tin biến thể sản phẩm");
          return;
        }

        const newItem: CartItem = {
          productId: {
            _id: selectedProduct._id,
            name: selectedProduct.name,
            images: selectedProduct.images[0],
            variants: selectedProduct.variants,
            status: selectedProduct.status,
          },
          variantId: chosenVariant._id,
          quantity: quantity,
          price: chosenVariant.price,
          sale: chosenVariant.sale || "",
          salePrice: chosenVariant.salePrice,
          color:
            typeof chosenVariant.color === "object"
              ? chosenVariant.color.name
              : chosenVariant.color,
          capacity:
            typeof chosenVariant.capacity === "object"
              ? chosenVariant.capacity.value
              : chosenVariant.capacity,
          subtotal: chosenVariant.salePrice * quantity,
        };
        dispatch({ type: "ADD_ITEM", payload: newItem });
        updatedQuantity = state.totalQuantity + quantity;
      }

      showSuccess(
        `Đã cập nhật số lượng! Hiện có ${updatedQuantity} sản phẩm trong giỏ.`
      );
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      console.error("Error updating quantity:", err);
      if (err.response?.status === 404) {
        showError("Sản phẩm không tồn tại trong giỏ hàng");
      } else {
        showError("Không thể cập nhật số lượng. Vui lòng thử lại sau.");
      }
    }
  };

  useEffect(() => {
    getCarts();
  }, []);

  return (
    <CartContext.Provider
      value={{
        state,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
        getCarts,
        showError,
        showSuccess,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
