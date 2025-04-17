import { createContext, ReactNode, useEffect, useReducer } from "react";
import cartReducer, { CartState, initialState } from "../reducers/CartReducer";
import { getProductById, Product, Variants } from "../services/product";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { addCart, CartItem, Carts, deleteAllCart, deleteCart, getCart, updateCart } from "../services/cart";
import { AxiosError } from "axios";

type CartContextType = {
    state: CartState;
    addToCart: (productId: string, variant?: Product['variants'][0], quantity?: number) => Promise<void>;
    removeFromCart: (productId: string, variantId: string) => Promise<void>;
    clearCart: () => Promise<void>;
    updateQuantity: (productId: string, variantId: string, quantity: number) => Promise<void>;
    getCarts: () => Promise<void>;
};

export const CartContext = createContext<CartContextType>({
    state: initialState,
    addToCart: async () => { },
    removeFromCart: async () => { },
    clearCart: async () => { },
    updateQuantity: async () => { },
    getCarts: async () => { },
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);
    const nav = useNavigate();

    useEffect(() => {
        getCarts(); // Fix naming mismatch
    }, []);

    const addToCart = async (
        productId: string,
        variant?: Product['variants'][0],
        quantity: number = 1
    ) => {
        try {
            const user = JSON.parse(localStorage.getItem("user") || '{}');
            if (!user || !user._id) {
                toast.error('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
                nav('/login');
                return;
            }
            if (!productId) {
                toast.error("Không tìm thấy sản phẩm");
                return;
            }
            const { data } = await getProductById(productId);
            const selectedProduct = data.data;
            if (!selectedProduct) {
                toast.error("Không tìm thấy thông tin sản phẩm");
                return;
            }
            const chosenVariant = variant
                ? selectedProduct.variants.find((v: Variants) => v._id === variant._id)
                : selectedProduct.variants[0];

            if (!chosenVariant) {
                toast.error('Không tìm thấy thông tin biến thể sản phẩm');
                return;
            }

            if (selectedProduct.status === 'banned') {
                toast.error('Sản phẩm này hiện không khả dụng');
                return;
            }

            if (chosenVariant.stock <= 0) {
                toast.error('Sản phẩm đã hết hàng');
                return;
            }

            if (quantity > chosenVariant.stock) {
                toast.error(
                    `Số lượng đặt hàng (${quantity}) vượt quá số lượng tồn kho (${chosenVariant.stock})`
                );
                return;
            }

            const MAX_QUANTITY = 100;
            if (quantity > MAX_QUANTITY) {
                toast.error(`Số lượng tối đa cho phép là ${MAX_QUANTITY}`);
                return;
            }

            const cartItem: CartItem = {
                productId: {
                    _id: selectedProduct._id,
                    name: selectedProduct.name,
                    images: selectedProduct.images[0],
                    variants: selectedProduct.variants,
                },
                variantId: chosenVariant._id,
                quantity: quantity,
                price: chosenVariant.price,
                sale: chosenVariant.sale || '',
                salePrice: chosenVariant.salePrice,
                color:
                    typeof chosenVariant.color === 'object'
                        ? chosenVariant.color.name
                        : chosenVariant.color,
                capacity:
                    typeof chosenVariant.capacity === 'object'
                        ? chosenVariant.capacity.value
                        : chosenVariant.capacity,
                subtotal: chosenVariant.salePrice * quantity,
            };

            // Adjusted payload for addCart API (remove Carts type since it's a flat object)
            const cartPayload: Carts = {
                userId: user._id,
                productId: selectedProduct._id,
                variantId: chosenVariant._id,
                quantity: quantity,
                price: chosenVariant.price,
                salePrice: chosenVariant.salePrice,
                color:
                    typeof chosenVariant.color === 'object'
                        ? chosenVariant.color.name
                        : chosenVariant.color,
                capacity:
                    typeof chosenVariant.capacity === 'object'
                        ? chosenVariant.capacity.value
                        : chosenVariant.capacity,
                subtotal: chosenVariant.salePrice * quantity,
            };

            await addCart(cartPayload);
            dispatch({ type: 'ADD_ITEM', payload: cartItem });
            toast.success(`Đã thêm sản phẩm vào giỏ hàng! Hiện có ${state.totalQuantity + quantity} sản phẩm trong giỏ.`);
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            console.error("Error adding to cart:", err);
            if (err.response?.status === 400) {
                const errorMessage = err.response?.data?.message || "";
                if (errorMessage.includes("Sản phẩm không tồn tại")) {
                    toast.error("Sản phẩm không tồn tại trong hệ thống");
                } else if (errorMessage.includes("Biến thể sản phẩm không tồn tại")) {
                    toast.error("Phiên bản sản phẩm không còn tồn tại");
                } else if (errorMessage.includes("Số lượng tồn kho không đủ")) {
                    toast.error("Số lượng tồn kho không đủ. Vui lòng điều chỉnh số lượng đặt hàng.");
                } else {
                    toast.error(errorMessage || "Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại sau.");
                }
            } else {
                toast.error("Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại sau.");
            }
        }
    };

    const removeFromCart = async (productId: string, variantId: string) => {
        const productToDelete = state.items.find(
            (item) => item.productId._id === productId && item.variantId === variantId
        );

        if (!productToDelete) {
            toast.error("Sản phẩm không có trong giỏ hàng");
            return;
        }

        if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?")) {
            try {
                await deleteCart(productId, variantId);
                dispatch({ type: 'REMOVE_ITEM', payload: { productId, variantId } }); // Fix action type
                toast.success(
                    `Đã xóa sản phẩm "${productToDelete.productId.name}" khỏi giỏ hàng! Còn ${state.totalQuantity - productToDelete.quantity} sản phẩm trong giỏ.`
                );
            } catch (error) {
                const err = error as AxiosError<{ message: string }>;
                console.error("Error removing from cart:", err);
                if (err.response?.status === 404) {
                    toast.error("Sản phẩm không có trong giỏ hàng hoặc không tồn tại.");
                } else {
                    toast.error("Không thể xóa sản phẩm. Vui lòng thử lại sau.");
                }
            }
        }
    };

    const clearCart = async () => {

        try {
            await deleteAllCart();
            dispatch({ type: "CLEAR_CART" }); // Fix typo
            toast.success('Đã xóa tất cả sản phẩm khỏi giỏ hàng!');
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            console.error("Error clearing cart:", err);
            // toast.error('Không thể xóa giỏ hàng. Vui lòng thử lại sau.');
        }

    };

    const updateQuantity = async (productId: string, variantId: string, quantity: number) => {
        if (quantity <= 0) {
            toast.error("Số lượng không được nhỏ hơn 1!");
            return;
        }

        if (quantity > 100) {
            toast.error("Số lượng tối đa cho phép là 100!");
            return;
        }

        try {
            await updateCart(productId, variantId, quantity);
            const existingItem = state.items.find(
                (item) => item.productId._id === productId && item.variantId === variantId
            );

            let updatedQuantity: number;

            if (existingItem) {
                const updatedItem: CartItem = {
                    ...existingItem,
                    quantity: quantity,
                    subtotal: quantity * existingItem.salePrice,
                };
                dispatch({ type: "UPDATE_ITEM", payload: updatedItem }); // Fix action type
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
                    toast.error("Không tìm thấy thông tin sản phẩm");
                    return;
                }
                const chosenVariant = selectedProduct.variants.find((v: Variants) => v._id === variantId);
                if (!chosenVariant) {
                    toast.error("Không tìm thấy thông tin biến thể sản phẩm");
                    return;
                }

                const newItem: CartItem = {
                    productId: {
                        _id: selectedProduct._id,
                        name: selectedProduct.name,
                        images: selectedProduct.images[0],
                        variants: selectedProduct.variants,
                    },
                    variantId: chosenVariant._id,
                    quantity: quantity,
                    price: chosenVariant.price,
                    sale: chosenVariant.sale || '',
                    salePrice: chosenVariant.salePrice,
                    color:
                        typeof chosenVariant.color === 'object'
                            ? chosenVariant.color.name
                            : chosenVariant.color,
                    capacity:
                        typeof chosenVariant.capacity === 'object'
                            ? chosenVariant.capacity.value
                            : chosenVariant.capacity,
                    subtotal: chosenVariant.salePrice * quantity,
                };
                dispatch({ type: "ADD_ITEM", payload: newItem });
                updatedQuantity = state.totalQuantity + quantity;
            }

            toast.success(`Đã cập nhật số lượng! Hiện có ${updatedQuantity} sản phẩm trong giỏ.`);
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            console.error("Error updating quantity:", err);
            toast.error('Không thể cập nhật số lượng. Vui lòng thử lại sau.');
        }
    };

    const getCarts = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user") || '{}');
            if (!user || !user._id) {
                // Silently return if user is not logged in; don't redirect or show toast on initial load
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
            // Don't show toast on initial load to avoid spamming user
        }
    };

    return (
        <CartContext.Provider value={{ state, addToCart, removeFromCart, clearCart, updateQuantity, getCarts }}>
            {children}
        </CartContext.Provider>
    );
};