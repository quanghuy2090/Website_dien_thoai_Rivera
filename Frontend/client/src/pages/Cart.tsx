// Frontend: React - components/Cart.js
import React, { useEffect, useState } from 'react';
import type { Carts } from './../services/cart';
import { getCart } from './../services/cart';


const Cart = () => {
    const [carts, setCarts] = useState<Carts[]>([]);
    const [totalAmount, setTotalAmount] = useState<number>(0);
    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            try {
                const user = JSON.parse(userData);
                if (user && user._id) {
                    fetchCart(user._id);
                }
            } catch (error) {
                console.error("Error parsing user data:", error);
            }
        }
    }, []);
    const fetchCart = async (userId: string) => {
        try {
            console.log("Fetching cart for user ID:", userId);
            const { data } = await getCart(userId);
            setCarts(data.cart.items || []);
            setTotalAmount(data.totalAmount || 0);
        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    };
    return (
        <div>
            <h2>Shopping Cart</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Product</th>
                        <th scope="col">Name</th>
                        <th scope="col">Price</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Tong</th>
                        <th scope="col">Action</th>

                    </tr>
                </thead>
                <tbody>
                    {carts.map((item) => (
                        <tr>
                            <td>{item.productId?.images && (
                                <img src={item.productId.images[0]} alt="" width={200} />
                            )}</td>

                            <td>{item.productId?.name}</td>
                            <td>{item.productId?.price}</td>
                            <td>{item.quantity}</td>
                            <td>{item.productId.price * item.quantity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <h3>Total Amount: {totalAmount.toFixed()}</h3>
        </div>
    );
};

export default Cart;
