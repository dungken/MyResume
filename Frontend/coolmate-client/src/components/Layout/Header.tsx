import React, { useEffect, useState } from "react";
import Coolclub from "../../assets/images/coolmate.svg";
import rising84 from "../../assets/images/84rising.svg";
import coolxprint from "../../assets/images/coolxprint.svg";
import AllSale from "../../assets/images/all-sale.png";
import SaleAo from "../../assets/images/sale-ao.png";
import SaleQuan from "../../assets/images/sale-quan.png";
import PoloPromaxS2 from "../../assets/images/polo-promax-s2.png";
import TShirtAntManGraphic from "../../assets/images/t-shirt-ant-man-graphic.png";
import TShirtPeace from "../../assets/images/t-shirt-peace.png";
import AoKhoaHeiQ from "../../assets/images/ao-khoac-heiq-viroblock.png";
import Logo from "../../assets/images/logo.png";
import TanktopTheThao from "../../assets/images/tanktop-the-thao.png";
import PoloTheThaoV1 from "../../assets/images/polo-the-thao-v1.png";
import DailyShortExcool from "../../assets/images/daily-short-excool-v2.png";
import MatHangNgay from "../../assets/images/mac-hang-ngay.png";
import ChoiTheThao from "../../assets/images/choi-the-thao.png";
import QuanLotBoxerShorts from "../../assets/images/quan-lot-boxer-shorts.png";
import QuanLongTights from "../../assets/images/quan-long-tights.png";
import QuanLotLongLeg from "../../assets/images/quan-lot-long-leg.png";
import HuynhNhuCollection from "../../assets/images/huynh-nhu-collection.png";
import BSTDogCat from "../../assets/images/bst-dog-cat.png";
import CareShare from "../../assets/images/care-share.png";
import SoLuongIT from "../../assets/images/so-luong-it.png";
import GiaCaCanhTranh from "../../assets/images/gia-ca-canh-tranh.png";
import BaoHanh60Ngay from "../../assets/images/bao-hanh-60ngay.png";
import CacLoaiQuan from "../../assets/images/cac-loai-quan.png";
import SanPhamKhac from "../../assets/images/san-pham-khac.png";
import CacLoaiAo from "../../assets/images/cac-loai-ao.png";
import PhuKien from "../../assets/images/phu-kien.png";
import ViVoucher from "../../assets/images/vi-voucher.png";
import LichSuDonHang from "../../assets/images/lich-su-don-hang.png";
import SoDiaChi from "../../assets/images/so-dia-chi.png";
import CaiDatTaiKhoan from "../../assets/images/cai-dat-tai-khoan.png";
import DanhGiaPhanHoi from "../../assets/images/danh-gia-phan-hoi.png";
import FaqChinhSach from "../../assets/images/faq-chinh-sach.png";
import New from "../../assets/images/new.png";
import Bac from "../../assets/images/bac.png";
import RankingLevel1 from "../../assets/images/ranking-level-1.png";
import RankingLevel2 from "../../assets/images/ranking-level-2.png";
import RankingLevel3 from "../../assets/images/ranking-level-3.png";
import RankingLevel4 from "../../assets/images/ranking-level-4.png";
import QuanDaiTheThaoProActive from "../../assets/images/quan-dai-the-thao-pro-active.png";
import AoDaiTayCompactV2 from "../../assets/images/ao-dai-tay-cotton-compact-v2.png";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import AuthModal from "../Account/AuthModal";
import { GetCategoriesService } from "../../services/ProductService";
import { jwtDecode } from "jwt-decode";
import MyPayload from "../../models/MyJwtPayload";

// Định nghĩa kiểu dữ liệu Category
interface Category {
    id: string;
    name: string;
    description: string;
    status: string;
    parentCategoryId: string | null;
    subCategories: Category[];
}

// Component hiển thị danh mục con
const SubCategoryList: React.FC<{ subCategories: Category[] }> = ({ subCategories }) => {
    // Filter Subcategories have Status = "active"
    const activeSubCategories = subCategories.filter(subCategory => subCategory.status === "Active");

    if (activeSubCategories.length === 0) return null;

    return (
        <ul style={{ margin: '0px 20px' }}>
            {activeSubCategories.map((subCategory) => (
                <li key={subCategory.id}>
                    <Link
                        to={`/collection-product/${subCategory.id}`}
                        style={{ margin: '7px 0px', color: 'black', textDecoration: 'none', display: 'block' }}
                    >
                        {subCategory.name}
                    </Link>
                    <SubCategoryList subCategories={subCategory.subCategories} />
                </li>
            ))
            }
        </ul >
    );
};

const Header = () => {
    const [showModal, setShowModal] = useState(false);
    const handleOpen = () => setShowModal(true);
    const handleClose = () => setShowModal(false);
    interface CartItem {
        productId: string;
        name: string;
        unitPrice: number;
        size: string;
        color: string;
        quantity: number;
        image: string;
    }

    const [cart, setCart] = useState<CartItem[]>([]);

    // Call API to get categories
    const [categories, setCategories] = useState<Category[]>([]);
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await GetCategoriesService() as { success: boolean, data: any, message: string };
                // console.log(response);

                if (response.success) {
                    setCategories(response.data);
                } else {
                    console.error("API call failed:", response.message);
                }
            } catch (error) {
                console.error("API call failed:", error);
            }
        };

        fetchCategories();
    }, []);

    // Lọc các danh mục cha (parentCategoryId === null)
    const parentCategories = categories.filter((cat) => cat.parentCategoryId === null);

    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<any | null>(null);
    // get token from localStorage
    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        if (token) {
            setToken(token);
            setUser(JSON.parse(user!));
        }
    }, []);

    const handleBtnLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    }


    // Get product from local storage
    useEffect(() => {
        const cart = localStorage.getItem('cartItems');
        if (cart) {
            setCart(JSON.parse(cart));
        }
    }, []);

    return (
        <div className="site-header">
            <div className="topbar d-flex jc-space-between container">
                <div className="topbar-left">
                    <ul className="menu-topbar d-flex m-0">
                        <li className="menu-topbar-item">
                            <a href="#" className="menu-topbar-link">
                                <img src={Coolclub} alt="" />
                            </a>
                        </li>
                        <li className="menu-topbar-item">
                            <a href="#" className="menu-topbar-link">
                                <img src={rising84} alt="" />
                            </a>
                        </li>
                        <li className="menu-topbar-item">
                            <a href="#" className="menu-topbar-link">
                                <img src={coolxprint} alt="" />
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="topbar-right">
                    <ul className="menu-topbar d-flex m-0">
                        <li className="menu-topbar-item">
                            <a href="#" className="menu-topbar-link">
                                Tham gia CoolClub
                                <i className="fa-solid fa-star"></i>
                            </a>
                        </li>
                        <li className="menu-topbar-item">
                            <a href="#" className="menu-topbar-link">
                                Blog
                            </a>
                        </li>
                        <li className="menu-topbar-item">
                            <a href="#" className="menu-topbar-link">
                                Về Coolmate
                            </a>
                        </li>
                        <li className="menu-topbar-item">
                            {/* Handle show email user when login successfully */}
                            {token != null ?
                                <div className="dropdown">
                                    <Link
                                        to={"/account/info"}
                                        className="menu-topbar-link dropdown-toggle d-flex align-items-center gap-2"
                                        id="dropdownMenuButton"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                        style={{ textDecoration: "none", color: "inherit" }}
                                    >
                                        <i className="fa-regular fa-user fs-4"></i>
                                        <span className="fw-semibold">{user.email}</span>
                                    </Link>
                                    <ul className="dropdown-menu dropdown-menu-end shadow-sm" aria-labelledby="dropdownMenuButton">
                                        <li>
                                            <Link to="/account/info" className="dropdown-item text-success">
                                                <i className="bi bi-person-circle"></i> Account
                                            </Link>
                                        </li>
                                        <li>
                                            <button className="dropdown-item text-danger" onClick={handleBtnLogout}>
                                                <i className="fa-solid fa-sign-out-alt"></i> Logout
                                            </button>
                                        </li>
                                    </ul>
                                </div>

                                :
                                <a href="#" onClick={handleOpen} className="menu-topbar-link">
                                    Đăng nhập
                                </a>
                            }
                            <AuthModal show={showModal} handleClose={handleClose} />
                        </li>
                    </ul>
                </div>
            </div>
            <div className="topbar-promotion">
                <a href="#">
                    Đồ thu đông mới nhất đang được bán
                    <span>Mua ngay</span>
                    <i className="fa-solid fa-arrow-right"></i>
                </a>
            </div>
            <div className="wp-header">
                <div className="container d-flex">
                    <div className="logo-header">
                        <Link to="/"><img src={Logo} alt="" /></Link>
                    </div>
                    <menu>
                        <ul className="main-menu d-flex m-0">
                            <li className="menu-item">
                                <a href="#" className="menu-link">
                                    Sale
                                </a>
                                <div className="wp-sub-menu container">
                                    <div className="sub-menu">
                                        <p>Chương trình sale <span></span></p>
                                        <ul className="sale-program">
                                            <li>
                                                <a href="#">
                                                    <img src={AllSale} alt="" />
                                                    <span>Tất cả SALE</span>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#">
                                                    <img src="https://mcdn.coolmate.me/image/October2023/mceclip3_89.png"
                                                        alt="" />
                                                    <span>SALE Lớn 50%</span>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#">
                                                    <img src={SaleAo} alt="" />
                                                    <span>SALE Áo</span>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#">
                                                    <img src={SaleQuan} alt="" />
                                                    <span>SALE Quần</span>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                    <ul className="sale-featured">
                                        <li>
                                            <a href="#">
                                                <img src={PoloPromaxS2} alt="" />
                                                <span>Polo Promax-S2</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#">
                                                <img src={TShirtAntManGraphic} alt="" />
                                                <span>T-Shirt Ant-Man Graphic</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#">
                                                <img src={TShirtPeace} alt="" />
                                                <span>T-Shirt Peace</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#">
                                                <img src={AoKhoaHeiQ} alt="" />
                                                <span>Áo khoác HeiQ ViroBlock</span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li className="menu-item">
                                <a href="#" className="menu-link">
                                    Sản phẩm
                                </a>
                                <div className="wp-sub-menu container">
                                    <div className="sub-menu d-flex">
                                        {parentCategories.map((category) => (
                                            <div key={category.id}>
                                                <p>{category.name}</p>
                                                {/* Hiển thị danh mục con */}
                                                <SubCategoryList subCategories={category.subCategories} />
                                            </div>
                                        ))}

                                        <ul className="featured-product">
                                            <li>
                                                <a href="#">
                                                    <img src={TanktopTheThao} alt="" />
                                                    <span>Tanktop thể thao</span>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#">
                                                    <img src={PoloTheThaoV1} alt="" />
                                                    <span>Polo thể thao V1</span>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#">
                                                    <img src={DailyShortExcool} alt="" />
                                                    <span>Daily Short Excool V2</span>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </li>
                            <li className="menu-item">
                                <a href="#" className="menu-link">
                                    Đồ lót
                                </a>
                                <div className="sub-menu">
                                    <ul className="follow-product">
                                        <p>Theo sản phẩm</p>
                                        <li>
                                            <a href="#">
                                                Tất cả
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#">
                                                Brief (Tam giác)
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#">
                                                Trunk (Boxer)
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#">
                                                Boxer Brief (Boxer dài)
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#">
                                                Long Leg
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#">
                                                Boxer shorts
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#">
                                                Long Tight
                                            </a>
                                        </li>
                                    </ul>
                                    <ul className="follow-demand">
                                        <p>Theo nhu cầu</p>
                                        <li>
                                            <a href="#">
                                                <img src={MatHangNgay} alt="" />
                                                <span>Mặc hàng ngày</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#">
                                                <img src={ChoiTheThao} alt="" />
                                                <span>Chơi thể thao</span>
                                            </a>
                                        </li>
                                    </ul>
                                    <ul className="featured-product">
                                        <li>
                                            <a href="#">
                                                <img src={QuanLotBoxerShorts} alt="" />
                                                <span>Quần lót Boxer Shorts</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#">
                                                <img src={QuanLongTights} alt="" />
                                                <span>Quần Long Tights</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#">
                                                <img src={QuanLotLongLeg} alt="" />
                                                <span>Quần lót Long Leg</span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li className="menu-item">
                                <a href="#" className="menu-link">
                                    Đồ thể thao
                                </a>
                            </li>
                            <li className="menu-item">
                                <a href="#" className="menu-link">
                                    Mặc hàng ngày
                                </a>
                            </li>
                            <li className="menu-item">
                                <a href="#" className="menu-link">
                                    Nước hoa
                                </a>
                            </li>
                            <li className="menu-item">
                                <a href="#" className="menu-link">
                                    Sản xuất riêng
                                </a>
                                <div className="wp-sub-menu container">
                                    <div className="sub-menu d-flex">
                                        <div className="coolx-print">
                                            <h3>CoolxPrint</h3>
                                            <p>Đặt sản xuất chưa bao giờ đơn giản đến thế</p>
                                            <ul className="coolx-print d-flex">
                                                <li>
                                                    <a href="#">
                                                        <img src={SoLuongIT} alt="" />
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <img src={GiaCaCanhTranh} alt="" />
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <img src={BaoHanh60Ngay} alt="" />
                                                    </a>
                                                </li>
                                            </ul>
                                            <a href="">Khám phá ngay</a>
                                        </div>
                                        <ul className="featured-product d-flex">
                                            <li>
                                                <a href="#">
                                                    <img src={CacLoaiQuan} alt="" />
                                                    <span>Các loại quần</span>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#">
                                                    <img src={SanPhamKhac} alt="" />
                                                    <span>Sản phẩm khác</span>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#">
                                                    <img src={CacLoaiAo} alt="" />
                                                    <span>Các loại áo</span>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#">
                                                    <img src={PhuKien} alt="" />
                                                    <span>Phụ kiện</span>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>

                                </div>
                            </li>
                            <li className="menu-item">
                                <a href="#" className="menu-link">
                                    Care&Share
                                </a>
                                <div className="wp-sub-menu container">
                                    <div className="sub-menu d-flex">
                                        <div className="follow-product">
                                            <p>Theo sản phẩm</p>
                                            <span></span>
                                            <ul className="follow-product">

                                                <li>
                                                    <a href="#">
                                                        Tất cả
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        Áo thun in
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        Phụ kiện
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="collection">
                                            <p>Bộ sưu tập</p>
                                            <span></span>
                                            <ul className="collection">
                                                <li>
                                                    <a href="#" className="d-flex">
                                                        <img src={HuynhNhuCollection} alt="" />
                                                        <span>Huỳnh Như Collection</span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#" className="d-flex">
                                                        <img src={BSTDogCat} alt="" />
                                                        <span>BST Cat & Dog</span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="care-share">
                                            <p>Coolmate cam kết dành 10% doanh thu từ sản phẩm “Care & Share” đóng
                                                góp vào quỹ để tổ chức các hoạt động thiện nguyện dành cho trẻ em có
                                                hoàn cảnh khó khăn.</p>
                                            <img src={CareShare} alt="" />
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </menu>
                    <div className="tools d-flex">
                        <div className="cart">
                            <Link to={'/cart'}>
                                <i className="fa-solid fa-cart-shopping"><span>{cart.length}</span></i>
                            </Link>
                            {cart.length > 0 && (
                                <div className="show-cart-buy">
                                    <div className="num-cart">
                                        <p><span>{cart.length} sản phẩm</span> <Link to="/cart">Xem tất cả</Link></p>
                                    </div>
                                    <div className="list-buy">
                                        <ul className="d-flex">
                                            {cart.map((item, index) => (
                                                <li key={index} className="d-flex">
                                                    <Link to={`/product-detail/${item.productId}`}>
                                                        <img src={item.image} alt="" className="product-thumb" />
                                                    </Link>
                                                    <div className="product-detail">
                                                        <a className="product-name" href="">{item.name}</a>
                                                        <div
                                                            style={{
                                                                width: '20px',
                                                                height: '20px',
                                                                backgroundColor: item.color,
                                                                borderRadius: '50%',
                                                                margin: '4px 0px',
                                                                cursor: 'pointer'
                                                            }}
                                                        />
                                                        <div className="style">Size: {item.size}</div>
                                                        <p><span className="new-price">{item.unitPrice.toLocaleString()}đ</span></p>
                                                        <p className="num">x{item.quantity}</p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header;