import React, { useState } from 'react';
import { Modal, Tabs, Tab, Form, Table, Row, Col, Image } from 'react-bootstrap';
import './SizeGuideModal.css';
import NguoiGay from '../../assets/images/nguoi-gay.png';
import NguoiBinhThuong from '../../assets/images/nguoi-binh-thuong.png';
import NguoiDayDan from '../../assets/images/nguoi-day-dan.png';

interface SizeGuideModalProps {
    show: boolean;
    handleClose: () => void;
}

const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ show, handleClose }) => {
    const [height, setHeight] = useState(160);
    const [weight, setWeight] = useState(60);
    const [activeTab, setActiveTab] = useState('guide');

    return (
        <Modal show={show} onHide={handleClose} centered size="lg" className="size-guide-modal">
            <Modal.Header closeButton>
                <Modal.Title>Hướng dẫn chọn size</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'guide')} className="mb-3">
                    <Tab eventKey="guide" title="Hướng dẫn chọn size">
                        <Form className="slider-container my-4">
                            <Row className="align-items-center">
                                <Col md={6}>
                                    <Form.Label>Chiều cao</Form.Label>
                                    <Form.Range value={height} onChange={(e) => setHeight(parseInt(e.target.value))} min={150} max={200} />
                                    <div className="slider-value">{height} cm</div>
                                </Col>
                                <Col md={6}>
                                    <Form.Label>Cân nặng</Form.Label>
                                    <Form.Range value={weight} onChange={(e) => setWeight(parseInt(e.target.value))} min={40} max={100} />
                                    <div className="slider-value">{weight} kg</div>
                                </Col>
                            </Row>
                        </Form>

                        {/* Centering the body type section */}
                        <div className="body-type-section">
                            <div className="d-flex flex-column align-items-center">
                                <Image src={NguoiGay} rounded className="body-type-img" />
                                <p>Gầy</p>
                            </div>
                            <div className="d-flex flex-column align-items-center">
                                <Image src={NguoiBinhThuong} rounded className="body-type-img" />
                                <p>Bình thường</p>
                            </div>
                            <div className="d-flex flex-column align-items-center">
                                <Image src={NguoiDayDan} rounded className="body-type-img" />
                                <p>Đầy đặn</p>
                            </div>
                        </div>

                        <div className="suggestion mt-3">
                            <p><strong>Coolmate gợi ý bạn:</strong> Hãy chọn thêm hình dáng cơ thể bên trên để Coolmate gợi ý cho bạn tốt hơn nhé!</p>
                        </div>
                    </Tab>

                    <Tab eventKey="sizeChart" title="Bảng size">
                        <Table striped bordered hover className="size-chart-table mt-4">
                            <thead>
                                <tr>
                                    <th>Size</th>
                                    <th>Chiều cao</th>
                                    <th>Cân nặng</th>
                                    <th>Dài quần</th>
                                    <th>Rộng cạp</th>
                                    <th>Rộng mông</th>
                                    <th>Rộng đùi</th>
                                    <th>Rộng ống</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>M</td>
                                    <td>1m60 - 1m65</td>
                                    <td>55kg - 61kg</td>
                                    <td>95</td>
                                    <td>39</td>
                                    <td>50</td>
                                    <td>29</td>
                                    <td>15.5</td>
                                </tr>
                                <tr>
                                    <td>L</td>
                                    <td>1m66 - 1m72</td>
                                    <td>62kg - 68kg</td>
                                    <td>97</td>
                                    <td>41</td>
                                    <td>52</td>
                                    <td>30</td>
                                    <td>15.5</td>
                                </tr>
                                {/* Additional rows as needed */}
                            </tbody>
                        </Table>
                        <div className="size-note mt-3">
                            <p>Trường hợp số đo của bạn nằm trong khoảng giữa các size với nhau, vui lòng chọn size lớn hơn.</p>
                        </div>
                    </Tab>
                </Tabs>
            </Modal.Body>
        </Modal>
    );
};

export default SizeGuideModal;
