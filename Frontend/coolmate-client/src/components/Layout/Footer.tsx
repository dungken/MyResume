import React from "react";
import NSCS from "../../assets/images/ncsc.png";
import DMCA from "../../assets/images/dmca.png";
import BoCongThuong from "../../assets/images/bo-cong-thuong.png";
import IQC from "../../assets/images/iqc.png";

const Footer: React.FC = () => {
    return (
        <div className="wp-site-footer">
            <footer className="site-footer container">
                <div className="site-footer-before d-flex">
                    <div className="listen-contribute">
                        <h3>COOLMATE lắng nghe bạn!</h3>
                        <p>Chúng tôi luôn trân trọng và mong đợi nhận được mọi ý kiến đóng góp từ khách hàng để có
                            thể
                            nâng cấp trải nghiệm dịch vụ và sản phẩm tốt hơn nữa.</p>
                        <a href="">Đóng góp ý kiến</a>
                    </div>
                    <div className="contact">
                        <ul>
                            <li className="d-flex">
                                <div className="icon-hotline">
                                    <i className="fa-solid fa-phone"></i>
                                </div>
                                <div className="info-hotline">
                                    <h4>Hotline </h4>
                                    <p>900.272737 - 028.7777.2737 <br /> (8:30 - 22:00)</p>
                                </div>
                            </li>
                            <li className="d-flex">
                                <div className="icon-hotline">
                                    <i className="fa-regular fa-envelope"></i>
                                </div>
                                <div className="info-hotline">
                                    <h4>Email </h4>
                                    <p>Cool@coolmate.me</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="social-network">
                        <ul className="d-flex">
                            <li>
                                <a href="">
                                    <i className="fa-brands fa-facebook"></i>
                                </a>
                            </li>
                            <li>
                                <a href="">
                                    <i className="fa-brands fa-tiktok"></i>
                                </a>
                            </li>
                            <li>
                                <a href="">
                                    <i className="fa-brands fa-instagram"></i>
                                </a>
                            </li>
                            <li>
                                <a href="">
                                    <i className="fa-brands fa-youtube"></i>
                                </a>
                            </li>
                            <li>
                                <a href="">
                                    <i className="fa-brands fa-twitter"></i>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="site-footer-inner d-flex">
                    <ul>
                        <h4>COOLCLUB</h4>
                        <li>
                            <a href="">
                                Đăng kí thành viên
                            </a>
                        </li>
                        <li>
                            <a href="">
                                Ưu đãi & Đặc quyền
                            </a>
                        </li>
                    </ul>
                    <ul>
                        <h4>CHÍNH SÁCH</h4>
                        <li>
                            <a href="">
                                Chính sách đổi trả 60 ngày
                            </a>
                        </li>
                        <li>
                            <a href="">
                                Chính sách khuyến mãi
                            </a>
                        </li>
                        <li>
                            <a href="">
                                Chính sách bảo mật
                            </a>
                        </li>
                        <li>
                            <a href="">
                                Chính sách giao hàng
                            </a>
                        </li>
                    </ul>
                    <ul>
                        <h4>CHĂM SÓC KHÁCH HÀNG</h4>
                        <li>
                            <a href="">
                                Trải nghiệm mua sắm 100% hài lòng
                            </a>
                        </li>
                        <li>
                            <a href="">
                                Hỏi đáp - FAQs
                            </a>
                        </li>
                        <li>
                            <a href="">
                                Hướng dẫn chọn size
                            </a>
                        </li>
                        <li>
                            <a href="">
                                Blog
                            </a>

                        </li>
                        <li>
                            <a href="">
                                Group mặc đẹp sống chất
                            </a>
                        </li>
                    </ul>
                    <ul>
                        <h4>TÀI LIỆU - TUYỂN DỤNG</h4>
                        <li>
                            <a href="">
                                Tuyển dụng
                            </a>
                        </li>
                        <li>
                            <a href="">
                                Đăng ký bản quyền
                            </a>
                        </li>
                        <li>
                            <a href="">
                                Coolmate 101
                            </a>
                        </li>
                        <li>
                            <a href="">
                                DVKH xuất sắc
                            </a>
                        </li>
                        <li>
                            <a href="">
                                Câu chuyện về Coolmate
                            </a>
                        </li>
                        <li>
                            <a href="">
                                Nhà máy
                            </a>
                        </li>
                        <li>
                            <a href="">
                                Care & Share
                            </a>
                        </li>
                    </ul>
                    <ul>
                        <h4>ĐỊA CHỈ LIÊN HỆ</h4>
                        <li>
                            <a href="">
                                Văn phòng Hà Nội: Tầng 3-4, Tòa nhà BMM, KM2, <br /> Đường Phùng Hưng, Phường Phúc La,
                                Quận Hà <br />
                                Đông, TP Hà Nội
                            </a>
                        </li>
                        <li>
                            <a href="">
                                Văn phòng Tp HCM: Lầu 1, Số 163 Trần Trọng Cung, <br />Phường Tân Thuận Đông, Quận 7,
                                Tp. Hồ
                                Chí Minh
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="site-footer-after d-flex">
                    <ul>
                        <h4>@ CÔNG TY TNHH FASTECH ASIA</h4>
                        <li>
                            <p>Mã số doanh nghiệp: 0108617038. Giấy chứng nhận đăng ký doanh nghiệp do Sở Kế hoạch
                                và
                                Đầu tư TP Hà Nội cấp lần đầu ngày 20/02/2019.</p>
                        </li>
                    </ul>
                    <ul className="certification d-flex">
                        <li>
                            <a href="">
                                <img src={NSCS} alt="" />
                            </a>
                        </li>
                        <li>
                            <a href="">
                                <img src={DMCA} alt="" />
                            </a>
                        </li>
                        <li>
                            <a href="">
                                <img src={BoCongThuong} alt="" />
                            </a>
                        </li>
                        <li>
                            <a href="">
                                <img src={IQC} alt="" />
                            </a>
                        </li>

                    </ul>
                </div>
            </footer>
        </div>

    )
};

export default Footer;