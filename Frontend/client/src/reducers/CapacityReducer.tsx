import { Capacity } from "../services/capacity";
type State = {
    capacitys: Capacity[];
    selectedCapacity?: Capacity
}

type Action =
    | { type: "GET_CAPACITY"; payload: Capacity[] }
    | { type: "ADD_CAPACITY"; payload: Capacity }
    | { type: "REMOVE_CAPACITY"; payload: string }
    | { type: "UPDATE_CAPACITY"; payload: Capacity }
    | { type: "SET_SELECTED_CAPACITY"; payload: Capacity | undefined }

const CapacityReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "GET_CAPACITY":
            return {
                ...state,
                capacitys: action.payload
            };
        case "ADD_CAPACITY":
            return {
                ...state,
                capacitys: [...state.capacitys, action.payload],
            };
        case "REMOVE_CAPACITY":
            return {
                ...state,
                capacitys: state.capacitys.filter((capacity) => capacity._id !== action.payload)
            };
        case "UPDATE_CAPACITY":
            return {
                ...state,
                capacitys: state.capacitys.map((capacity) => capacity._id === action.payload._id ? action.payload : capacity)
            }
        case "SET_SELECTED_CAPACITY":
            return {
                ...state, selectedCapacity: action.payload
            }
        default:
            return state;
    }
}

export default CapacityReducer;