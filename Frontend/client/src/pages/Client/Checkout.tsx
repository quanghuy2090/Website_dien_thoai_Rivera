import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { CartItem, getCart } from "../../services/cart";
import {
  createOrder,
  createOrderOnline, // Import hàm mới
  District,
  IShippingAddress,
  Order,
  Province,
  Ward,
} from "../../services/order";

const Checkout = () => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<  // Thêm errors
    IShippingAddress & { paymentMethod: Order["paymentMethod"] }
  >({
    mode: "onBlur", // Thêm cái mode để validation
  });
  const [carts, setCarts] = useState<CartItem[]>([]);
  // const [totalPrice, setTotalPrice] = useState<number>(0); // Không dùng nữa
  const [userId, setUsetId] = useState<string | null>(null);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0); // Dùng cái này
  const nav = useNavigate();

  // Lấy thông tin tỉnh/thành phố (giữ nguyên)
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const { data } = await axios.get(
          "https://provinces.open-api.vn/api/?depth=3"
        );
        setProvinces(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProvinces();

    // Lấy thông tin user, giỏ hàng
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user && user._id) {
          setUsetId(user._id);
          fetchCart();
          // Set giá trị mặc định cho form (từ user)
          setValue("name", user.userName || "");
          setValue("street", user.address || ""); // Sửa thành street
          setValue("phone", user.phone || "");
        }
      } catch (error) {
        console.log(error);
      }
    }

  }, []);


  const selectedProvince = watch("city");
  const selectedDistrict = watch("district");

  useEffect(() => {
    if (selectedProvince) {
      const province = provinces.find((p) => p.name === selectedProvince);
      setDistricts(province ? province.districts : []);
      setWards([]);
      setValue("district", "");
      setValue("ward", "");
    }
  }, [selectedProvince, provinces, setValue]);

  useEffect(() => {
    if (selectedDistrict) {
      const district = districts.find((d) => d.name === selectedDistrict);
      setWards(district ? district.wards : []);
      setValue("ward", "");
    }
  }, [selectedDistrict, districts, setValue]);

  const fetchCart = async () => {
    try {
      const { data } = await getCart();
      if (data.cart && data.cart.items) {
        setCarts(data.cart.items);
        setTotalAmount(data.cart.totalSalePrice || 0);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API giỏ hàng:", error);
    }
  };

  const onSubmit = async (
    formData: IShippingAddress & { paymentMethod: Order["paymentMethod"] }
  ) => {
    if (!userId) {
      toast.error("Vui lòng đăng nhập để đặt hàng!"); // Dùng toast
      return;
    }

    try {
      const newOrder: Omit<Order, "_id" | "createdAt" | "updatedAt" | "paymentStatus" | "status" | "totalAmount" | "items"> & { orderItems: CartItem[] } = {
        userId: userId,
        orderItems: carts,  // Dùng carts trực tiếp
        shippingAddress: {
          name: formData.name,
          street: formData.street,
          phone: formData.phone,
          ward: formData.ward,
          district: formData.district,
          city: formData.city,
        },
        paymentMethod: formData.paymentMethod,
      };

      if (formData.paymentMethod === "Online") {
        // Gọi API tạo đơn hàng online
        const { data } = await createOrderOnline(newOrder);
        // Chuyển hướng đến URL thanh toán VNPay
        window.location.href = data.paymentUrl;

      } else {
        // Xử lý cho COD (hoặc các phương thức khác nếu có)
        const { data } = await createOrder(newOrder);
        console.log(data)
        toast.success("Checkout successfully");
        nav("/bill"); // Chuyển hướng đến trang hóa đơn
        setCarts([]);
        setTotalAmount(0);
      }

    } catch (error) {
      console.log(error);
      // toast.error(
      //   // error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!"
      // );
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
                      <label htmlFor="name">Tên người dùng</label>
                      <input
                        type="text"
                        className={`input ${errors.name ? 'is-invalid' : ''}`}
                        placeholder="Nhập tên người dùng"
                        {...register("name", { required: "Vui lòng nhập tên" })}
                      />
                      {errors.name && <p className="invalid-feedback">{errors.name.message}</p>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">Số điện thoại</label>
                      <input
                        type="text"
                        className={`input ${errors.phone ? 'is-invalid' : ''}`}
                        placeholder="Nhập số điện thoại"
                        {...register("phone", {
                          required: "Vui lòng nhập số điện thoại",
                          pattern: {
                            value: /^[0-9]{10}$/, // VD: Yêu cầu 10 chữ số
                            message: "Số điện thoại không hợp lệ",
                          },
                        })}
                      />
                      {errors.phone && <p className="invalid-feedback">{errors.phone.message}</p>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="street">Địa chỉ</label>
                      <input
                        type="text"
                        className={`input ${errors.street ? 'is-invalid' : ''}`}
                        placeholder="Nhập địa chỉ"
                        {...register("street", { required: "Vui lòng nhập địa chỉ" })}
                      />
                      {errors.street && <p className="invalid-feedback">{errors.street.message}</p>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="city">Tỉnh / Thành phố</label>
                      <select className={`input ${errors.city ? 'is-invalid' : ''}`} {...register("city", { required: "Vui lòng chọn tỉnh/thành phố" })}>
                        <option value="">Chọn tỉnh / thành phố</option>
                        {provinces.map((province) => (
                          <option key={province.code} value={province.name}>
                            {province.name}
                          </option>
                        ))}
                      </select>
                      {errors.city && <p className="invalid-feedback">{errors.city.message}</p>}
                    </div>

                    <div className=" form-group">
                      <label htmlFor="district">Quận / Huyện</label>
                      <select
                        className={`input ${errors.district ? 'is-invalid' : ''}`}
                        {...register("district", { required: "Vui lòng chọn quận/huyện" })}
                        disabled={!districts.length}
                      >
                        <option value="">Chọn quận / huyện</option>
                        {districts.map((district) => (
                          <option key={district.code} value={district.name}>
                            {district.name}
                          </option>
                        ))}
                      </select>
                      {errors.district && <p className="invalid-feedback">{errors.district.message}</p>}
                    </div>

                    <div className=" form-group">
                      <label htmlFor="ward">Phường / Xã</label>
                      <select
                        className={`input ${errors.ward ? 'is-invalid' : ''}`}
                        {...register("ward", { required: "Vui lòng chọn phường/xã" })}
                        disabled={!wards.length}
                      >
                        <option value="">Chọn phường / xã</option>
                        {wards.map((ward) => (
                          <option key={ward.code} value={ward.name}>
                            {ward.name}
                          </option>
                        ))}
                      </select>
                      {errors.ward && <p className="invalid-feedback">{errors.ward.message}</p>}
                    </div>
                  </div>
                </div>
                {/* /Billing Details */}
                {/* Order Details */}
                <div className="col-md-5 order-details">
                  <div className="section-title text-center">
                    <h3 className="title">Đơn hàng</h3>
                  </div>
                  <div className="order-summary">
                    <div className="order-col">


                    </div>
                    <div className="order-products">
                      {carts.map((cart) => (
                        <div key={`${cart.productId._id}-${cart.variantId}`}>
                          <tr>
                            <div>
                              <strong>Sản phẩm</strong>
                              <td>{cart.productId.name}-{cart.color}-{cart.capacity}</td>
                            </div>
                            <div>
                              <strong>Giá</strong>
                              <td className="text-center">{formatPrice(cart.salePrice)}</td>
                            </div>
                          </tr>
                        </div>
                      ))}

                    </div>
                    <div className="order-col">
                      <div>Phí giao hàng</div>
                      <div>
                        {/* <strong>FREE</strong> */}
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
                        {...register("paymentMethod", { required: "Vui lòng chọn phương thức thanh toán" })}
                      />
                      <label htmlFor="payment-cod">
                        <span />
                        Thanh toán khi nhận hàng
                      </label>
                      <div className="caption">
                        <p>
                          Thanh toán khi nhận hàng
                        </p>
                      </div>
                    </div>

                    <div className="input-radio">
                      <input
                        type="radio"
                        id="payment-online"
                        value="Online"
                        {...register("paymentMethod", { required: "Vui lòng chọn phương thức thanh toán" })}
                      />
                      <label htmlFor="payment-online">
                        <span />
                        Thanh Toán VNPay
                      </label>
                      {errors.paymentMethod && <p className="text-danger" >{errors.paymentMethod.message}</p>}
                    </div>
                  </div>

                  <button type="submit" className="primary-btn order-submit">
                    Đặt hàng
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