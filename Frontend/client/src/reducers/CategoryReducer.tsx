import { Category } from "../services/category"


type State = {
    categorys: Category[];
    selectedCategory?: Category;
    deletedCategorys: Category[];
};

type Action =
    | { type: "GET_CATEGORYS"; payload: Category[] }
    | { type: "ADD_CATEGORYS"; payload: Category }
    | { type: "REMOVE_CATEGORYS"; payload: string }
    | { type: "UPDATE_CATEGORYS"; payload: Category }
    | { type: "SET_SELECTED_CATEGORY"; payload: Category | undefined }
    | { type: "GET_CATEGORYS_DELETE"; payload: Category[] }
    | { type: "UPDATE_CATEGORY_RESTORE"; payload: Category };


const CategoryReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "GET_CATEGORYS":
            return {
                ...state,
                categorys: action.payload
            };
        case "GET_CATEGORYS_DELETE":
            return {
                ...state,
                deletedCategorys: action.payload, // Lưu danh mục đã xóa vào deletedCategorys
            };
        case "UPDATE_CATEGORY_RESTORE":
            return {
                ...state,
                deletedCategorys: state.deletedCategorys.map((category) => category._id === action.payload._id ? action.payload : category)
            }

        case "ADD_CATEGORYS":
            return {
                ...state,
                categorys: [...state.categorys, action.payload],
            };
        case "UPDATE_CATEGORYS":
            return {
                ...state,
                categorys: state.categorys.map((category) => category._id === action.payload._id ? action.payload : category)
            };
        case "REMOVE_CATEGORYS": {
            // Bọc trong block scope {}
            const removedCategory = state.categorys.find(
                (category) => category._id === action.payload
            );
            return {
                ...state,
                categorys: state.categorys.filter(
                    (category) => category._id !== action.payload
                ),
                deletedCategorys: removedCategory
                    ? [...state.deletedCategorys, removedCategory]
                    : state.deletedCategorys,
            };
        }
        case "SET_SELECTED_CATEGORY":
            return {
                ...state, selectedCategory: action.payload
            }
        default:
            return state;
    }
}
export default CategoryReducer;