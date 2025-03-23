import { useEffect, useState } from "react";
import { getDetailOrder, updateStatusOrder, Order } from "../../../services/order";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const OrderDetail = () => {
    const { id } = useParams();
    const [orderDetail, setOrderDetail] = useState<Order | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchOrderDetail = async (id: string) => {
            try {
                const { data } = await getDetailOrder(id);
                setOrderDetail(data.order);
                toast.success("Lấy chi tiết đơn hàng thành công!");
            } catch (error) {
                toast.error("Không thể tải chi tiết đơn hàng.");
                console.error(error);
            }
        };
        fetchOrderDetail(id);
    }, [id]);

    const handleStatusChange = async (newStatus: Order["status"]) => {
        if (!id) {
            toast.error("Không tìm thấy ID đơn hàng!");
            return;
        }
        try {
            const response = await updateStatusOrder(id, newStatus, "");
            toast.success(response.data.message || "Cập nhật trạng thái thành công!");
            setOrderDetail({ ...orderDetail, status: newStatus } as Order);
        } catch (error) {
            // toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi cập nhật trạng thái!");
            console.error(error);
        }
    };

    const formatPrice = (price: number) => {
        if (price === undefined || price === null) {
            return "0 VND";
        }
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND";
    };

    return (
        <div className="content">
            <h1 className="h3 mb-4 fw-bold text-primary d-flex align-items-center">
                <i className="fas fa-cart-plus me-2"></i> Chi Tiết Đơn Hàng
            </h1>
            <p className="mb-4 text-secondary">
                Đây là thông tin chi tiết của đơn hàng "<strong>{orderDetail?.orderId}</strong>". Bạn có thể kiểm tra trạng thái hoặc cập nhật trực tiếp.
            </p>

            <div className="table-container">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th scope="col">Ngày đặt</th>
                            <th scope="col">Sản phẩm</th>
                            <th scope="col">Tổng tiền</th>
                            <th scope="col">Tên khách hàng</th>
                            <th scope="col">Email</th>
                            <th scope="col">Số điện thoại</th>
                            <th scope="col">Địa chỉ giao hàng</th>
                            <th scope="col">Trạng thái đơn hàng</th>
                            <th scope="col">Phương thức thanh toán</th>
                            <th scope="col">Trạng thái thanh toán</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{orderDetail?.createdAt ? new Date(orderDetail.createdAt).toLocaleDateString() : "N/A"}</td>
                            <td>
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th scope="col">Tên Sản Phẩm</th>
                                            <th scope="col">Giá gốc</th>
                                            <th scope="col">Giá sale</th>
                                            <th scope="col">Số lượng</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orderDetail?.items.map((product, index) => {
                                            const variant = product.productId.variants?.find(
                                                (v) => v._id === product.variantId
                                            );
                                            return (
                                                <tr key={index}>
                                                    <td>
                                                        <img
                                                            src={product.productId.images[0]}
                                                            alt=""
                                                            width={50}
                                                        />
                                                        {product.productId.name}_{variant?.color?.name}_{variant?.capacity?.value}
                                                    </td>
                                                    <td>{formatPrice(product.price)}</td>
                                                    <td className="text-warning fw-bold">
                                                        {formatPrice(product.salePrice)}
                                                    </td>
                                                    <td>{product.quantity}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </td>
                            <td>{formatPrice(orderDetail?.totalAmount ?? 0)}</td>
                            <td>{orderDetail?.userName}</td>
                            <td>{orderDetail?.userEmail}</td>
                            <td>{orderDetail?.userPhone}</td>
                            <td>
                                {orderDetail?.shippingAddress.street} <br />
                                {orderDetail?.shippingAddress.ward} <br />
                                {orderDetail?.shippingAddress.district} <br />
                                {orderDetail?.shippingAddress.city}
                            </td>
                            <td>
                                <select
                                    value={orderDetail?.status}
                                    onChange={(e) =>
                                        handleStatusChange(e.target.value as Order["status"])
                                    }
                                    className="form-select"
                                >
                                    <option value="Chưa xác nhận">Chưa xác nhận</option>
                                    <option value="Đã xác nhận">Đã xác nhận</option>
                                    <option value="Đang giao hàng">Đang giao hàng</option>
                                    <option value="Đã giao hàng">Đã giao hàng</option>
                                    <option value="Hoàn thành" disabled>Hoàn thành</option>
                                    <option value="Đã huỷ" disabled>Đã huỷ</option>

                                </select>
                            </td>

                            <td>{orderDetail?.paymentMethod}</td>
                            <td>{orderDetail?.paymentStatus}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderDetail;
