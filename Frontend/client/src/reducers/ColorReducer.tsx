import { Color } from "../services/color"
type State = {
    colors: Color[];
    selectedColor?: Color
}

type Action =
    | { type: "GET_COLORS"; payload: Color[] }
    | { type: "ADD_COLORS"; payload: Color }
    | { type: "REMOVE_COLORS"; payload: string }
    | { type: "UPDATE_COLORS"; payload: Color }
    | { type: "SET_SELECTED_COLOR"; payload: Color | undefined }

const ColorReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "GET_COLORS":
            return {
                ...state,
                colors: action.payload
            };
        case "ADD_COLORS":
            return {
                ...state,
                colors: [...state.colors, action.payload],
            };
        case "REMOVE_COLORS":
            return {
                ...state,
                colors: state.colors.filter((color) => color._id !== action.payload)
            };
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