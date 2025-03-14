import React, { createContext, useEffect, useReducer } from "react";
import { addCategories, Category, deleteCategories, getCategories, getCategoriesById, updateCategories } from "../services/category"
import CategoryReducer from "../reducers/CategoryReducer";
import { useNavigate } from "react-router-dom";


type CategoryContextType = {
    state: { categorys: Category[]; selectedCategory?: Category };
    removeCategory: (_id: string) => void;
    updateCategory: (_id: string, category: Category) => void;
    createCategory: (category: Category) => void;
    getDetailCategory: (_id: string) => void;
};

export const CategoryContext = createContext({} as CategoryContextType);

type Children = {
    children: React.ReactNode;
};

export const CategoryProvider = ({ children }: Children) => {
    const [state, dispatch] = useReducer(CategoryReducer, { categorys: [] });
    const nav = useNavigate();

    useEffect(() => {
        (async () => {
            const { data } = await getCategories();
            dispatch({ type: "GET_CATEGORYS", payload: data.data })
        })()
    }, []);

    const removeCategory = async (_id: string) => {
        try {
            if (confirm("delete")) {
                await deleteCategories(_id);
                dispatch({ type: "REMOVE_CATEGORYS", payload: _id })
            }
        } catch (error) {
            console.log(error)
        }
    };
    const updateCategory = async (_id: string, category: Category) => {
        try {
            const { data } = await updateCategories(_id, category);
            dispatch({ type: "UPDATE_CATEGORYS", payload: data.data })
            nav("/admin/category");
        } catch (error) {
            console.log(error)
        }
    }
    const createCategory = async (category: Category) => {
        try {
            const { data } = await addCategories(category);
            dispatch({ type: "ADD_CATEGORYS", payload: data.data })
            nav("/admin/category");
        } catch (error) {
            console.log(error)
        }
    };
    const getDetailCategory = async (_id: string) => {
        try {
            const { data } = await getCategoriesById(_id);
            dispatch({ type: "SET_SELECTED_CATEGORY", payload: data.data })
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <CategoryContext.Provider value={{ state, removeCategory, updateCategory, createCategory, getDetailCategory }}>{children}</CategoryContext.Provider>
    )
}