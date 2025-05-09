import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import './CoolPrintPage.css';
import Header from '../Layout/Header';
import Footer from '../Layout/Footer';
import GuiYeuCau from '../../assets/images/tiep-nhan-yeu-cau.png';
import TuvanThietKe from '../../assets/images/tu-van-thiet-ke.png';
import GuiBaoGia from '../../assets/images/gui-bao-gia.png';
import GiaoHangVaCamOn from '../../assets/images/giao-hang-va-cam-on.png';
import XPAoTShirt from '../../assets/images/xp-ao-tshirt.png';
import XPAoPolo from '../../assets/images/xp-ao-polo.png';
import XPAoKhoac from '../../assets/images/xp-hoodies.png';
import XPAoDaiTay from '../../assets/images/xp-ao-dai-tay.png';
import XPAoSomi from '../../assets/images/xp-ao-so-mi.png';
import XPDolot from '../../assets/images/xp-quan-lot.png';
import XPQuanShort from '../../assets/images/xp-quan-short.png';
import XPNon from '../../assets/images/xp-mu.png';


const CoolPrintPage: React.FC = () => {
    const imagesProduct = [XPAoTShirt, XPAoPolo, XPAoKhoac, XPAoDaiTay, XPAoSomi, XPDolot, XPQuanShort, XPNon];
    return (
        <div>
            <Header />
            <Container className="coolprint-page" style={{ padding: '170px 0px 20px 0px' }}>
                {/* Why Choose Section */}
                <section className="why-choose">
                    <h2 className="text-center">Vì sao lựa chọn CoolxPrint?</h2>
                    <Row className="text-center mt-4">
                        <Col md={3}>
                            <div className="icon-section">
                                <i className="icon-quality"></i> {/* Placeholder for Icon */}
                                <h5>Chất lượng đảm bảo</h5>
                                <p>Các sản phẩm của CoolxPrint đều được sản xuất theo tiêu chuẩn chất lượng của Coolmate</p>
                            </div>
                        </Col>
                        <Col md={3}>
                            <div className="icon-section">
                                <i className="icon-service"></i>
                                <h5>Dịch vụ tận tâm</h5>
                                <p>Cam kết mang đến sự hài lòng 100% với sản phẩm chất lượng.</p>
                            </div>
                        </Col>
                        <Col md={3}>
                            <div className="icon-section">
                                <i className="icon-print"></i>
                                <h5>In với mọi số lượng</h5>
                                <p>Nhận sản xuất sản phẩm với số lượng linh hoạt.</p>
                            </div>
                        </Col>
                        <Col md={3}>
                            <div className="icon-section">
                                <i className="icon-speed"></i>
                                <h5>Xử lý nhanh chóng</h5>
                                <p>Chỉ 4 giờ để sản xuất và đóng gói.</p>
                            </div>
                        </Col>
                    </Row>
                </section>

                {/* How It Works Section */}
                <section className="how-it-works text-white py-4">
                    <div className="how-it-works-container p-4">
                        <h3>CoolxPrint hoạt động như thế nào?</h3>
                        <Button variant="warning">Gửi yêu cầu</Button>
                        <Row className="text-center mt-4">
                            <Col md={3}>
                                <img src={GuiYeuCau} alt="" />
                                <p>Tiếp nhận yêu cầu</p>
                            </Col>
                            <Col md={3}>
                                <img src={TuvanThietKe} alt="" />
                                <p>Tư vấn thiết kế</p>
                            </Col>
                            <Col md={3}>
                                <img src={GuiBaoGia} alt="" />
                                <p>Gửi báo giá</p>
                            </Col>
                            <Col md={3}>
                                <img src={GiaoHangVaCamOn} alt="" />
                                <p>Giao hàng và cảm ơn</p>
                            </Col>
                        </Row>
                    </div>
                </section>

                {/* Product Grid Section */}
                <section className="product-grid my-5">
                    <h2 className="text-center">CÁC SẢN PHẨM CỦA COOLXPRINT</h2>
                    <Row className="mt-4">
                        {['Áo T-shirt', 'Áo polo', 'Áo khoác/Hoodies', 'Áo dài tay', 'Áo sơ mi', 'Đồ lót', 'Quần short', 'Nón'].map((product, index) => (
                            <Col md={3} key={index} className="mb-4">
                                <Card>
                                    <Card.Img variant="top" src={imagesProduct[index]} />
                                    <Card.Body className="text-center">
                                        <Card.Title>{product}</Card.Title>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </section>
            </Container>
            <Footer />
        </div>
    );
};

export default CoolPrintPage;
