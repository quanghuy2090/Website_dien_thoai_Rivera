import { Color } from "../services/color"

type State = {
    colors: Color[];
    selectedColor?: Color;
    deletedColor: Color[];
}

type Action =
    | { type: "GET_COLORS"; payload: Color[] }
    | { type: "ADD_COLORS"; payload: Color }
    | { type: "REMOVE_COLORS"; payload: string }
    | { type: "UPDATE_COLORS"; payload: Color }
    | { type: "SET_SELECTED_COLOR"; payload: Color | undefined }
    | { type: "GET_COLOR_DELETE"; payload: Color[] }
    | { type: "UPDATE_COLOR_RESTORE"; payload: Color };

const ColorReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "GET_COLORS":
            return {
                ...state,
                colors: action.payload
            };
        case "GET_COLOR_DELETE":
            return {
                ...state,
                deletedColor: action.payload,
            };
        case "ADD_COLORS":
            return {
                ...state,
                colors: [...state.colors, action.payload],
            };
        case "UPDATE_COLOR_RESTORE":
            return {
                ...state,
                // Loại bỏ màu vừa khôi phục khỏi deletedColor
                deletedColor: state.deletedColor.filter(
                    (color) => color._id !== action.payload._id
                ),
                // Thêm màu vừa khôi phục vào colors
                colors: [...state.colors, action.payload],
            };
        case "REMOVE_COLORS": {
            const removedColor = state.colors.find(
                (color) => color._id === action.payload
            );
            return {
                ...state,
                colors: state.colors.filter(
                    (color) => color._id !== action.payload
                ),
                deletedColor: removedColor
                    ? [...state.deletedColor, removedColor]
                    : state.deletedColor,
            }
        }
        case "UPDATE_COLORS":
            return {
                ...state,
                colors: state.colors.map((color) => color._id === action.payload._id ? action.payload : color)
            }
        case "SET_SELECTED_COLOR":
            return {
                ...state, selectedColor: action.payload
            }
        default:
            return state;
    }
}

export default ColorReducer;