import { useEffect, useState } from "react";
import { getOrderById } from "../../../services/order";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useShipperOrderPolling } from "../../../hooks/useShipperOrderPolling"; // Thay vì useAdminOrderPolling
import "./OrderDetail.css";

const ShipperOrderDetail = () => {
  const { id } = useParams();
  const { orders } = useShipperOrderPolling(); // Hook dành cho shipper
  const [order, setOrder] = useState(
    orders.find((o) => o.orderId === id) || null
  );
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    if (!id) return;

    const fetchOrderDetail = async () => {
      try {
        const { data } = await getOrderById(id); // API lấy chi tiết đơn hàng của shipper
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
              <span className="value">{order.status}</span>
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
        </div>
      </div>
    </div>
  );
};

export default ShipperOrderDetail;
