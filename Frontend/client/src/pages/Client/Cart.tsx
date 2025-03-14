
import React, { useEffect, useState } from "react";
import { Carts, deleteAllCart, deleteCart, getCart } from "../../services/cart";
import { Link } from "react-router-dom";

const Cart = () => {
  const [carts, setCarts] = useState<Carts[]>(() => []);
  console.log(carts);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [userId, setUserId] = useState<string | null>(null);
  console.log(userId)// Lưu userId vào state

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user && user._id) {
          setUserId(user._id); // Lưu userId vào state
          fetchCart();
        }
      } catch (error) {
        console.error(" Lỗi khi parse user data:", error);
      }
    }
  }, []);

  const fetchCart = async () => {
    try {
      const { data } = await getCart();
      console.log("Dữ liệu giỏ hàng:", data);
      if (data.data && data.data.items) {
        setCarts(data.data.items);
        setTotalAmount(data.data.total || 0);
      } else {
        console.error("Lỗi dữ liệu giỏ hàng: Không có items");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API giỏ hàng:", error);
    }
  };

  const handleRemoveFromCart = async (productId: string) => {
    try {
      if (confirm("xoá sản phẩm này khỏi giỏ hàng")) {
        const { data } = await deleteCart(productId);
        console.log(data);

        // Cập nhật giỏ hàng
        setCarts((prevItems) => {
          const newCart = prevItems.filter((item) => item.productId !== productId);
          // Tính lại tổng tiền
          const newTotal = newCart.reduce((sum, item) => sum + item.subtotal, 0);
          setTotalAmount(newTotal); // Giả sử bạn có state `total`
          return newCart;
        });
      }


    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
    }
  };

  const deleteAll = async (_id: string) => {
    if (confirm("xoa tat ca")) {
      const { data } = await deleteAllCart(_id);
      console.log(data);
      setCarts((prevCarts) => prevCarts.filter((cart) => cart._id !== _id))
    }

  }



  const formatPrice = (price: number) => {
    if (price === undefined || price === null) {
      return "0 VND"; // Return a default value if price is undefined
    }
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " VND";
  };

  return (
    <div>
      {/* Page Header Start */}
      <div className="container-fluid bg-secondary mb-5">

      </div>
      {/* Page Header End */}
      {/* Cart Start */}
      <div className="container-fluid pt-5">
        <div className="row px-xl-5">
          <div className="col-lg-8 table-responsive mb-5">
            <table className="table table-bordered text-center mb-0">
              <thead className="bg-secondary text-dark">
                <tr>
                  <th>Sản phẩm</th>
                  <th>Giá gốc</th>
                  <th>Số lượng</th>
                  <th>Thành giá</th>
                  <th>Hủy</th>
                  <th>Xoa tat ca</th>
                </tr>
              </thead>
              <tbody className="align-middle">
                {carts.map((item, index) => (
                  <tr>

                    <td>
                      <img src={item.image} alt="" width={50} />
                      {item.name}/{item.variants.color}/{item.variants.capacity}
                    </td>
                    <td>{formatPrice(item.variants.price)}</td>
                    <td>{item.quantity}</td>
                    <td>{formatPrice(item.subtotal)}</td>
                    <td>
                      <button onClick={() => handleRemoveFromCart(item.productId)}>delete</button>

                    </td>
                    <td>
                      {index === 0 && (
                        <button onClick={() => deleteAll(item._id)} style={{ marginLeft: "10px", backgroundColor: "red", color: "white" }}>
                          🗑 Delete All
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>


          </div>
          <div className="col-lg-4">
            {/* <form className="mb-5" action="">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control p-4"
                  placeholder="Coupon Code"
                />
                <div className="input-group-append">
                  <button className="btn btn-primary">Apply Coupon</button>
                </div>
              </div>
            </form> */}
            <div className="card border-secondary mb-5">
              <div className="card-header bg-secondary border-0">
                <h4 className="font-weight-semi-bold m-0">Tổng quan</h4>
              </div>
              {/* <div className="card-body">
                <div className="d-flex justify-content-between mb-3 pt-1">
                  <h6 className="font-weight-medium">Subtotal</h6>
                  <h6 className="font-weight-medium">$150</h6>
                </div>
                <div className="d-flex justify-content-between">
                  <h6 className="font-weight-medium">Shipping</h6>
                  <h6 className="font-weight-medium">$10</h6>
                </div>
              </div> */}
              <div className="card-footer border-secondary bg-transparent">
                <div className="d-flex justify-content-between mt-2">
                  <h5 className="font-weight-bold">Tổng</h5>
                  <h5 className="font-weight-bold">
                    {formatPrice(totalAmount)}
                  </h5>
                </div>
                <Link
                  to={`/checkout`}
                  className="btn btn-block btn-primary my-3 py-3"
                >
                  Thanh Toán
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Cart End */}
    </div>
  );
};

export default Cart;
