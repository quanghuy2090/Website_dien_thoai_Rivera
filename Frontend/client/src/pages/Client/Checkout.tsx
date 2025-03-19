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
  const [street, setStreet] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [totalAmount, setTotalAmount] = useState<number>(0);
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
          fetchCart();
          setName(user.userName || "");
          setStreet(user.address || "");
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

  const fetchCart = async () => {
    try {
      const { data } = await getCart();
      if (data.data && data.data.items) {
        setCarts(data.data.items);
        setTotalAmount(data.data.total || 0);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API giỏ hàng:", error);
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
          name: formData.name,
          street: formData.street,
          phone: formData.phone,
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
    return price.toLocaleString("vi-VN") + " VND";
  };

  return (
    <>
      {/* BREADCRUMB */}
      <div id="breadcrumb" className="section">
        {/* container */}
        <div className="container">
          {/* row */}
          <div className="row">
            <div className="col-md-12">
              <ul className="breadcrumb-tree">
                <li>
                  <a href="/">Trang chủ</a>
                </li>
                <li>
                  <a href="/cart">Giỏ hàng</a>
                </li>
                <li className="active">Thanh toán</li>
              </ul>
            </div>
          </div>
          {/* /row */}
        </div>
        {/* /container */}
      </div>
      {/* /BREADCRUMB */}
      <div>
        {/* Page Header End */}
        {/* SECTION */}
        <div className="section">
          {/* container */}
          <div className="container">
            {/* row */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row">
                <div className="col-md-7">
                  {/* Billing Details */}
                  <div className="billing-details">
                    <div className="section-title">
                      <h3 className="title">Thông tin thanh toán</h3>
                    </div>
                    <div className="form-group">
                      <label htmlFor="userName">Tên người dùng</label>
                      <input
                        type="text"
                        className="input"
                        value={name}
                        placeholder="Nhập tên người dùng"
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">Số điện thoại</label>
                      <input
                        type="text"
                        className="input"
                        value={phone}
                        placeholder="Nhập số điện thoại"
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="street">Địa chỉ</label>
                      <input
                        type="text"
                        className="input"
                        value={street}
                        placeholder="Nhập địa chỉ"
                        onChange={(e) => setStreet(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="city">Tỉnh / Thành phố</label>
                      <select className="input" {...register("city")}>
                        <option value="">Chọn tỉnh / thành phố</option>
                        {provinces.map((province) => (
                          <option key={province.code} value={province.name}>
                            {province.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className=" form-group">
                      <label htmlFor="district">Quận / Huyện</label>
                      <select
                        className="input"
                        {...register("district")}
                        disabled={!districts.length}
                      >
                        <option value="">Chọn quận / huyện</option>
                        {districts.map((district) => (
                          <option key={district.code} value={district.name}>
                            {district.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className=" form-group">
                      <label htmlFor="ward">Phường / Xã</label>
                      <select
                        className="input"
                        {...register("ward")}
                        disabled={!wards.length}
                      >
                        <option value="">Chọn phường / xã</option>
                        {wards.map((ward) => (
                          <option key={ward.code} value={ward.name}>
                            {ward.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* <div className="form-group">
                    <div className="input-checkbox">
                      <input type="checkbox" id="create-account" />
                      <label htmlFor="create-account">
                        <span />
                        Create Account?
                      </label>
                      <div className="caption">
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipisicing
                          elit, sed do eiusmod tempor incididunt.
                        </p>
                        <input
                          className="input"
                          type="password"
                          name="password"
                          placeholder="Enter Your Password"
                        />
                      </div>
                    </div>
                  </div> */}
                  </div>
                  {/* /Billing Details */}
                  {/* Shiping Details */}
                  {/* /Shiping Details */}
                  {/* Order notes */}
                  {/* <div className="order-notes">
                  <textarea
                    className="input"
                    placeholder="Order Notes"
                    defaultValue={""}
                  />
                </div> */}
                  {/* /Order notes */}
                </div>
                {/* Order Details */}
                <div className="col-md-5 order-details">
                  <div className="section-title text-center">
                    <h3 className="title">Đơn hàng</h3>
                  </div>
                  <div className="order-summary">
                    <div className="order-col">
                      <div>
                        <strong>Sản phẩm</strong>
                      </div>
                      <div>
                        <strong>Giá</strong>
                      </div>
                    </div>
                    <div className="order-products">
                      {carts.map((item) => (
                        <div className="order-col">
                          <div>
                            {item.quantity}x {item.name}
                            <br />
                            {item.variants.color}/{item.variants.capacity}
                          </div>
                          <div>{formatPrice(item.variants.price)}</div>
                        </div>
                      ))}
                    </div>
                    <div className="order-col">
                      <div>Phí giao hàng</div>
                      <div>
                        <strong>FREE</strong>
                      </div>
                    </div>
                    <div className="order-col">
                      <div>
                        <strong>Tổng</strong>
                      </div>
                      <div>
                        <strong className="order-total">
                          {formatPrice(totalAmount)}
                        </strong>
                      </div>
                    </div>
                  </div>
                  <div className="payment-method">
                    <div className="input-radio">
                      <input
                        type="radio"
                        value="COD"
                        id="payment-cod"
                        {...register("paymentMethod")}
                      />
                      <label htmlFor="payment-cod">
                        <span />
                        Thanh toán khi nhận hàng
                      </label>
                      <div className="caption">
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipisicing
                          elit, sed do eiusmod tempor incididunt ut labore et
                          dolore magna aliqua.
                        </p>
                      </div>
                    </div>
                    <div className="input-radio">
                      <input
                        type="radio"
                        id="payment-credit-card"
                        value="Credit Card"
                        {...register("paymentMethod")}
                      />
                      <label htmlFor="payment-credit-card">
                        <span />
                        Thẻ tín dụng
                      </label>
                      <div className="caption">
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipisicing
                          elit, sed do eiusmod tempor incididunt ut labore et
                          dolore magna aliqua.
                        </p>
                      </div>
                    </div>
                    <div className="input-radio">
                      <input
                        type="radio"
                        id="payment-bank-transfer"
                        value="Bank Transfer"
                        {...register("paymentMethod")}
                      />
                      <label htmlFor="payment-bank-transfer">
                        <span />
                        Chuyển khoản ngân hàng
                      </label>
                      <div className="caption">
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipisicing
                          elit, sed do eiusmod tempor incididunt ut labore et
                          dolore magna aliqua.
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* <div className="input-checkbox">
                  <input type="checkbox" id="terms" />
                  <label htmlFor="terms">
                    <span />
                    I've read and accept the{" "}
                    <a href="#">terms &amp; conditions</a>
                  </label>
                </div> */}
                  <button type="submit" className="primary-btn order-submit">
                    Place order
                  </button>
                </div>
                {/* /Order Details */}
              </div>
            </form>
            {/* /row */}
          </div>
          {/* /container */}
        </div>
      </div>
    </>
  );
};

export default Checkout;
