import { Category } from "../services/category"

type State = {
    categorys: Category[];
    selectedCategory?: Category
};

type Action =
    | { type: "GET_CATEGORYS"; payload: Category[] }
    | { type: "ADD_CATEGORYS"; payload: Category }
    | { type: "REMOVE_CATEGORYS"; payload: string }
    | { type: "UPDATE_CATEGORYS"; payload: Category }
    | { type: "SET_SELECTED_CATEGORY"; payload: Category | undefined };


const CategoryReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "GET_CATEGORYS":
            return {
                ...state,
                categorys: action.payload
            };
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
        case "REMOVE_CATEGORYS":
            return {
                ...state,
                categorys: state.categorys.filter((category) => category._id !== action.payload)
            };
        case "SET_SELECTED_CATEGORY":
            return {
                ...state, selectedCategory: action.payload
            }
        default:
            return state;
    }
}
export default CategoryReducer;