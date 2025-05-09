import React, { useState } from 'react';
import { Modal, Button, Form, Tab, Tabs, ToastContainer } from 'react-bootstrap';
import { FaGoogle, FaFacebook } from 'react-icons/fa';
import { LoginService, RegisterService } from '../../services/AuthService';  // Thêm RegisterService
import { toast } from 'react-toastify';
import { ValidateEmail, ValidatePassword, ValidateUsername } from '../../utils/Validation';

interface AuthModalProps {
    show: boolean;
    handleClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ show, handleClose }) => {
    const [activeTab, setActiveTab] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');


    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // console.log(email, password);

        try {
            // Gọi LoginService để thực hiện đăng nhập
            const response: any = await LoginService({ emailOrUsername: email, password });

            // Kiểm tra phản hồi từ API
            if (response && response.data) {
                toast.success('Login successfully');
                // Xử lý khi đăng nhập thành công
                console.log(response.data);
                // Lưu token vào localStorage
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                // Đóng modal
                handleClose();
                // Cập nhật lại trang web
                window.location.reload();
            } else {
                console.log('Login failed: No data in response');
            }
        } catch (error: any) {
            // Xử lý khi có lỗi, ví dụ: 401 Unauthorized
            if (error.response) {
                // Lấy dữ liệu từ response khi có lỗi
                console.log('Error response:', error.response);
                console.log('Error message:', error.response.data.message || error.message);
                toast.error(`${error.response.data.message || error.message}`);
            } else {
                // Xử lý lỗi không có phản hồi (ví dụ: mạng không kết nối)
                console.log('Error:', error.message);
                toast.error(`${error.message}`);
            }
        }
    }

    const validationFormRegister = () => {
        if (!ValidateUsername(username)) return false;
        if (!ValidateEmail(email)) return false;
        if (!ValidatePassword(password, password)) return false;

        if (firstname.length <= 1) {
            toast.error('First name must be at least 2 characters long.');
            return false;
        }
        if (lastname.length <= 1) {
            toast.error('Last name must be at least 2 characters long.');
            return false;
        }
        return true;
    }

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validationFormRegister()) return;
        const userData = {
            username,
            email,
            password,
            firstname,
            lastname
        };

        try {
            const response: any = await RegisterService(userData);
            console.log(response);

            if (response.success === true) {
                toast.success(response.message);
                handleClose();
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            const errorMessage = (error as any).message;
            toast.error(errorMessage.response);
        }

    }

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Cool Club</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5>Rất nhiều đặc quyền và quyền lợi mua sắm đang chờ bạn</h5>
                <div className="d-flex justify-content-between my-3">
                    <Button variant="outline-secondary">Voucher ưu đãi</Button>
                    <Button variant="outline-secondary">Quà tặng độc quyền</Button>
                    <Button variant="outline-secondary">Hoàn tiền Coolcash</Button>
                </div>
                <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'login')} className="mb-3">
                    <Tab eventKey="login" title="Đăng nhập">
                        <Form onSubmit={handleLoginSubmit}>
                            <Form.Group controlId="loginEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Nhập Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group controlId="loginPassword" className="mt-3">
                                <Form.Label>Mật khẩu</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Nhập mật khẩu"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit" className="w-100 mt-3">Đăng nhập</Button>
                        </Form>
                    </Tab>

                    <Tab eventKey="register" title="Đăng ký">
                        <Form onSubmit={handleRegisterSubmit}>
                            <Form.Group controlId="username">
                                <Form.Label>Tên đăng nhập</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Nhập Tên đăng nhập"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </Form.Group>
                            <div className="row">
                                <div className="col-md-6">
                                    <Form.Group controlId="lastname">
                                        <Form.Label>Họ</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nhập Họ"
                                            value={lastname}
                                            onChange={(e) => setLastname(e.target.value)}
                                        />
                                    </Form.Group>
                                </div>
                                <div className="col-md-6">
                                    <Form.Group controlId="firstname">
                                        <Form.Label>Tên</Form.Label>
                                        <Form.Control
                                            type="firstname"
                                            placeholder="Nhập Tên"
                                            value={firstname}
                                            onChange={(e) => setFirstname(e.target.value)}
                                        />
                                    </Form.Group>
                                </div>

                            </div>
                            <Form.Group controlId="email" className="mt-3">
                                <Form.Label>Email của bạn</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Nhập email của bạn"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group controlId="password" className="mt-3">
                                <Form.Label>Mật khẩu</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Nhập mật khẩu"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit" className="w-100 mt-3">Đăng ký tài khoản</Button>
                        </Form>
                        <div className="text-center mt-3">
                            <a href="#" onClick={() => setActiveTab('login')}>Đăng nhập</a>
                        </div>
                    </Tab>
                </Tabs>
            </Modal.Body>
            <ToastContainer />
        </Modal>
    );
};

export default AuthModal;
