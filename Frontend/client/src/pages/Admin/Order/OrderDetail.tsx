import { useEffect, useState } from "react";
import {
  getOrderById,
  Order,
  updateOrderStatusByAdmin,
} from "../../../services/order";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAdminOrderPolling } from "../../../hooks/useAdminOrderPolling";
import "./OrderDetail.css";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, checkOrderUpdates } = useAdminOrderPolling();
  const [order, setOrder] = useState(
    orders.find((o) => o.orderId === id) || null
  );
  const [loading, setLoading] = useState(!order);
  const [showCancelReasonForm, setShowCancelReasonForm] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);
  const [hasReloaded, setHasReloaded] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchOrderDetail = async () => {
      try {
        const { data } = await getOrderById(id);
        if (data.order) {
          setOrder(data.order);
        }
      } catch (error) {
        toast.error("Không thể tải chi tiết đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    if (!order) {
      fetchOrderDetail();
    }
  }, [id, order]);

  // Kiểm tra thay đổi trạng thái và tự động reload
  useEffect(() => {
    if (!id || !order || hasReloaded) return;

    const checkStatusChange = async () => {
      await checkOrderUpdates();
      const updatedOrder = orders.find((o) => o.orderId === id);

      if (updatedOrder && updatedOrder.status !== order.status) {
        setHasReloaded(true);
        navigate(0); // Reload trang
      }
    };

    const interval = setInterval(checkStatusChange, 2000);
    return () => clearInterval(interval);
  }, [id, order, orders, hasReloaded, checkOrderUpdates, navigate]);

  const handleStatusChange = (newStatus: string) => {
    if (newStatus === "Đã hủy") {
      setPendingStatus(newStatus);
      setShowCancelReasonForm(true);
      return;
    }

    updateOrderStatus(newStatus);
  };

  const updateOrderStatus = async (status: string, reason: string = "") => {
    if (!id) {
      toast.error("Không tìm thấy ID đơn hàng!");
      return;
    }

    try {
      const { data } = await updateOrderStatusByAdmin(id, status, reason);
      toast.success(data.message);
      setOrder(data.order);
      setShowCancelReasonForm(false);
      setCancelReason("");
      setPendingStatus(null);
      setHasReloaded(false); // Reset trạng thái reload
    } catch (error) {
      toast.error("Cập nhật trạng thái thất bại");
    }
  };

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND";
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  if (!order) {
    return <div className="error">Không tìm thấy đơn hàng</div>;
  }

  return (
    <div className="content p-4">
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title mb-0">
            Thông tin chi tiết đơn hàng <strong>#{order.orderId}</strong>
          </h5>
          <span className="text-primary">Bảng / Đơn hàng</span>

          <div className="order-info-grid">
            {/* Thông tin đơn hàng */}
            <div className="order-info-card">
              <h3>Thông tin đơn hàng</h3>
              <div className="info-row">
                <span className="label">Ngày đặt:</span>
                <span className="value">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="info-row">
                <span className="label">Tổng tiền:</span>
                <span className="value price">
                  {formatPrice(order.totalAmount)}
                </span>
              </div>
              <div className="info-row">
                <span className="label">Phương thức thanh toán:</span>
                <span className="value">{order.paymentMethod}</span>
              </div>
              <div className="info-row">
                <span className="label">Trạng thái thanh toán:</span>
                <span className="value">{order.paymentStatus}</span>
              </div>
            </div>

            {/* Thông tin khách hàng */}
            <div className="order-info-card">
              <h3>Thông tin khách hàng</h3>
              <div className="info-row">
                <span className="label">Tên khách hàng:</span>
                <span className="value">{order.shippingAddress.userName}</span>
              </div>
              <div className="info-row">
                <span className="label">Số điện thoại:</span>
                <span className="value">{order.shippingAddress.phone}</span>
              </div>
            </div>

            {/* Địa chỉ giao hàng */}
            <div className="order-info-card">
              <h3>Địa chỉ giao hàng</h3>
              <div className="address-info">
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.ward}</p>
                <p>{order.shippingAddress.district}</p>
                <p>{order.shippingAddress.city}</p>
              </div>
            </div>

            {/* Trạng thái đơn hàng */}
            <div className="order-info-card">
              <h3>Trạng thái đơn hàng</h3>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="status-select"
              >
                <option value="Chưa xác nhận">Chưa xác nhận</option>
                <option value="Đã xác nhận">Đã xác nhận</option>
                <option value="Đang giao hàng">Đang giao hàng</option>
                <option value="Đã giao hàng">Đã giao hàng</option>
                <option value="Hoàn thành" disabled>
                  Hoàn thành
                </option>
                <option value="Đã hủy">Hủy</option>
              </select>

              {order.status === "Đã hủy" && order.cancelReason && (
                <div className="alert alert-danger mt-3">
                  <strong>Lý do hủy:</strong> {order.cancelReason}
                </div>
              )}

              {showCancelReasonForm && (
                <div className="cancel-reason-form mt-3">
                  <h6 className="fw-semibold">Nhập lý do hủy đơn hàng:</h6>
                  <textarea
                    className="form-control my-2"
                    rows={3}
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="Nhập lý do hủy đơn hàng..."
                  />
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
                      Xác nhận hủy
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        setShowCancelReasonForm(false);
                        setCancelReason("");
                        setPendingStatus(null);
                      }}
                    >
                      Hủy bỏ
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
                  {order.items.map((item, index) => (
                    <tr key={index}>
                      <td className="product-info">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="product-image"
                        />
                        <div className="product-details">
                          <div className="product-name">{item.productName}</div>
                          <div className="variant-info">
                            {item.color} - {item.capacity}
                          </div>
                        </div>
                      </td>
                      <td>{formatPrice(item.price)}</td>
                      <td className="sale-price">
                        {formatPrice(item.salePrice)}
                      </td>
                      <td>{item.quantity}</td>
                      <td className="total-price">
                        {formatPrice(item.salePrice * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Lịch sử hủy đơn */}
          {order.cancelHistory && order.cancelHistory.length > 0 && (
            <div className="cancel-history-section">
              <h3>Lịch sử hủy đơn</h3>
              <div className="cancel-history-list">
                {order.cancelHistory.map((history, index) => (
                  <div key={index} className="cancel-history-item">
                    <div className="cancel-info">
                      <div className="cancel-date">
                        Thời gian: {new Date(history.cancelledAt).toLocaleString()}
                      </div>
                      <div className="cancel-by">
                        Bởi: {history.cancelledBy}
                      </div>
                    </div>
                    {/* <div className="cancel-reason">Lý do: {history.cancelReason}</div> */}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
