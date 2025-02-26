import React, { useEffect, useState } from 'react'
import { getOrderUser, Order, updateStatusOrder } from '../services/order';
// import { useParams } from 'react-router-dom';

const HistoryUser = () => {
    const [userId, setUserId] = useState<string | null>(null);
    console.log(userId);
    const [orderUser, setOrderUser] = useState<Order[]>([]);
    // const [orderStatus, setOrderStatus] = useState<Order["orderStatus"]>();
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

    const handleStatusChange = async (orderId: string, newStatus: Order["orderStatus"]) => {
        try {
            await updateStatusOrder(orderId, newStatus, newStatus === "Đã huỷ" ? "Lý do hủy" : "");
            alert("Cập nhật trạng thái thành công!");
            // Gọi lại API để cập nhật danh sách đơn hàng sau khi thay đổi trạng thái
            fetchOrder(userId!);
        } catch (error) {
            console.error("Lỗi cập nhật trạng thái:", error);
            alert("Cập nhật trạng thái thất bại, vui lòng thử lại!");
        }
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
                            <td>
                                <select className='form-select'
                                    value={order.orderStatus}
                                    onChange={(e) => handleStatusChange(order._id, e.target.value as Order["orderStatus"])}
                                ><option value="Chưa xác nhận" disabled>Chưa xác nhận</option>
                                    <option value="Đã xác nhận" disabled>Đã xác nhận</option>
                                    <option value="Đang giao hàng" disabled>Đang giao hàng</option>
                                    <option value="Đã giao hàng" disabled>Đã giao hàng</option>
                                    <option value="Đã nhận hàng">Đã nhận hàng</option>
                                    <option value="Đã huỷ">Đã hủy</option>
                                </select>
                            </td>
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