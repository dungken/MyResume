import React, { useState, useEffect } from 'react';
import Header from '../Layout/Header';
import Footer from '../Layout/Footer';
import { Link } from 'react-router-dom';
import { GetOrderHistoryService } from '../../services/CartService';
import { GetProductByIdService } from '../../services/ProductService';

interface OrderDetail {
    id: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    discountAmount: number;
    total: number;
}

interface Order {
    id: string;
    userId: string;
    orderDate: string;
    status: string;
    totalAmount: number;
    orderDetails: OrderDetail[];
    payment: null;
}

const OrderHistory = () => {
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        // Giả lập dữ liệu đơn hàng
        try {
            const user = localStorage.getItem('user');
            const userId = user ? JSON.parse(user).id : null;

            GetOrderHistoryService(userId).then((response: any) => {
                if (response.success) {
                    setOrders(response.data);
                } else {
                    console.error("API call failed");
                    setOrders([]);
                }
            }).catch(error => {
                console.error("API call failed:", error);
                setOrders([]);
            });

        } catch (error) {
            console.error("API call failed:", error);
            throw error;
        }
    }, []);

    return (
        <div className="container mt-3">
            <h3 className="text-center mb-4 alert alert-primary">Lịch sử đơn hàng</h3>
            <div className="list-group">
                {orders.map((order) => (
                    <div key={order.id} className="list-group-item rounded my-3 bg-light">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <h5 className="mb-0">Coolmate Official Store</h5>
                            <span
                                className={`badge ${order.status === 'Completed' ? 'bg-success' :
                                    order.status === 'Pending' ? 'bg-warning' :
                                        order.status === 'Cancelled' ? 'bg-danger' : 'bg-info'}`
                                }
                            >
                                {order.status}
                            </span>
                        </div>
                        <div className="mb-2">
                            {order.orderDetails.map((detail) => (
                                // Render product detail
                                <React.Fragment key={detail.id}>
                                    <RenderProduct productId={detail.productId} quantity={detail.quantity} />
                                </React.Fragment>
                            ))}
                        </div>
                        <div className="row d-flex align-items-center">
                            <div className="d-flex justify-content-start">
                                <p className="mb-0">
                                    <strong>Ngày đặt hàng:</strong>{" "}
                                    {new Date(order.orderDate).toLocaleDateString("vi-VN", {
                                        weekday: "long",
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                    })}
                                </p>
                            </div>

                            <div className="d-flex justify-content-end">
                                <p className="mb-0"><strong>Tổng đơn hàng:</strong> {order.totalAmount.toLocaleString()}đ</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div >
    );
};


const RenderProduct = ({ productId, quantity }: { productId: string, quantity: number }) => {
    const [product, setProduct] = useState<{ id: string, name: string, price: number }>({ id: productId, name: 'Áo thun nam', price: 150000 });

    useEffect(() => {
        const fetchProduct = async () => {
            const response: any = await GetProductByIdService(productId);
            if (response.success) {
                const product = response.data;
                setProduct({
                    id: product.id,
                    name: product.name,
                    price: product.price
                });

            } else {
                console.error("API call failed");
            }
        };

        fetchProduct();
    }, [productId]);

    return (
        <div className="col-md-12 mb-3">
            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6">
                            <Link to={`/product-detail/${product.id}`}>
                                {product.name}
                            </Link>
                        </div>
                        <div className="col-md-6 row">
                            <div className="col-md-3">
                                <p className="card-text"> {product.price.toLocaleString()}đ</p>
                            </div>
                            <div className="col-md-3">
                                <p className="mb-1">{quantity}</p>
                            </div>
                            <div className="col-md-3">
                                <p className="mb-1"> {((quantity * product.price).toLocaleString())}đ</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderHistory;
