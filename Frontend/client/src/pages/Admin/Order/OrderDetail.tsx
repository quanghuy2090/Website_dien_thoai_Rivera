import { useEffect, useState } from "react"
import { getDetailOrder, Order, updateStatusOrder, } from "../../../services/order"
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";


const OrderDetail = () => {
    const { id } = useParams();
    const [orderDetail, setOrderDetail] = useState<Order | null>(null);
    const [orderStatus, setOrderStatus] = useState<Order["orderStatus"]>();
    useEffect(() => {
        if (!id) return;

        const fetchOrderDetail = async (id: string) => {
            const { data } = await getDetailOrder(id);
            setOrderDetail(data.order);
            toast.success("order detail successfully")
        };
        fetchOrderDetail(id);
    }, [id, orderStatus]);
    const formatPrice = (price: number) => {
        if (price === undefined || price === null) {
            return "0 VND"; // Return a default value if price is undefined
        }
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND";
    };

    const handleStatusChange = async (newStatus: Order["orderStatus"]) => {
        console.log("Trạng thái mới:", newStatus); // Debug

        if (!orderDetail) {
            alert("Không tìm thấy thông tin đơn hàng!");
            return;
        }

        try {
            // 🛠 Gọi API cập nhật trạng thái
            await updateStatusOrder(orderDetail._id, newStatus, newStatus === "Đã huỷ" ? "Lý do hủy" : "");
            alert("Cập nhật trạng thái thành công!");

            // 🛠 Gọi lại API để cập nhật chi tiết đơn hàng
            const res = await getDetailOrder(orderDetail._id);
            console.log("Dữ liệu đơn hàng mới:", res.data.order); // Debug
            setOrderDetail(res.data.order);
            setOrderStatus(res.data.order.orderStatus); // Cập nhật trạng thái chính xác từ API

        } catch (error) {
            console.error("Lỗi cập nhật trạng thái:", error);
            alert("Cập nhật trạng thái thất bại, vui lòng thử lại!");
        }
    };
    return (
        <div className='container mt-4'>
            <table className="table">
                <thead className='table-primary'>
                    <tr>
                        <th scope="col">Mã đơn hàng</th>
                        <th scope="col">Ngày đặt</th>
                        <th scope="col">Product</th>
                        <th scope="col">Tổng tiền</th>
                        <th scope="col">Ten kh</th>
                        <th scope="col">Email</th>
                        <th scope="col">Địa chỉ giao hàng</th>
                        <th scope="col">Trạng thái đơn hàng</th>
                        <th scope="col">Phương thức thanh toán</th>
                        <th scope="col">Trạng thái thanh toán</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{orderDetail?._id}</td>
                        <td>{orderDetail?.createdAt ? new Date(orderDetail.createdAt).toLocaleDateString() : "N/A"}</td>
                        <td>{orderDetail?.orderItems.map((cart) => (
                            <tr>
                                <td>{cart.productId.images && (
                                    <img src={cart.productId.images[0]} alt="" width={50} />
                                )}</td>
                                <td>{cart.productId.name}</td>
                                <td>{cart.productId.price}</td>
                                <td>{cart.quantity}</td>
                            </tr>
                        ))}</td>
                        <td>{formatPrice(orderDetail?.totalPrice ?? 0)}</td>
                        <td>{orderDetail?.userId.userName}</td>
                        <td>{orderDetail?.userId.email}</td>
                        <td>{orderDetail?.shippingAddress.address},{orderDetail?.shippingAddress.ward},{orderDetail?.shippingAddress.district},{orderDetail?.shippingAddress.city}</td>
                        <select value={orderDetail?.orderStatus} onChange={(e) => handleStatusChange(e.target.value as Order["orderStatus"])}>
                            <option value="Chưa xác nhận">Chưa xác nhận</option>
                            <option value="Đã xác nhận">Đã xác nhận</option>
                            <option value="Đang giao hàng">Đang giao hàng</option>
                            <option value="Đã giao hàng">Đã giao hàng</option>
                            <option value="Hoàn thành" disabled>Hoàn thành</option>
                            <option value="Đã huỷ" disabled>Đã hủy</option>
                        </select>
                        {/* <input
                            type="text"
                            placeholder="Nhập lý do hủy"
                            value={cancellationReason}
                            onChange={(e) => setCancellationReason(e.target.value)}
                            onBlur={() => handleStatusChange("Đã huỷ")} // Gọi API khi rời khỏi ô nhập
                        /> */}
                        <td>{orderDetail?.paymentMethod}</td>
                        <td>{orderDetail?.paymentStatus}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default OrderDetail