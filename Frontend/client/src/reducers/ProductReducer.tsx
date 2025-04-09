import { Product } from "../services/product"
type State = {
    products: Product[];
    selectedProduct?: Product

}
type Action =
    | { type: "GET_PRODUCTS"; payload: Product[] }
    | { type: "ADD_PRODUCTS"; payload: Product }
    | { type: "REMOVE_PRODUCTS"; payload: string }
    | { type: "UPDATE_PRODUCTS"; payload: Product }
    | { type: "SET_SELECTED_PRODUCTS"; payload: Product | undefined }
    | { type: "UPDATE_STATUS"; payload: { _id: string, status: string } }
    | { type: "UPDATE_IS_HOT"; payload: { _id: string, is_hot: string } }

const ProductReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "GET_PRODUCTS":
            return {
                ...state,
                products: action.payload
            };
        case "ADD_PRODUCTS":
            return {
                ...state,
                products: [...state.products, {
                    ...action.payload,
                    categoryId: typeof action.payload.categoryId === "string"
                        ? { _id: action.payload.categoryId, name: "Đang cập nhật..." } // Tạm hiển thị tên danh mục
                        : action.payload.categoryId
                }]
            };
        case "UPDATE_PRODUCTS":
            return {
                ...state,
                products: state.products.map((product) =>
                    product._id === action.payload._id
                        ? {
                            ...action.payload,
                            categoryId: typeof action.payload.categoryId === "string"
                                ? { _id: action.payload.categoryId, name: "Đang cập nhật..." }
                                : action.payload.categoryId
                        }
                        : product
                )
            };
        case "REMOVE_PRODUCTS":
            return {
                ...state,
                products: state.products.filter((product) => product._id !== action.payload)
            };
        case "SET_SELECTED_PRODUCTS":
            return {
                ...state, selectedProduct: action.payload
            };
        case "UPDATE_STATUS":
            return {
                ...state,
                selectedProduct: state.selectedProduct && state.selectedProduct._id === action.payload._id
                    ? { ...state.selectedProduct, status: action.payload.status }
                    : state.selectedProduct,
                products: state.products.map((product) =>
                    product._id === action.payload._id
                        ? { ...product, status: action.payload.status }
                        : product
                ),
            };
        case "UPDATE_IS_HOT":
            return {
                ...state,
                selectedProduct: state.selectedProduct && state.selectedProduct._id === action.payload._id
                    ? { ...state.selectedProduct, is_hot: action.payload.is_hot }
                    : state.selectedProduct,
                products: state.products.map((product) =>
                    product._id === action.payload._id
                        ? { ...product, is_hot: action.payload.is_hot }
                        : product
                )
            };

        default:
            return state;
    }
}

export default ProductReducer;
