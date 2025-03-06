import { useEffect, useState } from "react";
import { getOrderUser, Order } from "../../services/order";
const Bill = () => {
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
        <div className="container mt-4">
            <h2 className="text-center mb-4">Danh sách đơn hàng</h2>
            {orderUser.map((order, index) => (
                <div className="card mb-4 shadow-sm" key={index}>
                    <div className="card-body">
                        <h5 className="card-title">Mã đơn hàng: <span className="fw-bold">{order._id}</span></h5>
                        <p className="text-muted">Ngày đặt: {new Date(order.createdAt).toLocaleDateString()}</p>

                        {/* Bảng danh sách sản phẩm */}
                        <table className="table table-bordered">
                            <thead className="table-light">
                                <tr>
                                    <th>Ảnh</th>
                                    <th>Tên sản phẩm</th>
                                    <th>Giá</th>

                                    <th>Số lượng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.orderItems.map((cart) => (
                                    <tr>
                                        <td>
                                            {cart.productId.images && (
                                                <img src={cart.productId.images[0]} alt="Sản phẩm" width={50} />
                                            )}
                                        </td>
                                        <td>{cart.productId.name}</td>
                                        <td>{formatPrice(cart.productId.price)}</td>
                                        <td>{cart.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <h6 className="mt-3">Tổng tiền: <span className="text-danger fw-bold">{formatPrice(order.totalPrice)} VNĐ</span></h6>
                        {/* Thông tin địa chỉ giao hàng */}
                        <div className="mt-3">
                            <h6>Địa chỉ giao hàng:</h6>
                            <p className="mb-1">Ten kh:<strong>{order.shippingAddress.fullName}</strong></p>
                            <p className="mb-1">Sdt:{order.shippingAddress.phone}</p>
                            <p className="mb-1">{order.shippingAddress.address}, {order.shippingAddress.ward}, {order.shippingAddress.district}, {order.shippingAddress.city}</p>
                        </div>
                        {/* Trạng thái đơn hàng */}
                        <p className="mt-3">
                            <span className="fw-bold">Trạng thái đơn hàng:</span> {order.orderStatus}
                        </p>
                        <p>
                            <span className="fw-bold">Phương thức thanh toán:</span> {order.paymentMethod}
                        </p>
                        <p>
                            <span className="fw-bold">Trạng thái thanh toán:</span> {order.paymentStatus}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Bill