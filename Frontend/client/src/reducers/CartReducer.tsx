// import toast from "react-hot-toast";
import { CartItem } from "../services/cart";

type CartState = {
    items: CartItem[];
    totalQuantity: number;
};

type CartAction =
    | { type: "ADD_ITEM"; payload: CartItem }
    | { type: "UPDATE_ITEM"; payload: CartItem }
    | { type: "REMOVE_ITEM"; payload: { productId: string; variantId: string } }
    | { type: "CLEAR_CART" }
    | { type: "FETCH_CART"; payload: CartItem[] };

const initialState: CartState = {
    items: [],
    totalQuantity: 0,
};

export const cartReducer = (state: CartState = initialState, action: CartAction): CartState => {
    switch (action.type) {
        case "ADD_ITEM": {
            const existingItemIndex = state.items.findIndex(
                (item) =>
                    item.productId._id === action.payload.productId._id &&
                    item.variantId === action.payload.variantId
            );

            let updatedItems = [...state.items];
            let updatedQuantity = state.totalQuantity;

            if (existingItemIndex >= 0) {
                const existingItem = state.items[existingItemIndex];
                updatedItems[existingItemIndex] = {
                    ...existingItem,
                    quantity: existingItem.quantity + action.payload.quantity,
                    subtotal:
                        (existingItem.quantity + action.payload.quantity) *
                        existingItem.salePrice,
                };
                updatedQuantity += action.payload.quantity;
            } else {
                updatedItems = [...state.items, action.payload];
                updatedQuantity += action.payload.quantity;
            }

            return {
                ...state,
                items: updatedItems,
                totalQuantity: updatedQuantity,
            };
        }

        case "UPDATE_ITEM": {
            const itemIndex = state.items.findIndex(
                (item) =>
                    item.productId._id === action.payload.productId._id &&
                    item.variantId === action.payload.variantId
            );
            if (itemIndex >= 0) {
                const updatedItemsForUpdate = [...state.items];
                updatedItemsForUpdate[itemIndex] = action.payload;
                const newTotalQuantity = updatedItemsForUpdate.reduce((total, item) => total + item.quantity, 0);
                return {
                    ...state,
                    items: updatedItemsForUpdate,
                    totalQuantity: newTotalQuantity,
                };
            }
            return state;
        }

        case "REMOVE_ITEM": {
            const filteredItems = state.items.filter(
                (item) =>
                    !(item.productId._id === action.payload.productId &&
                        item.variantId === action.payload.variantId)
            );
            const newTotalQuantity = filteredItems.reduce((total, item) => total + item.quantity, 0);

            return {
                ...state,
                items: filteredItems,
                totalQuantity: newTotalQuantity,
            };
        }

        case "CLEAR_CART":
            return initialState;

        case "FETCH_CART": {
            const items = action.payload;
            const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);
            return {
                ...state,
                items: items,
                totalQuantity: totalQuantity,
            };
        }

        default:
            return state;
    }
};

export { initialState };
export type { CartState, CartAction };
export default cartReducer;