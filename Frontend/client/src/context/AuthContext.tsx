import React, { createContext, useEffect, useReducer } from "react";
import { getDetailUser, getUser, updateRole, updateStatus, User } from "../services/auth"
import AuthReducer from "../reducers/AuthReducer";
type AuthContextType = {
    state: { users: User[]; selectedUsers?: User };
    getDetailUsers: (_id: string) => void;
    handleStatusChange: (userId: string, status: string) => void
    handleRoleChange: (userId: string, role: number) => void;
};

export const AuthContext = createContext({} as AuthContextType);

type Children = {
    children: React.ReactNode;
};

export const AuthProvider = ({ children }: Children) => {
    const [state, dispatch] = useReducer(AuthReducer, { users: [] });

    useEffect(() => {
        (async () => {
            const { data } = await getUser();
            dispatch({ type: "GET_USER", payload: data.data })
        })()
    }, []);

    const getDetailUsers = async (_id: string) => {
        try {
            const { data } = await getDetailUser(_id);
            dispatch({ type: "SET_SELECTED_USER", payload: data.data })
        } catch (error) {
            console.log(error)
        }
    }
    const handleStatusChange = async (userId: string, status: string) => {
        try {
            const { data } = await updateStatus(userId, status);
            dispatch({ type: "UPDATE_STATUS", payload: { _id: userId, status: data.data.status } });

        } catch (error) {
            console.log(error)
        }
    }
    const handleRoleChange = async (userId: string, role: number) => {
        try {
            const { data } = await updateRole(userId, role);
            dispatch({ type: "UPDATE_ROLE", payload: { _id: userId, role: data.data.role } })
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <AuthContext.Provider value={{ state, getDetailUsers, handleRoleChange, handleStatusChange }}>{children}</AuthContext.Provider>
    )
}