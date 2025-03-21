import React, { createContext, useEffect, useReducer } from "react";
import { addProduct, getAllProduct, getProductById, Product, removeProduct, updateProduct, updateProductIs_Hot, updateProductStatus } from "../services/product"
import ProductReducer from "../reducers/ProductReducer";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

type ProductContextType = {
    state: { products: Product[]; selectedProduct?: Product };
    removeProducts: (_id: string) => void
    updateProducts: (_id: string, product: Product) => void;
    createProduct: (product: Product) => void;
    getDetailProduct: (_id: string) => void;
    updateStatus: (_id: string, status: string) => void;
    updateIs_Hot: (_id: string, is_hot: string) => void;
}

export const ProductContext = createContext({} as ProductContextType)
type Children = {
    children: React.ReactNode;
}

export const ProductProvider = ({ children }: Children) => {
    const [state, dispatch] = useReducer(ProductReducer, { products: [] });
    const nav = useNavigate();
    useEffect(() => {
        (async () => {
            const { data } = await getAllProduct();
            dispatch({ type: "GET_PRODUCTS", payload: data.data })

        })()
    }, [])

    const removeProducts = async (_id: string) => {
        try {
            if (confirm("delete")) {
                await removeProduct(_id); // Không cần lấy `data`
                dispatch({ type: "REMOVE_PRODUCTS", payload: _id }); // Cập nhật state
                toast.success("Sản phẩm đã được xóa");
            }
        } catch (error) {
            console.log(error);
            toast.error("Sản phẩm bị lỗi khi xóa")
        }
    };
    const updateProducts = async (_id: string, product: Product) => {
        try {
            const { data } = await updateProduct(_id, product);
            dispatch({ type: "UPDATE_PRODUCTS", payload: data.data });

            // Fetch lại danh sách sản phẩm để cập nhật danh mục đầy đủ
            const updatedProducts = await getAllProduct();
            dispatch({ type: "GET_PRODUCTS", payload: updatedProducts.data.data });

            toast.success("Cập nhật thành công!");
            nav("/admin/products");
        } catch (err) {
            console.log(err)
            if (err instanceof AxiosError) {
                toast.error(err.response?.data?.message || "Lỗi cập nhật sản phẩm!");
            } else if (err instanceof Error) {
                toast.error(`Lỗi: ${err.message}`);
            } else {
                toast.error("Không thể kết nối đến server!");
            }

        }
    };
    const createProduct = async (product: Product) => {
        try {
            const { data } = await addProduct(product);
            dispatch({ type: "ADD_PRODUCTS", payload: data.data });

            // Fetch lại danh sách sản phẩm để cập nhật danh mục đầy đủ
            const updatedProducts = await getAllProduct();
            dispatch({ type: "GET_PRODUCTS", payload: updatedProducts.data.data });
            toast.success("Thêm thành công!");
            nav("/admin/products");
        } catch (err: unknown) {
            console.log(err);
            if (err instanceof AxiosError) {
                const { status, data } = err.response || {};

                if (status === 400) {
                    toast.error(`Lỗi: ${data?.message}`);
                } else if (status === 404) {
                    toast.error("Danh mục không tồn tại!");
                } else if (status === 500) {
                    toast.error("Lỗi máy chủ! Vui lòng thử lại sau.");
                } else {
                    toast.error("Đã xảy ra lỗi không xác định.");
                }
            } else if (err instanceof Error) {
                toast.error(`Lỗi: ${err.message}`);
            } else {
                toast.error("Không thể kết nối đến server!");
            }
        }
    };
    const getDetailProduct = async (_id: string) => {
        try {
            const { data } = await getProductById(_id);
            dispatch({ type: "SET_SELECTED_PRODUCTS", payload: data.data })
            toast.success("Lấy chi tiết sản phẩm  thành công!");
        } catch (error) {
            console.log(error)
        }
    }
    const updateStatus = async (_id: string, status: string) => {
        try {
            const { data } = await updateProductStatus(_id, status);
            dispatch({ type: "UPDATE_STATUS", payload: data.data })
            toast.success("cập nhật trạng thái thành công")
        } catch (error) {
            console.log(error);
            toast.error("cập nhật trạng thái thất bại")
        }
    }
    const updateIs_Hot = async (_id: string, is_hot: string) => {
        try {
            const { data } = await updateProductIs_Hot(_id, is_hot);
            dispatch({ type: "UPDATE_IS_HOT", payload: data.data })
            toast.success("cập nhật trạng thái thành công")
        } catch (error) {
            console.log(error)
            toast.error("cập nhậ trạng thái thất bại")
        }
    }
    return (
        <ProductContext.Provider value={{ state, removeProducts, updateProducts, createProduct, getDetailProduct, updateStatus, updateIs_Hot }}>{children}</ProductContext.Provider>
    )
}