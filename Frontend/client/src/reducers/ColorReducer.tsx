import { Color } from "../services/color"

type State = {
    colors: Color[];
}

type Action = 
    | { type: "GET_COLORS"; payload: Color[] }
    | { type: "ADD_COLORS"; payload: Color}
    | { type: "REMOVE_COLORS"; payload: string }

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
        default:
            return state;
    }
}

export default ColorReducer;