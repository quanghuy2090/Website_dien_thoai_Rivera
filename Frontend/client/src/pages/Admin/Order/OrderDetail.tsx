import { useEffect, useState } from "react";
import {
  getDetailOrder,
  Order,
  updateStatusAdmin,
} from "../../../services/order";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import "./OrderDetail.css";
import axios from "axios";

const OrderDetail = () => {
    const { id } = useParams();
    const [orderDetail, setOrderDetail] = useState<Order | null>(null);
  const [showCancelReasonForm, setShowCancelReasonForm] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [pendingStatus, setPendingStatus] = useState<Order["status"] | null>(
    null
  );

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

  const handleStatusChange = (newStatus: Order["status"]) => {
    if (newStatus === "Đã hủy") {
      setPendingStatus(newStatus);
      setShowCancelReasonForm(true); // Mở form nhập lý do
      return;
    }

    // Nếu không phải trạng thái hủy thì cập nhật trực tiếp
    updateOrderStatus(newStatus);
  };

  const updateOrderStatus = async (
    status: Order["status"],
    reason: string = ""
  ) => {
        if (!id) {
            toast.error("Không tìm thấy ID đơn hàng!");
            return;
        }

        try {
      const response = await updateStatusAdmin(id, status, reason);
            toast.success(response.data.message || "Cập nhật trạng thái thành công!");
      setOrderDetail(response.data.order);
      setShowCancelReasonForm(false);
      setCancelReason("");
      setPendingStatus(null);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data;
        if (data?.message) {
          toast.error(data.message);
        } else if (Array.isArray(data?.errors)) {
          data.errors.forEach((err: string) => toast.error(err));
        } else {
          toast.error("Đã xảy ra lỗi không xác định khi cập nhật trạng thái!");
        }
        console.error("Lỗi BE:", data);
      } else {
        toast.error("Lỗi không xác định!");
        console.error("Lỗi không rõ:", error);
      }
        }
    };

    const formatPrice = (price: number) => {
        if (price === undefined || price === null) {
            return "0 VND";
        }
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND";
    };

    return (
    <div className="content p-4">
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title mb-0">  Đây là thông tin chi tiết của đơn hàng <strong>{orderDetail?.orderId}</strong></h5>
          <span className="text-primary">Bảng / Đơn hàng</span>
          <div className="">
            <div className="order-info-grid">
              {/* Thông tin đơn hàng */}
              <div className="order-info-card">
                <h3>Thông tin đơn hàng</h3>
                <div className="info-row">
                  <span className="label">Ngày đặt:</span>
                  <span className="value">
                    {orderDetail?.createdAt
                      ? new Date(orderDetail.createdAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
                <div className="info-row">
                  <span className="label">Tổng tiền:</span>
                  <span className="value price">
                    {formatPrice(orderDetail?.totalAmount ?? 0)}
                  </span>
                </div>
                <div className="info-row">
                  <span className="label">Phương thức thanh toán:</span>
                  <span className="value">{orderDetail?.paymentMethod}</span>
                </div>
                <div className="info-row">
                  <span className="label">Trạng thái thanh toán:</span>
                  <span className="value">{orderDetail?.paymentStatus}</span>
                </div>
              </div>

              {/* Thông tin khách hàng */}
              <div className="order-info-card">
                <h3>Thông tin khách hàng</h3>
                <div className="info-row">
                  <span className="label">Tên khách hàng:</span>
                  <span className="value">{orderDetail?.userName}</span>
                </div>
                <div className="info-row">
                  <span className="label">Email:</span>
                  <span className="value">{orderDetail?.userEmail}</span>
                </div>
                <div className="info-row">
                  <span className="label">Số điện thoại:</span>
                  <span className="value">
                    {orderDetail?.shippingAddress.phone}
                  </span>
                </div>
              </div>

              {/* Địa chỉ giao hàng */}
              <div className="order-info-card">
                <h3>Địa chỉ giao hàng</h3>
                <div className="address-info">
                  <p>{orderDetail?.shippingAddress.street}</p>
                  <p>{orderDetail?.shippingAddress.ward}</p>
                  <p>{orderDetail?.shippingAddress.district}</p>
                  <p>{orderDetail?.shippingAddress.city}</p>
                </div>
              </div>

              {/* Trạng thái đơn hàng */}
              <div className="order-info-card">
                <h3>Trạng thái đơn hàng</h3>
                <select
                  value={orderDetail?.status}
                  onChange={(e) =>
                    handleStatusChange(e.target.value as Order["status"])
                  }
                  className="status-select"
                >
                  <option value="Chưa xác nhận">Chưa xác nhận</option>
                  <option value="Đã xác nhận">Đã xác nhận</option>
                  <option value="Đang giao hàng">Đang giao hàng</option>
                  <option value="Đã giao hàng">Đã giao hàng</option>
                  <option value="Hoàn thành" disabled>
                    Hoàn thành
                  </option>
                  <option value="Đã hủy">Huỷ</option>
                </select>
                {orderDetail?.status === "Đã hủy" && orderDetail.cancelReason && (
                  <div className="alert alert-danger mt-3">
                    <strong>Lý do hủy:</strong> {orderDetail.cancelReason}
                  </div>
                )}


                {/* Hiển thị form nhập lý do huỷ */}
                {showCancelReasonForm && (
                  <div className="cancel-reason-form mt-3">
                    <h6 className="fw-semibold">Nhập lý do hủy đơn hàng:</h6>
                    <textarea
                      className="form-control my-2"
                      rows={3}
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      placeholder="Nhập lý do huỷ đơn hàng..."
                    ></textarea>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-danger"
                        onClick={() => {
                          if (!cancelReason.trim()) {
                            toast.error("Vui lòng nhập lý do hủy!");
                            return;
                          }
                          if (pendingStatus) {
                            updateOrderStatus(pendingStatus, cancelReason);
                          }
                        }}
                      >
                        Xác nhận huỷ
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => {
                          setShowCancelReasonForm(false);
                          setCancelReason("");
                          setPendingStatus(null);
                        }}
                      >
                        Huỷ bỏ
                      </button>
                    </div>

                  </div>
                )}
              </div>

            </div>

            {/* Danh sách sản phẩm */}
            <div className="products-section">
              <h3>Sản phẩm đã đặt</h3>
              <div className="products-table">
                <table>
                    <thead>
                        <tr>
                      <th>Sản phẩm</th>
                      <th>Giá gốc</th>
                      <th>Giá sale</th>
                      <th>Số lượng</th>
                      <th>Thành tiền</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orderDetail?.items.map((product, index) => {
                                            const variant = product.productId.variants?.find(
                                                (v) => v._id === product.variantId
                                            );
                                            return (
                                                <tr key={index}>
                          <td className="product-info">
                                                        <img
                                                            src={product.productId.images[0]}
                              alt={product.productId.name}
                              className="product-image"
                            />
                            <div className="product-details">
                              <div className="product-name">
                                {product.productId.name}
                              </div>
                              <div className="variant-info">
                                {variant?.color?.name} - {variant?.capacity?.value}
                              </div>
                            </div>
                                                    </td>
                                                    <td>{formatPrice(product.price)}</td>
                          <td className="sale-price">
                                                        {formatPrice(product.salePrice)}
                                                    </td>
                                                    <td>{product.quantity}</td>
                          <td className="total-price">
                            {formatPrice(product.salePrice * product.quantity)}
                          </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
              </div>
            </div>
          </div>
        </div>
            </div>
        </div>
    );
};

export default OrderDetail;
