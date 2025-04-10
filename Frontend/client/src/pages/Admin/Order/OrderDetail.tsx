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
      const response = await updateStatusAdmin(id, newStatus, "");
      toast.success(response.data.message || "Cập nhật trạng thái thành công!");

      // Cập nhật toàn bộ đơn hàng từ dữ liệu BE trả về
      setOrderDetail(response.data.order);
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
    <div className="content">
      <h1 className="h3 mb-4 fw-bold text-primary d-flex align-items-center">
        <i className="fas fa-cart-plus me-2"></i> Chi Tiết Đơn Hàng
      </h1>
      <p className="mb-4 text-secondary">
        Đây là thông tin chi tiết của đơn hàng "
        <strong>{orderDetail?.orderId}</strong>". Bạn có thể kiểm tra trạng thái
        hoặc cập nhật trực tiếp.
      </p>

      <div className="table-container">
        <div className="order-info-grid">
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
              <span className="value">{orderDetail?.shippingAddress.phone}</span>
            </div>
          </div>

          <div className="order-info-card">
            <h3>Địa chỉ giao hàng</h3>
            <div className="address-info">
              <p>{orderDetail?.shippingAddress.street}</p>
              <p>{orderDetail?.shippingAddress.ward}</p>
              <p>{orderDetail?.shippingAddress.district}</p>
              <p>{orderDetail?.shippingAddress.city}</p>
            </div>
          </div>

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
              <option value="Đã huỷ" disabled>
                Đã huỷ
              </option>
            </select>
          </div>
        </div>

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
  );
};

export default OrderDetail;
