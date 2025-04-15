import React, { createContext, useEffect, useReducer } from "react";
import { addCategories, Category, deleteCategories, getCategories, getCategoriesById, getCategoriesDeleted, updateCategories, updateCategoryRestore } from "../services/category"
import CategoryReducer from "../reducers/CategoryReducer";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AxiosError } from "axios";


type CategoryContextType = {
    state: { categorys: Category[]; selectedCategory?: Category, deletedCategorys: Category[] };
    removeCategory: (_id: string) => void;
    updateCategory: (_id: string, category: Category) => void;
    createCategory: (category: Category) => void;
    getDetailCategory: (_id: string) => void;
    updateCategoriesRestoted: (_id: string, category: Category) => void;
};

export const CategoryContext = createContext({} as CategoryContextType);

type Children = {
    children: React.ReactNode;
};

export const CategoryProvider = ({ children }: Children) => {
    const [state, dispatch] = useReducer(CategoryReducer, { categorys: [], deletedCategorys: [], });
    const nav = useNavigate();

    useEffect(() => {
        (async () => {
            const { data } = await getCategories();
            dispatch({ type: "GET_CATEGORYS", payload: data.data })
        })()
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await getCategoriesDeleted();
                dispatch({ type: "GET_CATEGORYS_DELETE", payload: data.data });
            } catch (error) {
                console.error("Lỗi khi lấy danh sách danh mục đã xóa:", error);
                // toast.error("Không thể tải danh sách danh mục đã xóa");
            }
        })();
    }, []);

    const removeCategory = async (_id: string) => {
        try {
            if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
                const response = await deleteCategories(_id);
                console.log(response)
                dispatch({ type: "REMOVE_CATEGORYS", payload: _id });

                // Cập nhật lại danh sách danh mục đã xóa từ backend
                const { data } = await getCategoriesDeleted();
                dispatch({ type: "GET_CATEGORYS_DELETE", payload: data.data });
                toast.success(`Xóa danh mục thành công `);
            }
        }
        catch (error) {
            console.error("Lỗi khi xóa danh mục:", error);
            toast.error("Không thể xóa danh mục đang chứa sản phẩm");
        }
    };

    const updateCategory = async (_id: string, category: Category) => {
        try {
            const { data } = await updateCategories(_id, category);
            dispatch({ type: "UPDATE_CATEGORYS", payload: data.data })
            nav("/admin/category");
            toast.success("Cập nhật danh mục thành công")
        } catch (error) {
            console.log(error)
            if (error instanceof AxiosError && error.response) {
                // Kiểm tra xem có dữ liệu lỗi từ backend không
                const errorMessage = error.response?.data?.message || "Sửa danh mục thất bại";
                toast.error(errorMessage);
            } else {
                // Nếu không phải lỗi Axios, hiển thị thông báo lỗi chung
                toast.error("Sửa danh mục thất bại");
            }
            // toast.error("cập nhật danh mục thất bại")
        }
    }

    const updateCategoriesRestoted = async (_id: string, category: Category) => {
        try {
            const { data } = await updateCategoryRestore(_id, category);
            dispatch({ type: "UPDATE_CATEGORY_RESTORE", payload: data.data })
            toast.success("Cập nhật danh mục thành công")
        } catch (error) {
            console.log(error)
            toast.error("cập nhật danh mục thất bại")
        }
    }
    const createCategory = async (category: Category) => {
        try {
            const { data } = await addCategories(category);
            dispatch({ type: "ADD_CATEGORYS", payload: data.data })
            nav("/admin/category");
            toast.success("Thêm danh mục thành công")
        } catch (error) {
            console.log(error)
            if (error instanceof AxiosError && error.response) {
                // Kiểm tra xem có dữ liệu lỗi từ backend không
                const errorMessage = error.response?.data?.message || "Thêm danh mục thất bại";
                toast.error(errorMessage);
            } else {
                // Nếu không phải lỗi Axios, hiển thị thông báo lỗi chung
                toast.error("Thêm danh mục thất bại");
            }
            // toast.error("Thêm danh mục thất bại")
        }
    };
    const getDetailCategory = async (_id: string) => {
        try {
            const { data } = await getCategoriesById(_id);
            dispatch({ type: "SET_SELECTED_CATEGORY", payload: data.data })
            toast.success("Lấy danh mục thành công")
        } catch (error) {
            console.log(error)
            toast.error("Lấy danh mục thất bại")
        }
    }
    return (
        <CategoryContext.Provider value={{ state, removeCategory, updateCategory, createCategory, getDetailCategory, updateCategoriesRestoted }}>{children}</CategoryContext.Provider>
    )
}