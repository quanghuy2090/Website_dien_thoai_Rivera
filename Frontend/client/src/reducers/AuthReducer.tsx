import { User } from "../services/auth"



type State = {
    users: User[];
    selectedUsers?: User
};

type Action =
    | { type: "GET_USER"; payload: User[] }
    | { type: "SET_SELECTED_USER"; payload: User | undefined }
    | { type: "UPDATE_STATUS"; payload: { _id: string; status: string } }
    | { type: "UPDATE_ROLE"; payload: { _id: string; role: number } }
    | { type: "ADD_USER"; payload: User }
    | { type: "UPDATE_USER"; payload: User };


const AuthReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "GET_USER":
            return {
                ...state,
                users: action.payload
            };
        case "ADD_USER":
            return {
                ...state,
                users: [...state.users, action.payload],
            }
        case "UPDATE_USER":
            return {
                ...state,
                users: state.users.map((user) => user._id === action.payload._id ? action.payload : user)
            }

        case "SET_SELECTED_USER":
            return {
                ...state, selectedUsers: action.payload,
            };
        case "UPDATE_ROLE":
            return {
                ...state,
                users: state.users.map(user =>
                    user._id === action.payload._id ? { ...user, role: action.payload.role } : user
                ),
                selectedUsers: state.selectedUsers?._id === action.payload._id
                    ? { ...state.selectedUsers, role: action.payload.role }
                    : state.selectedUsers
            };
        case "UPDATE_STATUS":
            return {
                ...state,
                users: state.users.map(user =>
                    user._id === action.payload._id ? { ...user, status: action.payload.status } : user
                ),
                selectedUsers: state.selectedUsers?._id === action.payload._id
                    ? { ...state.selectedUsers, status: action.payload.status }
                    : state.selectedUsers
            };
        default:
            return state
    }
}

export default AuthReducer

