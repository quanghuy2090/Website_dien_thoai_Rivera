
import React, { useEffect, useState } from 'react';
import { Carts, deleteCart, getCart } from './../services/cart';
import toast from 'react-hot-toast';

const Cart = () => {
    const [carts, setCarts] = useState<Carts[]>([]);
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [userId, setUserId] = useState<string | null>(null); // Lưu userId vào state

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            try {
                const user = JSON.parse(userData);
                if (user && user._id) {
                    setUserId(user._id); // Lưu userId vào state
                    fetchCart(user._id);
                }
            } catch (error) {
                console.error(" Lỗi khi parse user data:", error);
            }
        }
    }, []);

    const fetchCart = async (userId: string) => {
        try {
            console.log(" Fetching cart for user ID:", userId);
            const { data } = await getCart(userId);
            console.log("Dữ liệu giỏ hàng:", data);
            setCarts(data.cart.items || []);
            setTotalAmount(data.totalAmount || 0);
        } catch (error) {
            console.error(" Lỗi khi lấy giỏ hàng:", error);
        }
    };

    const removeCart = async (productId: string) => {
        if (!userId || !productId) {
            console.error(" userId hoặc productId bị thiếu:", { userId, productId });
            return;
        }
        try {
            const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa sản phẩm?");
            if (isConfirmed) {
                // Lọc ra các sản phẩm còn lại sau khi xóa
                const updatedCarts = carts.filter((cart) => cart.productId._id !== productId);
                setCarts(updatedCarts);

                // Tính lại tổng tiền
                const newTotalAmount = updatedCarts.reduce((sum, item) => sum + item.productId.price * item.quantity, 0);
                setTotalAmount(newTotalAmount);

                // Gửi request xóa sản phẩm khỏi backend
                await deleteCart(userId, productId);
                toast.success("Cart deleted successfully")
                console.log(" Sản phẩm đã được xóa, tổng tiền cập nhật:", newTotalAmount);
            }
        } catch (error) {
            console.error(" Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
            toast.error("Error")
        }
    };

    return (
        <div>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Product</th>
                        <th scope="col">Name</th>
                        <th scope="col">Price</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Total</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {carts.map((item, index) => (
                        <tr key={index}>
                            <td>
                                {item.productId?.images && (
                                    <img src={item.productId.images[0]} alt="" width={100} />
                                )}
                            </td>
                            <td>{item.productId?.name}</td>
                            <td>{item.productId?.price}</td>
                            <td>{item.quantity}</td>
                            <td>{item.productId.price * item.quantity}</td>
                            <td>
                                <button
                                    className='btn btn-danger'
                                    onClick={() => removeCart(item.productId._id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <h3>Total Amount: {totalAmount.toFixed()}</h3>
        </div>
    );
};

export default Cart;
