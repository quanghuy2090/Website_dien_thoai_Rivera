import React, { createContext, useEffect, useReducer } from "react";
import { getDetailUser, getUser, updateRole, updateStatus, User } from "../services/auth"
import AuthReducer from "../reducers/AuthReducer";
import toast from "react-hot-toast";
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
            toast.success("Lấy user thành công")
        } catch (error) {
            console.log(error)
            toast.error("Lấy người dùng thành công")
        }
    }
    const handleStatusChange = async (userId: string, status: string) => {
        try {
            const { data } = await updateStatus(userId, status);
            dispatch({ type: "UPDATE_STATUS", payload: { _id: userId, status: data.data.status } });
            toast.success("Cập nhạt trạng thái thành công")
        } catch (error) {
            console.log(error)
            toast.error(" Cập nhật trạng thái thất bại")
        }
    }
    const handleRoleChange = async (userId: string, role: number) => {
        try {
            const { data } = await updateRole(userId, role);
            dispatch({ type: "UPDATE_ROLE", payload: { _id: userId, role: data.data.role } })
            toast.success("Cập nhạt vai trò thành công")
        } catch (error) {
            console.log(error)
            toast.success("Cập nhạt vai trò thành công")
        }
    }
    return (
        <AuthContext.Provider value={{ state, getDetailUsers, handleRoleChange, handleStatusChange }}>{children}</AuthContext.Provider>
    )
}