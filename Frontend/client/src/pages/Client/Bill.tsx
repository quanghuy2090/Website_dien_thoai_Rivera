import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDetailOrder, Order } from "../../services/order";
import toast from "react-hot-toast";
import "../../css/Bill.css";

const Bill = () => {
  const { id } = useParams();
  const [orderDetail, setOrderDetail] = useState<Order | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchOrderDetail = async (id: string) => {
      try {
        const { data } = await getDetailOrder(id);
        setOrderDetail(data.order);
      } catch (error) {
        toast.error("Không thể tải chi tiết đơn hàng.");
        console.error(error);
      }
    };
    fetchOrderDetail(id);
  }, [id]);

  const formatPrice = (price: number) => {
    if (price === undefined || price === null) {
      return "0 VND";
    }
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Đã huỷ":
        return "status-cancelled";
      case "Hoàn thành":
        return "status-completed";
      case "Đang giao hàng":
        return "status-shipping";
      case "Đã xác nhận":
        return "status-confirmed";
      default:
        return "status-pending";
    }
  };

  return (
    <>
      <div id="breadcrumb" className="section">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <ul className="breadcrumb-tree">
                <li>
                  <a href="/">Trang chủ</a>
                </li>
                <li>
                  <a href="/profile">Tài khoản</a>
                </li>
                <li>
                  <a href="/history">Lịch sử đơn hàng</a>
                </li>
                <li className="active">Chi tiết đơn hàng</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="container">
          <div className="bill-container">
            <div className="bill-header">
              <div className="bill-logo">
                {/* <img src="../../image/logo1.png" alt="Rivera Store" /> */}
                <h1>RIVERA</h1>
              </div>
              <div className="bill-info">
                <h2>CHI TIẾT ĐƠN HÀNG</h2>
                <p className="order-id">
                  Mã đơn hàng: <strong>#{orderDetail?.orderId}</strong>
                </p>
                <p className="order-date">
                  Ngày đặt:{" "}
                  <strong>
                    {orderDetail?.createdAt
                      ? new Date(orderDetail.createdAt).toLocaleDateString()
                      : "N/A"}
                  </strong>
                </p>
                <div
                  className={`order-status ${getStatusColor(
                    orderDetail?.status || ""
                  )}`}
                >
                  {orderDetail?.status}
                </div>
              </div>
            </div>

            <div className="bill-body">
              <div className="info-grid">
                <div className="info-section">
                  <h3>
                    <i className="fa fa-user"></i> Thông tin khách hàng
                  </h3>
                  <div className="info-content">
                    <p>
                      <strong>Họ tên:</strong> {orderDetail?.userName}
                    </p>
                    <p>
                      <strong>Email:</strong> {orderDetail?.userEmail}
                    </p>
                    <p>
                      <strong>Số điện thoại:</strong> {orderDetail?.userPhone}
                    </p>
                  </div>
                </div>

                <div className="info-section">
                  <h3>
                    <i className="fa fa-truck"></i> Địa chỉ giao hàng
                  </h3>
                  <div className="info-content">
                    <p>{orderDetail?.shippingAddress.street}</p>
                    <p>{orderDetail?.shippingAddress.ward}</p>
                    <p>{orderDetail?.shippingAddress.district}</p>
                    <p>{orderDetail?.shippingAddress.city}</p>
                  </div>
                </div>

                <div className="info-section">
                  <h3>
                    <i className="fa fa-credit-card"></i> Thông tin thanh toán
                  </h3>
                  <div className="info-content">
                    <p>
                      <strong>Phương thức:</strong> {orderDetail?.paymentMethod}
                    </p>
                    <p>
                      <strong>Trạng thái:</strong> {orderDetail?.paymentStatus}
                    </p>
                  </div>
                </div>
              </div>

              <div className="products-section">
                <h3>
                  <i className="fa fa-shopping-cart"></i> Sản phẩm đã mua
                </h3>
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
                                  {variant?.color?.name} -{" "}
                                  {variant?.capacity?.value}
                                </div>
                              </div>
                            </td>
                            <td className="price">
                              {formatPrice(product.price)}
                            </td>
                            <td className="sale-price">
                              {formatPrice(product.salePrice)}
                            </td>
                            <td className="quantity">{product.quantity}</td>
                            <td className="total-price">
                              {formatPrice(
                                product.salePrice * product.quantity
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bill-summary">
                <div className="summary-row">
                  <span>Tổng tiền hàng:</span>
                  <span>{formatPrice(orderDetail?.totalAmount ?? 0)}</span>
                </div>
                {/* <div className="summary-row">
                  <span>Phí vận chuyển:</span>
                  <span>0 VND</span>
                </div> */}
                <div className="summary-row total">
                  <span>Tổng thanh toán:</span>
                  <span>{formatPrice(orderDetail?.totalAmount ?? 0)}</span>
                </div>
              </div>
            </div>

            <div className="bill-footer">
              <div className="support-info">
                <p>
                  <i className="fa fa-phone"></i> Hotline hỗ trợ: +8494 5533 843
                </p>
                <p>
                  <i className="fa fa-envelope"></i> Email: email@email.com
                </p>
              </div>
              <div className="thank-you">
                <p>Cảm ơn bạn đã mua hàng tại cửa hàng RIVERA!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Bill;
