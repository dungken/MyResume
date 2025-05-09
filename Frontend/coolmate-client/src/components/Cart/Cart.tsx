import React, { useState, useEffect } from "react";
import COD from "../../assets/images/cod.png";
import Header from "../Layout/Header";
import { useLocation } from "react-router-dom";
import hexToColorName from "../../utils/hexToColorName";
import { GetInforAddress } from "../../utils/GetInforAddress";
import { Link } from "react-router-dom";
import { InputField, SelectField } from "../../utils/Controls";
import { toast } from "react-toastify";
import { ValidatePhoneNumber } from "../../utils/Validation";
import { CreateOrderService } from "../../services/CartService";

const Cart = () => {
    const [orderSuccess, setOrderSuccess] = useState(false);
    const location = useLocation();
    const [cartItems, setCartItems] = useState<any[]>(() => {
        const savedCartItems = localStorage.getItem("cartItems");

        return savedCartItems ? JSON.parse(savedCartItems) : [];
    });
    console.log('savedCartItems:', cartItems);

    useEffect(() => {
        const savedCartItems = localStorage.getItem("cartItems");
        if (savedCartItems) {
            setCartItems(JSON.parse(savedCartItems));
        } else {
            setCartItems([]);
        }
    }, []);

    useEffect(() => {
        if (location.state && location.state.cartItem) {
            const existingItem = cartItems.find(item => item.id === location.state.cartItem.id);
            if (!existingItem) {
                const updatedCartItems = [...cartItems, location.state.cartItem];
                setCartItems(updatedCartItems);
            }
        }
    }, [location.state]);

    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);

    const handleUpdateCartItem = (id: number, updatedItem: Partial<{ color: string; size: string; quantity: number }>) => {
        const updatedCartItems = cartItems.map(item =>
            item.productId === id ? { ...item, ...updatedItem } : item
        );
        setCartItems(updatedCartItems);
    };

    const handleRemoveCartItem = (id: number) => {
        const updatedCartItems = cartItems.filter(item => item.productId !== id);
        window.location.reload();
        setCartItems(updatedCartItems); // Cập nhật state giỏ hàng
    };

    const handleCheckout = async () => {
        // Handle if user is not logged in
        if (!user) {
            toast.error('Hãy đăng nhập để thanh toán đơn hàng bạn nhé!');
            return;
        }

        const orderData = {
            user,
            cartItems,
            totalAmount: cartItems.reduce((total, item) => total + item.unitPrice * item.quantity, 0),
        };

        console.log('Order data:', orderData);

        // Call API to create order
        try {
            const response = await CreateOrderService(orderData);
            if (response.success) {
                setOrderSuccess(true);
                toast.success('Đặt hàng thành công. Kiểm tra email để xác nhận!.');
                localStorage.removeItem('cartItems');
                setCartItems([]);
            } else {
                toast.error('Đặt hàng thất bại! Vui lòng thử lại sau.');
            }
        }
        catch (error) {
            console.error('Failed to create order:', error);
        }
    };

    const [user, setUser] = useState<any>(null);
    // Get user from local storage
    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            setUser(JSON.parse(user));
        }
    }, []);


    return (
        <div>
            <Header />
            <div className="wp-cart container d-flex flex-wrap align-items-center" style={{ padding: '170px 0px' }}>
                <div className="row w-100 justify-content-center">
                    <div className="wp-info-order-product">
                        <h2 className={`text-center alert alert-${orderSuccess || cartItems.length == 0 ? 'warning' : 'primary'}`}>Giỏ hàng {orderSuccess || cartItems.length == 0 ? 'trống!' : ''}</h2>
                        {
                            orderSuccess || cartItems.length == 0 ?
                                <h4 className="alert alert-success text-center">
                                    Xem thông tin đơn hàng tại <Link to="/account/order-history">đây</Link>
                                </h4>
                                : ''
                        }
                        {
                            !orderSuccess && cartItems.length != 0 && (
                                <div>
                                    <div className="info-order-product alert alert-dark">
                                        <div className="order-product ">
                                            <ul className="list-order-product d-flex p-3 ">
                                                {cartItems.map(item => (
                                                    <li className="order-item row d-flex align-items-center" key={item.productId} style={{ width: '100%' }}>
                                                        <div className="col-md-2">
                                                            <Link to={`/product-detail/${item.productId}`}><img src={item.image} alt="" /></Link>
                                                        </div>
                                                        <div className="wp-name-product col-md-4">
                                                            <div className="name-product d-flex align-items-center">
                                                                <Link to={`/product-detail/${item.productId}`} className="text-black">
                                                                    {item.name}
                                                                </Link>
                                                                <div
                                                                    style={{
                                                                        width: '20px',
                                                                        height: '20px',
                                                                        backgroundColor: item.color,
                                                                        borderRadius: '50%',
                                                                        margin: '4px',
                                                                        cursor: 'pointer',
                                                                    }}
                                                                />
                                                                <span className="sub-name-product">Size:  {item.size}</span>

                                                            </div>
                                                        </div>
                                                        <div className="desc-order-item col-md-3">
                                                            <div className="wp-option-product d-flex">
                                                                <input type="number" name="num-order" id="num-order" value={item.quantity} min="1" max="200" onChange={(e) => handleUpdateCartItem(item.productId, { quantity: parseInt(e.target.value) })} />
                                                                <div className="price">
                                                                    <p className="new-price mb-0">
                                                                        {new Intl.NumberFormat('vi-VN', {
                                                                            style: 'currency',
                                                                            currency: 'VND',
                                                                        }).format(item.unitPrice)}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                        </div>
                                                        <div className="trash-btn col-md-2 text-danger" onClick={() => handleRemoveCartItem(item.productId)}>
                                                            <i className="fa-regular fa-trash-can"></i> Xóa
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="total-cart fw-bold alert alert-success">
                                        <div className="sub-total">
                                            <div className="temporary">
                                                <span>Tạm tính</span>
                                                <span>
                                                    {new Intl.NumberFormat('vi-VN', {
                                                        style: 'currency',
                                                        currency: 'VND',
                                                    }).format(cartItems.reduce((total, item) => total + item.unitPrice * item.quantity, 0))}
                                                </span>
                                            </div>
                                            <div className="delivery-costs">
                                                <span>Phí giao hàng</span>
                                                <span>Miễn phí</span>
                                            </div>
                                        </div>
                                        <div className="total">
                                            <span>Tổng</span>
                                            <span>
                                                {new Intl.NumberFormat('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND',
                                                }).format(cartItems.reduce((total, item) => total + item.unitPrice * item.quantity, 0))}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="payments my-3">
                                        {
                                            user &&
                                            <h5 className="alert alert-secondary">
                                                Thông tin vận chuyển đơn hàng sẽ được lấy từ
                                                <span> </span>
                                                <Link to={"/account/info"}>
                                                    tài khoản
                                                </Link>
                                                <span> </span>
                                                của bạn
                                            </h5>
                                        }
                                        <h2>Hình thức thanh toán</h2>
                                        <div className="form-controll-100 d-flex" id="COD">
                                            <input type="radio" name="payments" id="cod" checked />
                                            <div className="label-input d-flex">
                                                <img src={COD} alt="" />
                                                <label htmlFor="cod">
                                                    COD <br />
                                                    Thanh toán khi nhận hàng
                                                </label>
                                            </div>
                                        </div>
                                        <button id="checkout" onClick={handleCheckout}>
                                            Thanh toán
                                        </button>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
