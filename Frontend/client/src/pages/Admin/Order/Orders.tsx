import { useEffect, useState } from "react";
import { getAllOrder, Order } from "../../../services/order";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";

const Orders = () => {
  const [order, setOrder] = useState<Order[]>([]);
  console.log(order);
  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    const { data } = await getAllOrder();
    setOrder(data.orders);
  };

  // const formatPrice = (price: number) => {
  //   if (price === undefined || price === null) {
  //     return "0 VND"; // Return a default value if price is undefined
  //   }
  //   return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND";
  // };
  return (
    <div className="content">
      <div className="card mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="card-title mb-0">Danh sách đơn hàng</h5>
            <span className="text-primary">Bảng / Đơn hàng</span>
          </div>

          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col">Stt</th>
                <th scope="col">Ten kh</th>
                <th scope="col">Email</th>
                <th scope="col">Ngày đặt</th>
                <th scope="col">Trạng thái đơn hàng</th>
                <th scope="col">Phương thức thanh toán</th>
                <th scope="col">Trạng thái thanh toán</th>
                <th scope="col">Tùy chọn</th>
              </tr>
            </thead>
            <tbody>
              {order.map((order, index) => (
                <tr key={index}>
                  <th>{index + 1}</th>
                  {/* <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th> Sản phẩm</th>
                      <th>Số lượng</th>
                      <th>Giá gốc</th>
                      <th>Giá sale</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, index) => {
                      const product = item.productId;
                      const variants = product.variants.find(
                        (v) => v._id === item.variantId
                      ); // Tìm đúng variant theo `variantId`
                      return (
                        <tr key={index}>
                          <td>
                            <img src={product.images[0]} alt="" width={50} />
                            {product.name}_{variants?.color?.name}_
                            {variants?.capacity?.value}
                          </td>
                          <td>{item.quantity}</td>
                          <td>{formatPrice(item.price)} VND</td>
                          <td className="text-warning fw-bold">
                            {formatPrice(item.salePrice)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table> */}
                  <td>{order.userName}</td>
                  <td>{order.userEmail}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>{order.status}</td>
                  <td>{order.paymentMethod}</td>
                  <td>{order.paymentStatus}</td>
                  <td>
                    <Link
                      to={`/admin/order/${order.orderId}`}
                      className="btn btn-info"
                    >
                      <FaEye />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>


  );
};

export default Orders;
