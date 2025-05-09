import React, { useEffect, useState } from "react";
import DoiTraCucDe from "../../assets/images/doi-tra-cuc-de.png";
import MienPhiVanChuyen from "../../assets/images/mien-phi-van-chuyen.png";
import DoiTra60Ngay from "../../assets/images/60-ngay-doi-tra.png";
import Hotline from "../../assets/images/hotline.png";
import GiaoHangTanNoi from "../../assets/images/giao-hang-tan-noi.png";
import GiaoHangNhanh from "../../assets/images/giao-hang-nhanh.png";
import ProductImageSlider from "./ProductImageSlider";
import Header from "../Layout/Header";
import Footer from "../Layout/Footer";
import ProductDetailDescription from "./ProductDetailDescription";
import SizeGuideModal from "./SizeGuideModal";
import { useParams, useNavigate } from "react-router-dom";
import { GetProductByIdService } from "../../services/ProductService";


const Product = () => {
    const { productId } = useParams<{ productId: string }>();
    const [product, setProduct] = useState<any>(null);
    const [showSummary, setShowSummary] = useState(false);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleAddToCart = () => {
        if (!selectedSize || !selectedColor) {
            alert("Please select size and color.");
            return;
        }

        const cartItem = {
            productId: product.id,
            name: product.name,
            unitPrice: product.price,
            size: selectedSize,
            color: selectedColor,
            quantity,
            image: productImages[0]
        };

        // Add cartItem to cart (this could be a call to a context or a redux action)
        console.log("Adding to cart:", cartItem);

        // Persist cart items in local storage
        const savedCartItems = localStorage.getItem("cartItems");
        const cartItems = savedCartItems ? JSON.parse(savedCartItems) : [];
        const existingItem = cartItems.find((item: any) => item.id === cartItem.productId);
        if (!existingItem) {
            const updatedCartItems = [...cartItems, cartItem];
            localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
        }

        // Navigate to the cart page
        navigate("/cart", { state: { cartItem } });
    };

    useEffect(() => {
        const handleScroll = () => {
            const halfway = window.innerHeight / 2;
            if (window.scrollY >= halfway) {
                setShowSummary(true);
            } else {
                setShowSummary(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);


    // Call APIs to get product details
    useEffect(() => {
        const fetchProduct = async () => {
            if (productId) {
                try {
                    const response = await GetProductByIdService(productId) as { success: boolean, message: string, data: any };
                    // console.log(response);

                    if (response.success) {
                        setProduct(response.data);
                    }
                    else {
                        console.error("API call failed:", response.message);
                    }
                } catch (error) {
                    console.error("API call failed:", error);
                    throw error;
                }
            } else {
                console.error("Product ID is undefined");
            }
        };
        fetchProduct();
    }, [productId]);

    if (!product) {
        return <div>Loading...</div>;
    }

    const productImages = product.images?.map((image: any) => image.url) ?? [];


    return (
        <div>
            {!showSummary && <Header />}
            <main className="site-homepage">
                <div className="wp-detail-product container">
                    <section className="wp-display-product">
                        <div className="tab-link">
                            <ul className="list-tab-link d-flex mb-0">
                                <li className="link-item">
                                    <a href="">Trang chủ</a>
                                </li>
                                <li className="link-item">
                                    <span>/</span>
                                    <a href="">Sản phẩm</a>
                                </li>
                            </ul>
                        </div>

                        <div className="display-product d-flex row justify-content-center">
                            <div className="col-md-5">
                                <div className="img-relate-product">
                                    <div className="thumbnail-product">
                                        <ProductImageSlider images={productImages} />
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="wp-desc-product">
                                    <div className="desc">
                                        <h1 className="title">{product.name}</h1>
                                        <div className="ranking d-flex">
                                            <div className="list-star">
                                                <i className="fa-solid fa-star"></i>
                                                <i className="fa-solid fa-star"></i>
                                                <i className="fa-solid fa-star"></i>
                                                <i className="fa-solid fa-star"></i>
                                                <i className="fa-solid fa-star"></i>
                                            </div>
                                            {/* <span>(1) | Đã bán (web): 144</span> */}
                                        </div>

                                        <div className="price d-flex">
                                            <span className="new-price">
                                                {new Intl.NumberFormat('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND',
                                                }).format(product.price)}
                                            </span>
                                        </div>

                                        <div className="group-color">
                                            <div className="title">Màu sắc:</div>
                                            <ul className="list-color d-flex m-2">

                                                {product.colors.map((color: { id: string; colorCode: string }) => (
                                                    <div
                                                        key={color.id}
                                                        style={{
                                                            width: '20px',
                                                            height: '20px',
                                                            backgroundColor: color.colorCode,
                                                            borderRadius: '50%',
                                                            marginRight: '2px',
                                                            cursor: 'pointer',
                                                            border: selectedColor === color.colorCode ? '2px solid black' : '1px solid #ddd'
                                                        }}
                                                        onClick={() => setSelectedColor(color.colorCode)}
                                                    />
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="group-size">
                                            <div className="d-flex">
                                                <div className="title">Kích thước: </div>
                                                <a href="#" onClick={(e) => { e.preventDefault(); handleShowModal(); }}>
                                                    Hướng dẫn chọn size
                                                </a>
                                            </div>

                                            {/* Render the modal only when showModal is true */}
                                            {showModal && <SizeGuideModal show={showModal} handleClose={handleCloseModal} />}


                                            <ul className="list-size d-flex">
                                                {['M', 'L', 'XL', '2XL', '3XL'].map(size => (
                                                    <li key={size}>
                                                        <a
                                                            href="#"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                setSelectedSize(size);
                                                            }}
                                                            style={{
                                                                border: selectedSize === size ? '2px solid #14d142' : '1px solid #ddd',
                                                                borderRadius: '50%',
                                                                padding: '5px',
                                                            }}
                                                        >
                                                            {size}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="num-size d-flex">
                                            <input
                                                type="number"
                                                name="num-order"
                                                id="num-order"
                                                value={quantity}
                                                min="1"
                                                max="1000"
                                                onChange={(e) => setQuantity(Number(e.target.value))}
                                            />
                                            <a href="#" className="choose-size" onClick={(e) => { e.preventDefault(); handleAddToCart(); }}>
                                                Thêm vào giỏ hàng
                                            </a>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className="support">
                                <ul className="list-support d-flex">
                                    <li>
                                        <img src={DoiTraCucDe} alt="" />
                                        <p>Đổi trả cực dễ <br /> chỉ cần số điện thoại</p>
                                    </li>
                                    <li>
                                        <img src={MienPhiVanChuyen} alt="" />
                                        <p>Miễn phí vận chuyển<br />
                                            cho đơn hàng trên 200k</p>
                                    </li>
                                    <li>
                                        <img src={DoiTra60Ngay} alt="" />
                                        <p>60 ngày đổi trả<br />
                                            vì bất kỳ lý do gì</p>
                                    </li>
                                    <li>
                                        <img src={Hotline} alt="" />
                                        <p>Hotline 1900.27.27.37<br />
                                            hỗ trợ từ 8h30 - 22h <br />
                                            mỗi ngày</p>
                                    </li>
                                    <li>
                                        <img src={GiaoHangTanNoi} alt="" />
                                        <p>Đến tận nơi nhận hàng trả, <br />hoàn tiền trong 24h</p>
                                    </li>
                                    <li>
                                        <img src={GiaoHangNhanh} alt="" />
                                        <p>Giao hàng nhanh<br /> toàn quốc</p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <ProductDetailDescription productDesc={product.description} />

                    <section className="favorite-product">
                    </section>


                    <section className="reviews-comments d-flex">
                    </section>

                </div>
            </main>
            <Footer />
        </div>

    )
};

export default Product;