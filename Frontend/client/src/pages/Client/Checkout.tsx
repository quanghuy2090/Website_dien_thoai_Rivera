import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Carts, getCart } from "../../services/cart";
import {
  createOrder,
  District,
  IShippingAddress,
  Order,
  Province,
  Ward,
} from "../../services/order";

const Checkout = () => {
  const { register, handleSubmit, setValue, watch } = useForm<
    IShippingAddress & { paymentMethod: Order["paymentMethod"] }
  >({});
  const [carts, setCarts] = useState<Carts[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [userId, setUsetId] = useState<string | null>(null);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [userName, setUserName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const nav = useNavigate();
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const { data } = await axios.get(
          "https://provinces.open-api.vn/api/?depth=3"
        );
        console.log(data);
        setProvinces(data);
      } catch (error) {
        console.log(error);
      }
    };
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user && user._id) {
          setUsetId(user._id);
          fetchCart(user._id);
          setEmail(user.email || "");
          setUserName(user.userName || "");
          setAddress(user.address || "");
          setPhone(user.phone || "");
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchProvinces();
  }, []);

  const selectedProvince = watch("city");
  const selectedDistrict = watch("district");

  // Khi chọn tỉnh/thành phố, cập nhật danh sách quận/huyện
  useEffect(() => {
    if (selectedProvince) {
      const province = provinces.find((p) => p.name === selectedProvince);
      setDistricts(province ? province.districts : []);
      setWards([]); // Reset danh sách phường/xã khi chọn tỉnh mới
      setValue("district", ""); // Reset giá trị quận/huyện
      setValue("ward", ""); // Reset giá trị phường/xã
    }
  }, [selectedProvince, provinces, setValue]);

  // Khi chọn quận/huyện, cập nhật danh sách phường/xã
  useEffect(() => {
    if (selectedDistrict) {
      const district = districts.find((d) => d.name === selectedDistrict);
      setWards(district ? district.wards : []);
      setValue("ward", ""); // Reset giá trị phường/xã
    }
  }, [selectedDistrict, districts, setValue]);

  const fetchCart = async (userId: string) => {
    try {
      const { data } = await getCart(userId);
      if (data?.cart?.items) {
        setCarts(data.cart.items);
        const total = data.cart.items.reduce(
          (sum: number, item: Carts) =>
            sum + item.productId.price * item.quantity,
          0
        );
        setTotalPrice(total);
      } else {
        setCarts([]);
        setTotalPrice(0);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (
    formData: IShippingAddress & { paymentMethod: Order["paymentMethod"] }
  ) => {
    if (!userId) {
      alert("Vui lòng đăng nhập để đặt hàng!");
      return;
    }
    try {
      const newOrder: Omit<Order, "_id" | "createdAt" | "updatedAt"> = {
        userId,
        orderItems: carts,
        shippingAddress: {
          // fullName: formData.fullName,
          // phone: formData.phone,
          // address: formData.address,
          ward: formData.ward,
          district: formData.district,
          city: formData.city,
        },
        paymentMethod: formData.paymentMethod,
        paymentStatus: "Chưa thanh toán",
        totalPrice,
        orderStatus: "Chưa xác nhận",
      };
      const { data } = await createOrder(newOrder);

      toast.success("Checkout successfully");
      nav("/bill");
      console.log(data);
      setCarts([]);
      setTotalPrice(0);
    } catch (error) {
      console.log(error);
      toast.error("Error creating");
    }
  };
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
        <div
          className="d-flex flex-column align-items-center justify-content-center"
          style={{ minHeight: 150 }}
        >
          <h1 className="font-weight-semi-bold text-uppercase mb-3">
            Checkout
          </h1>
          <div className="d-inline-flex">
            <p className="m-0">
              <a href="/">Home</a>
            </p>
            <p className="m-0 px-2">-</p>
            <p className="m-0">Checkout</p>
          </div>
        </div>
      </div>
      {/* Page Header End */}
      {/* Checkout Start */}
      <div className="container">
  <div className="row justify-content-center">
    <div className="col-lg-10">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h5 className="text-center text-dark fw-bold mb-4 fs-3">Billing Address</h5><br />

        <div className="row justify-content-center">
          {/* Cột bên trái: Thông tin khách hàng */}
          <div className="col-lg-7">
          
            <div className="card p-4 shadow-sm mx-auto" style={{ maxWidth: "500px" }}>
            <div className="card-header bg-primary text-white text-center rounded-top py-2">
                <h5 className="fw-bold m-0 fs-6" >Thông tin thanh toán</h5>
              </div>

              <div className="card-body">
                <div className="mb-3 d-flex align-items-center">
                  <label className="form-label fw-bold me-3 text-dark text-nowrap" style={{ width: "150px" }}>
                    Người dùng
                  </label>
                  <input type="text" className="form-control text-dark" value={userName} disabled />
                </div>

                <div className="mb-3 d-flex align-items-center">
                  <label className="form-label fw-bold me-3 text-dark text-nowrap" style={{ width: "150px" }}>
                    Email
                  </label>
                  <input type="text" className="form-control text-dark" value={email} disabled />
                </div>

                <div className="mb-3 d-flex align-items-center">
                  <label className="form-label fw-bold me-3 text-dark text-nowrap" style={{ width: "150px" }}>
                    Số điện thoại
                  </label>
                  <input type="text" className="form-control text-dark" value={phone} disabled />
                </div>

                <div className="mb-3 d-flex align-items-center">
                  <label className="form-label fw-bold me-3 text-dark text-nowrap" style={{ width: "150px" }}>
                    Địa chỉ
                  </label>
                  <input type="text" className="form-control text-dark" value={address} disabled />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold text-dark">Tỉnh / Thành phố</label>
                  <select className="form-select text-dark" {...register("city")}>
                    <option value="">Chọn tỉnh / thành phố</option>
                    {provinces.map((province) => (
                      <option key={province.code} value={province.name}>
                        {province.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold text-dark">Quận / Huyện</label>
                  <select className="form-select text-dark" {...register("district")} disabled={!districts.length}>
                    <option value="">Chọn quận / huyện</option>
                    {districts.map((district) => (
                      <option key={district.code} value={district.name}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold text-dark">Phường / Xã</label>
                  <select className="form-select text-dark" {...register("ward")} disabled={!wards.length}>
                    <option value="">Chọn phường / xã</option>
                    {wards.map((ward) => (
                      <option key={ward.code} value={ward.name}>
                        {ward.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Cột bên phải: Thông tin thanh toán */}
          <div className="col-lg-5">
            <div className="card shadow-sm mx-auto mb-4" style={{ maxWidth: "520px" }}>
              <div className="card-header bg-primary text-white text-center rounded-top py-2">
                <h5 className="fw-bold m-0 fs-6">Thanh toán</h5>
              </div>

              <div className="card-body p-3">
                <table className="table table-borderless text-center align-middle mb-0">
                  <thead className="border-bottom">
                    <tr>
                      <th className="fw-semibold w-50 fs-7">Sản phẩm</th>
                      <th className="fw-semibold w-25 fs-7">Số lượng</th>
                      <th className="fw-semibold w-25 fs-7">Giá bán</th>
                    </tr>
                  </thead>
                  <tbody>
                    {carts.map((item, index) => (
                      <tr key={index} className="border-bottom">
                        <td className="text-start fs-7">{item.productId.name}</td>
                        <td className="fs-7">{item.quantity}</td>
                        <td className="text-end fs-7">{formatPrice(item.productId.price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="card-footer bg-transparent rounded-bottom py-2">
                <div className="d-flex justify-content-between">
                  <h6 className="fw-bold text-dark m-0">Tổng</h6>
                  <h6 className="fw-bold text-dark m-0">{formatPrice(totalPrice)}</h6>
                </div>
              </div>
            </div>
<br />
            {/* Phương thức thanh toán */}
            <div className="card shadow-sm mx-auto">
  <div className="card-header bg-primary text-white text-center rounded-top py-2">
    <h5 className="fw-bold m-0 fs-6">Phương thức thanh toán</h5>
  </div>

  <div className="card-body">
    <div className="form-group">
      <div className="form-check mb-3"> {/* Tăng khoảng cách */}
        <input type="radio" className="form-check-input" id="payment-cod" value="COD" {...register("paymentMethod")} />
        <label htmlFor="payment-cod" className="form-check-label text-dark fs-6">Thanh toán khi nhận hàng</label>
      </div>

      <div className="form-check mb-3"> {/* Tăng khoảng cách */}
        <input type="radio" className="form-check-input" id="payment-credit-card" value="Credit Card" {...register("paymentMethod")} />
        <label htmlFor="payment-credit-card" className="form-check-label text-dark fs-6">Thẻ tín dụng</label>
      </div>

      <div className="form-check mb-3"> {/* Tăng khoảng cách */}
        <input type="radio" className="form-check-input" id="payment-bank-transfer" value="Bank Transfer" {...register("paymentMethod")} />
        <label htmlFor="payment-bank-transfer" className="form-check-label text-dark fs-6">Chuyển khoản ngân hàng</label>
      </div>
    </div>
  </div>

  <div className="card-footer bg-transparent text-center p-3">
    <button type="submit" className="btn btn-primary fw-bold px-4 py-2 fs-6" style={{ width: "200px" }}>
      Đặt hàng
    </button>
  </div>
</div>

          </div>
        </div>
      </form>
    </div>
  </div>
</div>

      {/* Checkout End */}
    </div>
  );
};

export default Checkout;
