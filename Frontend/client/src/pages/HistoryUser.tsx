import React, { useEffect, useState } from 'react'
import { getOrderUser, Order } from '../services/order';

const HistoryUser = () => {
    const [userId, setUserId] = useState<string | null>(null);
    console.log(userId);
    const [orderUser, setOrderUser] = useState<Order[]>([]);

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            try {
                const user = JSON.parse(userData);
                if (user && user._id) {
                    setUserId(user._id); // Lưu userId vào state
                    fetchOrder(user._id);
                }
            } catch (error) {
                console.error(" Lỗi khi parse user data:", error);
            }
        }
    }, []);

    const fetchOrder = async (userId: string) => {
        try {
            const { data } = await getOrderUser(userId);
            setOrderUser(data.orders || []);
        } catch (error) {
            console.log(error);
        }
    }
    const formatPrice = (price: number) => {
        if (price === undefined || price === null) {
            return "0 VND"; // Return a default value if price is undefined
        }
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND";
    };
    return (
        <div>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Mã đơn hàng</th>
                        <th scope="col">Ngày đặt</th>
                        <th scope="col">San pham</th>
                        <th scope="col">Tong tien</th>
                        <th scope="col">Trạng thái đơn hàng</th>
                        <th scope="col">Phương thức thanh toán</th>
                        <th scope="col">Trạng thái thanh toán</th>
                    </tr>
                </thead>
                <tbody>
                    {orderUser.map((order) => (
                        <tr>
                            <td>{order._id}</td>
                            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td>{order.orderItems.map((cart) => (
                                <div>
                                    <li>
                                        {cart.productId.images && (
                                            <img src={cart.productId.images[0]} alt="Sản phẩm" width={50} />
                                        )}
                                    </li>
                                    <li>{cart.productId.name}</li>
                                    <li>{formatPrice(cart.productId.price)}</li>
                                    <li>{cart.quantity}</li>
                                </div>
                            ))}</td>
                            <td>{formatPrice(order.totalPrice)}</td>
                            <td>{order.orderStatus}</td>
                            <td>{order.paymentMethod}</td>
                            <td>{order.paymentStatus}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default HistoryUser