import { useEffect, useState } from "react"
import { getDetailOrder, Order } from "../../../services/order"
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";


const OrderDetail = () => {
    const { id } = useParams();
    const [orderDetail, setOrderDetail] = useState<Order | null>(null);
    console.log(orderDetail)
    useEffect(() => {
        if (!id) return;

        const fetchOrderDetail = async (id: string) => {
            const res = await getDetailOrder(id);
            setOrderDetail(res.data.order);
            toast.success("order detail successfully")
        };
        fetchOrderDetail(id);
    }, [id]);

    const formatPrice = (price: number) => {
        if (price === undefined || price === null) {
            return "0 VND"; // Return a default value if price is undefined
        }
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND";
    };
    return (
        <div className='container mt-4'>
            <table className="table">
                <thead className='table-primary'>
                    <tr>
                        <th scope="col">Mã đơn hàng</th>
                        <th scope="col">Ngày đặt</th>
                        <th scope="col">Product</th>
                        <th scope="col">Tổng tiền</th>
                        <th scope="col">Ten kh</th>
                        <th scope="col">Email</th>
                        <th scope="col">Địa chỉ giao hàng</th>
                        <th scope="col">Trạng thái đơn hàng</th>
                        <th scope="col">Phương thức thanh toán</th>
                        <th scope="col">Trạng thái thanh toán</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{orderDetail?._id}</td>
                        <td>{orderDetail?.createdAt ? new Date(orderDetail.createdAt).toLocaleDateString() : "N/A"}</td>
                        <td>{orderDetail?.orderItems.map((cart) => (
                            <tr>
                                <td>{cart.productId.images && (
                                    <img src={cart.productId.images[0]} alt="" width={50} />
                                )}</td>
                                <td>{cart.productId.name}</td>
                                <td>{cart.productId.price}</td>
                                <td>{cart.quantity}</td>
                            </tr>
                        ))}</td>
                        <td>{formatPrice(orderDetail?.totalPrice ?? 0)}</td>
                        <td>{orderDetail?.userId.userName}</td>
                        <td>{orderDetail?.userId.email}</td>
                        <td>{orderDetail?.shippingAddress.address},{orderDetail?.shippingAddress.ward},{orderDetail?.shippingAddress.district},{orderDetail?.shippingAddress.city}</td>
                        <td>{orderDetail?.orderStatus}</td>
                        <td>{orderDetail?.paymentMethod}</td>
                        <td>{orderDetail?.paymentStatus}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default OrderDetail