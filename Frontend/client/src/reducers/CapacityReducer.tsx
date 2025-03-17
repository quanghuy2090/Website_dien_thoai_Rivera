import { Capacity } from "../services/capacity";
type State = {
    capacitys: Capacity[];
}

type Action =
    | { type: "GET_CAPACITY"; payload: Capacity[] }
    | { type: "ADD_CAPACITY"; payload: Capacity }
    | { type: "REMOVE_CAPACITY"; payload: string }

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
        default:
            return state;
    }
}

export default CapacityReducer;