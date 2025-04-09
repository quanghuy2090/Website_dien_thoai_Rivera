import React, { createContext, useEffect, useReducer } from "react";
import { getDetailUser, getUser, registerUser, updateRole, updateStatus, updateUser, User } from "../services/auth"
import AuthReducer from "../reducers/AuthReducer";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
type AuthContextType = {
    state: { users: User[]; selectedUsers?: User };
    getDetailUsers: (_id: string) => void;
    handleStatusChange: (userId: string, status: string) => void
    handleRoleChange: (userId: string, role: number) => void;
    createUser: (user: User) => void;
    updateUsers: (_id: string, user: User) => void;
};

export const AuthContext = createContext({} as AuthContextType);

type Children = {
    children: React.ReactNode;
};

export const AuthProvider = ({ children }: Children) => {
    const [state, dispatch] = useReducer(AuthReducer, { users: [] });
    const nav = useNavigate();

    useEffect(() => {
        (async () => {
            const { data } = await getUser();

            dispatch({ type: "GET_USER", payload: data.data.users })
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
    const createUser = async (user: User) => {
        try {
            const { data } = await registerUser(user)
            dispatch({ type: "ADD_USER", payload: data.data });
            nav("/admin/user")
            toast.success("Thêm user thành công")
        } catch (error) {
            console.log(error)
            toast.error("Thêm user thất bại")
        }
    }
    const updateUsers = async (_id: string, user: User) => {
        try {
            const { data } = await updateUser(_id, user);
            dispatch({ type: "UPDATE_USER", payload: data.data });

            const updatedBy = data.data.updatedBy?.email || "Không rõ";

            // Hiển thị alert thông báo
            alert(`Người thực hiện: ${updatedBy}`);

            // Sau khi đóng alert, hiển thị toast
            toast.success(`Cập nhật thành công`);
            nav("/admin/user");

        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi.";
                toast.error(`Lỗi: ${errorMessage}`);
            } else {
                toast.error("Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau!");
            }
        }
    };

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
        <AuthContext.Provider value={{ state, getDetailUsers, handleRoleChange, handleStatusChange, createUser, updateUsers }}>{children}</AuthContext.Provider>
    )
}