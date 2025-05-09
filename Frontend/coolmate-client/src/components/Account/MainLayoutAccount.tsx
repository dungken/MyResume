import React from 'react';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';
import { useLocation, Route, Routes } from 'react-router-dom';
import AccountInfo from './AccountInfo';
import { Link } from 'react-router-dom';
import OrderHistory from '../Product/OrderHistory';
import Header from '../Layout/Header';
import Footer from '../Layout/Footer';

const MainLayoutAccount: React.FC = () => {
    const location = useLocation();
    const currentUrl = location.pathname.split('/').pop() || '';

    return (
        <div>
            <Header />
            <Container style={{ padding: '150px 0px 20px 0px' }}>
                <Row>
                    <Col md={3}>
                        <ListGroup className="bg-light rounded p-3 mb-4">
                            <ListGroup.Item className={currentUrl === 'info' ? 'font-weight-bold text-dark' : 'text-muted'}>
                                <Link to="/account/info">Thông tin tài khoản</Link>
                            </ListGroup.Item>
                            <ListGroup.Item className={currentUrl === 'order-history' ? 'font-weight-bold text-dark' : 'text-muted'}>
                                <Link to="/account/order-history">Lịch sử đơn hàng</Link>
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                    <Col md={9}>
                        <Routes>
                            <Route path="info" element={<AccountInfo />} />
                            <Route path="order-history" element={<OrderHistory />} />
                        </Routes>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </div>
    );
};

export default MainLayoutAccount;
