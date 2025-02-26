import { useEffect, useState } from "react";
import { Carts, getCart } from "../services/cart";
import { useForm } from "react-hook-form";
import {
    createOrder,
    District,
    IShippingAddress,
    Order,
    Province,
    Ward,
} from "../services/order";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

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
                    fullName: formData.fullName,
                    phone: formData.phone,
                    address: formData.address,
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
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND";
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
            <div className="container-fluid pt-5">
                <div className="row px-xl-5">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="row">
                            <div className="col-lg-8">
                                <div className="mb-4">
                                    <h4 className="font-weight-semi-bold mb-4">
                                        Billing Address
                                    </h4>
                                    <div className="row">
                                        <div>
                                            <div className=" form-group">
                                                <label htmlFor="fullName">Họ và tên</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    {...register("fullName")}
                                                />
                                            </div>

                                            <div className=" form-group">
                                                <label htmlFor="phone">Số điện thoại</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    {...register("phone")}
                                                />
                                            </div>

                                            <div className=" form-group">
                                                <label htmlFor="city">Tỉnh / Thành phố</label>
                                                <select className="form-control" {...register("city")}>
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
                                                    className="form-control"
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
                                                    className="form-control"
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

                                            <div className=" form-group">
                                                <label htmlFor="address">Địa chỉ</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    {...register("address")}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="card border-secondary mb-5">
                                    <div className="card-header bg-secondary border-0">
                                        <h4 className="font-weight-semi-bold m-0">
                                            Tổng thanh toán
                                        </h4>
                                    </div>
                                    <div className="card-body">
                                        <h5 className="font-weight-medium mb-3">Sản phẩm</h5>
                                        {carts.map((item) => (
                                            <div className="d-flex justify-content-between">
                                                <p>{item.productId.name}</p>
                                                <p>{formatPrice(item.productId.price)}</p>
                                                <p>{item.quantity}</p>
                                            </div>
                                        ))}
                                        <hr className="mt-0" />
                                        {/* <div className="d-flex justify-content-between mb-3 pt-1">
                  <h6 className="font-weight-medium">Subtotal</h6>
                  <h6 className="font-weight-medium">$150</h6>
                </div>
                <div className="d-flex justify-content-between">
                  <h6 className="font-weight-medium">Shipping</h6>
                  <h6 className="font-weight-medium">$10</h6>
                </div> */}
                                    </div>
                                    <div className="card-footer border-secondary bg-transparent">
                                        <div className="d-flex justify-content-between mt-2">
                                            <h5 className="font-weight-bold">Tổng</h5>
                                            <h5 className="font-weight-bold">
                                                {formatPrice(totalPrice)}
                                            </h5>
                                        </div>
                                    </div>
                                </div>
                                <div className="card border-secondary mb-5">
                                    <div className="card-header bg-secondary border-0">
                                        <h4 className="font-weight-semi-bold m-0">
                                            Phương thức thanh toán
                                        </h4>
                                    </div>
                                    <div className="card-body">
                                        <div className="form-group">
                                            <div className="custom-control custom-radio mb-2">
                                                <input
                                                    type="radio"
                                                    value="COD"
                                                    className="custom-control-input"
                                                    id="payment-cod"
                                                    {...register("paymentMethod")}
                                                />
                                                <label
                                                    htmlFor="payment-cod"
                                                    className="custom-control-label"
                                                >
                                                    Thanh toán khi nhận hàng
                                                </label>
                                            </div>
                                            <div className="custom-control custom-radio mb-2">
                                                <input
                                                    type="radio"
                                                    className="custom-control-input"
                                                    id="payment-credit-card"
                                                    value="Credit Card"
                                                    {...register("paymentMethod")}
                                                />
                                                <label
                                                    htmlFor="payment-credit-card"
                                                    className="custom-control-label"
                                                >
                                                    Thẻ tín dụng
                                                </label>
                                            </div>
                                            <div className="custom-control custom-radio mb-2">
                                                <input
                                                    type="radio"
                                                    className="custom-control-input"
                                                    id="payment-bank-transfer"
                                                    value="Bank Transfer"
                                                    {...register("paymentMethod")}
                                                />
                                                <label
                                                    htmlFor="payment-bank-transfer"
                                                    className="custom-control-label"
                                                >
                                                    Chuyển khoản ngân hàng
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-footer border-secondary bg-transparent">
                                        <button
                                            type="submit"
                                            className="btn btn-lg btn-block btn-primary font-weight-bold my-3 py-3"
                                        >
                                            Đặt hàng
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            {/* Checkout End */}
        </div>
    );
};

export default Checkout;
