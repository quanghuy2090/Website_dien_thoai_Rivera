import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { CartItem, getCart } from "../../services/cart";
import {
  createOrderCOD,
  createOrderOnline,
  District,
  IShippingAddress,
  Order,
  Province,
  Ward,
} from "../../services/order";
import { CartContext } from "../../context/CartContext";
import { useCartPolling } from "../../hooks/useCartPolling";

const Checkout = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IShippingAddress & { paymentMethod: Order["paymentMethod"] }>({
    mode: "onBlur",
  });

  const [carts, setCarts] = useState<CartItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const { clearCart, getCarts } = useContext(CartContext);
  const { hasBannedProduct } = useCartPolling();
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch(
          "https://provinces.open-api.vn/api/?depth=3"
        );
        const data = await response.json();
        console.log("Provinces data:", data);
        if (data && Array.isArray(data)) {
          setProvinces(data);
        } else {
          console.error("Invalid provinces data structure:", data);
          toast.error("Không thể lấy danh sách tỉnh thành");
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách tỉnh thành:", error);
        toast.error("Không thể lấy danh sách tỉnh thành");
      }
    };

    const fetchUserAndCart = async () => {
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          const user = JSON.parse(userData);
          if (user && user._id) {
            setUserId(user._id);
            setValue("userName", user.userName || "");
            setValue("street", user.address || "");
            setValue("phone", user.phone || "");
            await fetchCart();
          }
        } catch (error) {
          console.error("Lỗi khi lấy thông tin người dùng:", error);
        }
      }
    };

    fetchProvinces();
    fetchUserAndCart();
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
      console.log("Cart data from API:", data);
      if (data.cart && data.cart.items) {
        console.log("Cart items:", data.cart.items);
        setCarts(data.cart.items);
        setTotalAmount(data.cart.totalSalePrice || 0);
      } else {
        console.log("No cart items found");
        setCarts([]);
        setTotalAmount(0);
      }
    } catch (error) {
      console.error("Lỗi khi lấy giỏ hàng:", error);
      toast.error("Không thể lấy thông tin giỏ hàng");
      setCarts([]);
      setTotalAmount(0);
    }
  };

  const onSubmit = async (
    formData: IShippingAddress & { paymentMethod: Order["paymentMethod"] }
  ) => {
    if (!userId) {
      toast.error("Vui lòng đăng nhập để đặt hàng!");
      return;
    }

    if (carts.length === 0) {
      toast.error("Giỏ hàng trống!");
      return;
    }

    setLoading(true);
    try {
      const shippingAddress: IShippingAddress = {
        userName: formData.userName,
        phone: formData.phone,
        street: formData.street,
        ward: formData.ward,
        district: formData.district,
        city: formData.city,
      };

      if (formData.paymentMethod === "Online") {
        const { data } = await createOrderOnline(shippingAddress);
        if (data.paymentUrl) {
          window.location.href = data.paymentUrl;
        } else {
          throw new Error("Không thể tạo URL thanh toán");
        }
      } else {
        const { data } = await createOrderCOD(shippingAddress);
        if (data.order) {
          await clearCart();
          await getCarts();
          toast.success("Đặt hàng thành công!");
          nav("/history");
        }
      }
    } catch (error: any) {
      console.error("Lỗi khi đặt hàng:", error);
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi đặt hàng"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + " VND";
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
                  <a href="/cart">Giỏ hàng</a>
                </li>
                <li className="active">Thanh toán</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="container">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
              <div className="col-md-7">
                <div className="billing-details">
                  <div className="section-title">
                    <h3 className="title">Thông tin thanh toán</h3>
                  </div>
                  <div className="form-group">
                    <label htmlFor="userName">Tên người nhận</label>
                    <input
                      type="text"
                      className={`input ${errors.userName ? "is-invalid" : ""}`}
                      placeholder="Nhập tên người nhận"
                      {...register("userName", {
                        required: "Vui lòng nhập tên",
                      })}
                    />
                    {errors.userName && (
                      <p className="invalid-feedback">
                        {errors.userName.message}
                      </p>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Số điện thoại</label>
                    <input
                      type="text"
                      className={`input ${errors.phone ? "is-invalid" : ""}`}
                      placeholder="Nhập số điện thoại"
                      {...register("phone", {
                        required: "Vui lòng nhập số điện thoại",
                        pattern: {
                          value: /^[0-9]{10}$/,
                          message: "Số điện thoại không hợp lệ",
                        },
                      })}
                    />
                    {errors.phone && (
                      <p className="invalid-feedback">{errors.phone.message}</p>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="street">Địa chỉ</label>
                    <input
                      type="text"
                      className={`input ${errors.street ? "is-invalid" : ""}`}
                      placeholder="Nhập địa chỉ"
                      {...register("street", {
                        required: "Vui lòng nhập địa chỉ",
                      })}
                    />
                    {errors.street && (
                      <p className="invalid-feedback">
                        {errors.street.message}
                      </p>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="city">Tỉnh / Thành phố</label>
                    <select
                      className={`input ${errors.city ? "is-invalid" : ""}`}
                      {...register("city", {
                        required: "Vui lòng chọn tỉnh/thành phố",
                      })}
                    >
                      <option value="">Chọn tỉnh / thành phố</option>
                      {Array.isArray(provinces) &&
                        provinces.map((province) => (
                          <option key={province?.code} value={province?.name}>
                            {province?.name}
                          </option>
                        ))}
                    </select>
                    {errors.city && (
                      <p className="invalid-feedback">{errors.city.message}</p>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="district">Quận / Huyện</label>
                    <select
                      className={`input ${errors.district ? "is-invalid" : ""}`}
                      {...register("district", {
                        required: "Vui lòng chọn quận/huyện",
                      })}
                      disabled={!districts.length}
                    >
                      <option value="">Chọn quận / huyện</option>
                      {Array.isArray(districts) &&
                        districts.map((district) => (
                          <option key={district?.code} value={district?.name}>
                            {district?.name}
                          </option>
                        ))}
                    </select>
                    {errors.district && (
                      <p className="invalid-feedback">
                        {errors.district.message}
                      </p>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="ward">Phường / Xã</label>
                    <select
                      className={`input ${errors.ward ? "is-invalid" : ""}`}
                      {...register("ward", {
                        required: "Vui lòng chọn phường/xã",
                      })}
                      disabled={!wards.length}
                    >
                      <option value="">Chọn phường / xã</option>
                      {Array.isArray(wards) &&
                        wards.map((ward) => (
                          <option key={ward?.code} value={ward?.name}>
                            {ward?.name}
                          </option>
                        ))}
                    </select>
                    {errors.ward && (
                      <p className="invalid-feedback">{errors.ward.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-md-5 order-details">
                <div className="section-title text-center">
                  <h3 className="title">Đơn hàng</h3>
                </div>
                <div className="order-summary">
                  <div className="order-products">
                    {Array.isArray(carts) && carts.length > 0 ? (
                      carts.map((cart) => {
                        console.log("Rendering cart item:", cart);
                        return (
                          <div
                            className="checkout-product"
                            key={`${cart?.productId?._id || ""}-${cart?.variantId || ""
                              }`}
                          >
                            <div className="product-info">
                              <div className="product-name">
                                {cart?.quantity || 0} x{" "}
                                {cart?.productId?.name || "Sản phẩm"}
                              </div>
                              <div className="product-variant">
                                {cart?.color || ""} - {cart?.capacity || ""}
                              </div>
                              <div className="product-price">
                                {formatPrice(cart?.salePrice || 0)}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="empty-cart">Giỏ hàng trống</div>
                    )}
                  </div>
                  <div className="order-col">
                    <div>
                      <strong>Tổng tiền</strong>
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
                      {...register("paymentMethod", {
                        required: "Vui lòng chọn phương thức thanh toán",
                      })}
                    />
                    <label htmlFor="payment-cod">
                      <span />
                      Thanh toán khi nhận hàng
                    </label>
                  </div>

                  <div className="input-radio">
                    <input
                      type="radio"
                      id="payment-online"
                      value="Online"
                      {...register("paymentMethod", {
                        required: "Vui lòng chọn phương thức thanh toán",
                      })}
                    />
                    <label htmlFor="payment-online">
                      <span />
                      Thanh Toán VNPay
                    </label>
                  </div>
                  {errors.paymentMethod && (
                    <p className="text-danger">
                      {errors.paymentMethod.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || hasBannedProduct}
                  className={`primary-btn order-submit ${hasBannedProduct ? "disabled" : ""}`}
                >
                  Đặt hàng
                </button>
                {hasBannedProduct && (
                  <p className="text-danger mt-2">
                    Có sản phẩm bị chặn trong giỏ. Vui lòng xoá để tiếp tục thanh toán.
                  </p>
                )}

              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Checkout;
