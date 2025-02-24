import { useEffect, useState } from "react"
import { Carts, getCart } from "../services/cart"
import { useForm } from "react-hook-form";
import { createOrder, District, IShippingAddress, Order, Province, Ward } from "../services/order";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
    const { register, handleSubmit, setValue, watch } = useForm<IShippingAddress & { paymentMethod: Order["paymentMethod"] }>({

    });
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
                const { data } = await axios.get("https://provinces.open-api.vn/api/?depth=3");
                console.log(data);
                setProvinces(data);
            } catch (error) {
                console.log(error)
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
                const total = data.cart.items.reduce((sum: number, item: Carts) => sum + item.productId.price * item.quantity, 0);
                setTotalPrice(total);
            } else {
                setCarts([]);
                setTotalPrice(0);
            }

        } catch (error) {
            console.log(error)
        }
    };


    const onSubmit = async (formData: IShippingAddress & { paymentMethod: Order["paymentMethod"] }) => {
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

            toast.success("Checkout successfully")
            nav("/")
            console.log(data);
            setCarts([]);
            setTotalPrice(0);
        } catch (error) {
            console.log(error);
            toast.error("Error creating");
        }
    }
    return (
        <div>
            {carts.map((item) => (
                <div>
                    <p>{item.productId.name}</p>
                    <p>{item.productId.price}</p>
                    <p>{item.quantity}</p>
                </div>
            ))}
            <h3>{totalPrice}</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <div className="form-group">
                        <label htmlFor="fullName">fullName</label>
                        <input type="text" className="form-control"{...register("fullName")} />

                    </div>

                    <div className="form-group">

                        <label htmlFor="phone">Phone</label>
                        <input type="text" className="form-control"{...register("phone")} />

                    </div>

                    <div className="form-group">
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

                    <div className="form-group">
                        <label htmlFor="district">Quận / Huyện</label>
                        <select className="form-control" {...register("district")} disabled={!districts.length}>
                            <option value="">Chọn quận / huyện</option>
                            {districts.map((district) => (
                                <option key={district.code} value={district.name}>
                                    {district.name}
                                </option>
                            ))}
                        </select>

                    </div>

                    <div className="form-group">
                        <label htmlFor="ward">Phường / Xã</label>
                        <select className="form-control" {...register("ward")} disabled={!wards.length}>
                            <option value="">Chọn phường / xã</option>
                            {wards.map((ward) => (
                                <option key={ward.code} value={ward.name}>
                                    {ward.name}
                                </option>
                            ))}
                        </select>

                    </div>

                    <div className="form-group">
                        <label htmlFor="address">address</label>
                        <input type="text" className="form-control"{...register("address")} />

                    </div>

                    <div className="form-group">
                        <label>Phương thức thanh toán</label>
                        <div>
                            <label>
                                <input type="radio" value="COD" {...register("paymentMethod")} />
                                Thanh toán khi nhận hàng
                            </label>
                        </div>
                        <div>
                            <label>
                                <input type="radio" value="Credit Card" {...register("paymentMethod")} />
                                Thẻ tín dụng
                            </label>
                        </div>
                        <div>
                            <label>
                                <input type="radio" value="Bank Transfer" {...register("paymentMethod")} />
                                Chuyển khoản ngân hàng
                            </label>
                        </div>

                    </div>


                </div>
                <div>
                    <button type="submit">Đặt hàng</button>
                </div>
            </form>
        </div>
    )
}

export default Checkout